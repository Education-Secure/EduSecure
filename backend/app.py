from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from sentence_transformers import SentenceTransformer
import numpy as np
import os
from datetime import datetime, timezone
from dateutil import parser as dateparser

from curriculum_generator import curriculum_generator, CurriculumRequest, QuizSubmission, COURSES_DB, USER_PROGRESS

# Import our Adzuna service
from adzuna_service import adzuna_service

# Try import faiss, fallback
try:
    import faiss
    FAISS_AVAILABLE = True
except Exception:
    FAISS_AVAILABLE = False
    print("FAISS not available, using brute-force search")

app = FastAPI(title="Job Matching API", description="AI-powered job matching with real data from Adzuna")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME)

# In-memory stores
JOB_STORE = []
JOB_EMBEDDINGS = None
FAISS_INDEX = None
JOBS_LOADED = False

# ---------- Helper Functions ----------
def embed_texts(texts: List[str]) -> np.ndarray:
    emb = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    emb = emb / np.linalg.norm(emb, axis=1, keepdims=True)
    return emb

def build_faiss_index(embs: np.ndarray):
    global FAISS_INDEX
    d = embs.shape[1]
    index = faiss.IndexFlatIP(d)
    index.add(embs.astype(np.float32))
    FAISS_INDEX = index

def search_topk(emb: np.ndarray, k: int = 10):
    if FAISS_AVAILABLE and FAISS_INDEX is not None:
        D, I = FAISS_INDEX.search(np.array([emb]).astype(np.float32), k)
        scores = D[0].tolist()
        idxs = I[0].tolist()
        return idxs, scores
    else:
        global JOB_EMBEDDINGS
        sims = (JOB_EMBEDDINGS @ emb).tolist()
        idxs = np.argsort(sims)[::-1][:k].tolist()
        scores = [sims[i] for i in idxs]
        return idxs, scores

def combine_job_text(j: dict) -> str:
    components = [
        j.get("title", ""),
        j.get("company", ""),
        j.get("description", ""),
        " ".join(j.get("requiredSkills", [])),
        j.get("location", "")
    ]
    return " ".join(c for c in components if c)

def parse_posted_date(d: Any) -> Optional[datetime]:
    """Parse posted date and return timezone-naive datetime"""
    if not d:
        return None
    try:
        if isinstance(d, (int, float)):
            return datetime.utcfromtimestamp(int(d))
        if isinstance(d, str):
            parsed = dateparser.parse(d)
            if parsed and parsed.tzinfo is not None:
                # Convert to naive datetime by removing timezone info
                parsed = parsed.replace(tzinfo=None)
            return parsed
    except Exception as e:
        print(f"Error parsing date {d}: {e}")
        return None

# ---------- Pydantic Models ----------
class JobIn(BaseModel):
    id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = ""
    requiredSkills: Optional[List[str]] = []
    url: Optional[str] = None
    minYearsExperience: Optional[int] = None
    remote: Optional[bool] = False
    postedDate: Optional[Any] = None

class UserProfile(BaseModel):
    skills: List[str]
    desiredRoles: Optional[List[str]] = []
    location: Optional[str] = ""
    yearsExperience: Optional[int] = 0
    top_k: Optional[int] = 10

class SearchQuery(BaseModel):
    query: str = "data scientist"
    location: str = "johannesburg"
    max_results: int = 20

# ---------- Endpoints ----------
@app.get("/")
def read_root():
    return {
        "message": "Job Matching API with Adzuna Integration", 
        "status": "running",
        "jobs_loaded": len(JOB_STORE),
        "adzuna_ready": True
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "jobs_loaded": len(JOB_STORE)}


@app.post("/generate-curriculum")
async def generate_curriculum(request: CurriculumRequest):
    """Generate a learning curriculum for a skill"""
    try:
        course = curriculum_generator.generate_course(request)
        COURSES_DB[course['id']] = course
        
        # Initialize empty progress for this course
        USER_PROGRESS[course['id']] = {}
        
        return {
            "success": True,
            "course_id": course['id'],
            "course": course
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate curriculum: {str(e)}")

@app.get("/course/{course_id}")
async def get_course(course_id: str):
    """Get a generated course by ID"""
    course = COURSES_DB.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.get("/course/{course_id}/lesson/{lesson_id}")
async def get_lesson(course_id: str, lesson_id: str):
    """Get a specific lesson without revealing quiz answers"""
    course = COURSES_DB.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Find the lesson
    lesson = None
    for stage in course['stages']:
        for module in stage['modules']:
            for l in module['lessons']:
                if l['id'] == lesson_id:
                    lesson = l.copy()  # Create a copy to modify
                    break
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Remove correct answers before sending to client
    if 'quiz' in lesson and 'questions' in lesson['quiz']:
        for question in lesson['quiz']['questions']:
            if 'correct_index' in question:
                del question['correct_index']
    
    return lesson

@app.post("/submit-quiz")
async def submit_quiz(submission: QuizSubmission):
    """Submit quiz answers and check results"""
    course = COURSES_DB.get(submission.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Find the lesson and its correct answers
    correct_answers = {}
    lesson_passing_score = 70
    
    for stage in course['stages']:
        for module in stage['modules']:
            for lesson in module['lessons']:
                if lesson['id'] == submission.lesson_id:
                    lesson_passing_score = lesson['quiz'].get('passing_score', 70)
                    for question in lesson['quiz']['questions']:
                        correct_answers[question['id']] = question.get('correct_index', 0)
                    break
    
    # Calculate score
    correct_count = 0
    total_questions = len(submission.answers)
    
    for answer in submission.answers:
        question_id = answer.get('question_id')
        selected_index = answer.get('selected_index')
        if question_id in correct_answers and correct_answers[question_id] == selected_index:
            correct_count += 1
    
    score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    passed = score_percentage >= lesson_passing_score
    
    # Store progress
    user_key = f"{submission.user_id}_{submission.course_id}"
    if user_key not in USER_PROGRESS:
        USER_PROGRESS[user_key] = {}
    
    USER_PROGRESS[user_key][submission.lesson_id] = {
        "score": score_percentage,
        "passed": passed,
        "completed_at": datetime.utcnow().isoformat()
    }
    
    return {
        "score": round(score_percentage, 1),
        "passed": passed,
        "correct_answers": correct_count,
        "total_questions": total_questions
    }

@app.get("/user/{user_id}/progress/{course_id}")
async def get_user_progress(user_id: str, course_id: str):
    """Get user progress for a course"""
    user_key = f"{user_id}_{course_id}"
    progress = USER_PROGRESS.get(user_key, {})
    return {"progress": progress}

@app.post("/search/adzuna")
def search_adzuna_jobs(search: SearchQuery):
    """Search for jobs on Adzuna and add them to our database"""
    global JOB_STORE, JOB_EMBEDDINGS, FAISS_INDEX, JOBS_LOADED
    
    print(f"Searching Adzuna for: {search.query} in {search.location}")
    
    # Fetch jobs from Adzuna
    jobs_data = adzuna_service.search_jobs(
        what=search.query,
        where=search.location,
        results_per_page=search.max_results
    )
    
    if not jobs_data:
        return {"message": "No jobs found or API error", "jobs_found": 0}
    
    # Convert to JobIn objects
    jobs_to_ingest = []
    for job_data in jobs_data:
        jobs_to_ingest.append(JobIn(**job_data))
    
    # Ingest the jobs
    result = ingest_jobs_internal(jobs_to_ingest)
    JOBS_LOADED = True
    
    return {
        "message": f"Successfully loaded {result['ingested']} jobs from Adzuna",
        "jobs_found": len(jobs_data),
        "jobs_ingested": result['ingested']
    }

@app.post("/ingest")
def ingest_jobs(jobs: List[JobIn]):
    """Ingest jobs provided in the request"""
    global JOBS_LOADED
    result = ingest_jobs_internal(jobs)
    JOBS_LOADED = True
    return result

def ingest_jobs_internal(jobs: List[JobIn]):
    """Internal function to ingest jobs"""
    global JOB_STORE, JOB_EMBEDDINGS, FAISS_INDEX
    
    new_texts = []
    new_jobs = []
    
    for j in jobs:
        j_dict = j.dict()
        if any(existing["id"] == j_dict["id"] for existing in JOB_STORE):
            continue
        new_jobs.append(j_dict)
        new_texts.append(combine_job_text(j_dict))

    if not new_jobs:
        return {"ingested": 0}

    new_embs = embed_texts(new_texts)
    JOB_STORE.extend(new_jobs)
    
    if JOB_EMBEDDINGS is None:
        JOB_EMBEDDINGS = new_embs
    else:
        JOB_EMBEDDINGS = np.vstack([JOB_EMBEDDINGS, new_embs])

    if FAISS_AVAILABLE:
        if FAISS_INDEX is None:
            build_faiss_index(JOB_EMBEDDINGS)
        else:
            FAISS_INDEX.add(new_embs.astype(np.float32))

    return {"ingested": len(new_jobs)}

@app.post("/match")
def match(user: UserProfile):
    """Match user profile against available jobs"""
    if not JOB_STORE:
        # If no jobs loaded, automatically fetch some from Adzuna
        print("No jobs in database, fetching from Adzuna...")
        search_result = search_adzuna_jobs(SearchQuery(
            query=" ".join(user.desiredRoles or ["software"]),
            location=user.location or "south africa",
            max_results=user.top_k or 20
        ))
        
        if not JOB_STORE:
            return get_sample_matches()
    
    user_text = " ".join(user.skills + (user.desiredRoles or []) + ([user.location] if user.location else []))
    user_emb = embed_texts([user_text])[0]
    
    k = min(user.top_k or 10, len(JOB_STORE))
    idxs, sim_scores = search_topk(user_emb, k=k)
    
    results = []
    for idx, base_sim in zip(idxs, sim_scores):
        job = JOB_STORE[idx]
        
        # Calculate match score
        skill_sim = (base_sim + 1) / 2
        
        # Experience score
        min_exp = job.get("minYearsExperience") or 0
        exp_score = min(1.0, (user.yearsExperience or 0) / min_exp) if min_exp > 0 else 1.0
        
        # Location score
        loc_score = 1.0 if job.get("remote", False) or (user.location and user.location.lower() in (job.get("location") or "").lower()) else 0.0
        
        # Recency score - FIXED: Use naive datetime for both
        posted = parse_posted_date(job.get("postedDate"))
        days_ago = (datetime.utcnow() - posted).days if posted else 30
        recency_score = np.exp(-days_ago / 30.0)
        
        # Weighted overall score
        weights = {"skill": 0.55, "exp": 0.20, "loc": 0.20, "recency": 0.05}
        overall = (weights["skill"] * skill_sim + 
                  weights["exp"] * exp_score + 
                  weights["loc"] * loc_score + 
                  weights["recency"] * recency_score)
        
        match_percent = round(max(0, min(100, overall * 100)), 1)
        
        results.append({
            "job": job,
            "matchPercent": match_percent,
            "breakdown": {
                "skill": round(skill_sim * 100, 1),
                "experience": round(exp_score * 100, 1),
                "location": round(loc_score * 100, 1),
                "recency": round(recency_score * 100, 1)
            }
        })
    
    return {"results": sorted(results, key=lambda x: x["matchPercent"], reverse=True)}

def get_sample_matches():
    """Fallback sample data"""
    sample_jobs = [
        {
            "id": "1", "title": "Data Scientist", "company": "Tech Corp",
            "location": "Johannesburg", "description": "Python and ML expert needed",
            "requiredSkills": ["Python", "Machine Learning", "SQL"], "url": "#",
            "minYearsExperience": 2, "remote": True, "postedDate": "2024-01-15"
        }
    ]
    
    results = [{
        "job": job,
        "matchPercent": 85.0,
        "breakdown": {"skill": 90.0, "experience": 100.0, "location": 50.0, "recency": 80.0}
    } for job in sample_jobs]
    
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)