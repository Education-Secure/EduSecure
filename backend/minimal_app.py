from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserProfile(BaseModel):
    skills: List[str]
    desiredRoles: Optional[List[str]] = []
    location: Optional[str] = ""
    yearsExperience: Optional[int] = 0
    top_k: Optional[int] = 10

@app.get("/")
def read_root():
    return {"message": "Job Matching API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Server is running on port 8000"}

@app.post("/match")
def match(user: UserProfile):
    """Simple mock matching endpoint for testing"""
    print(f"Received request for skills: {user.skills}")
    
    # Mock job data
    sample_jobs = [
        {
            "id": "1",
            "title": "Data Scientist",
            "company": "Tech Corp",
            "location": "Johannesburg",
            "description": "Python and ML expert needed",
            "requiredSkills": ["Python", "Machine Learning", "SQL"],
            "url": "#",
            "minYearsExperience": 2,
            "remote": True,
            "postedDate": "2024-01-15"
        },
        {
            "id": "2",
            "title": "Python Developer", 
            "company": "Startup XYZ",
            "location": "Cape Town",
            "description": "Backend Python developer",
            "requiredSkills": ["Python", "Django", "API"],
            "url": "#", 
            "minYearsExperience": 1,
            "remote": False,
            "postedDate": "2024-01-10"
        }
    ]
    
    # Simple mock matching logic
    results = []
    for job in sample_jobs:
        match_score = min(95, 60 + len([s for s in user.skills if s in job['title'] + ' ' + ' '.join(job['requiredSkills'])]) * 10)
        
        results.append({
            "job": job,
            "matchPercent": match_score,
            "breakdown": {
                "skill": match_score - 10,
                "experience": 90,
                "location": 80,
                "recency": 85
            }
        })
    
    return {"results": sorted(results, key=lambda x: x["matchPercent"], reverse=True)[:user.top_k]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)