from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import json
import uuid
import os
from typing import Optional, List, Dict
from datetime import datetime

# Add to existing imports in your app.py
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("Transformers not available - curriculum generation disabled")

class CurriculumRequest(BaseModel):
    skill: str
    level: Optional[str] = "beginner"
    hours_budget: Optional[int] = 20
    goal: Optional[str] = ""

class QuizSubmission(BaseModel):
    user_id: str
    course_id: str
    lesson_id: str
    answers: List[Dict[str, int]]

class CurriculumGenerator:
    def __init__(self):
        if TRANSFORMERS_AVAILABLE:
            self.model_name = "google/flan-t5-small"
            try:
                self.pipe = pipeline(
                    "text2text-generation",
                    model=self.model_name,
                    max_length=2048,
                    do_sample=False
                )
                self.model_loaded = True
                print("Curriculum generator model loaded successfully")
            except Exception as e:
                print(f"Failed to load curriculum model: {e}")
                self.model_loaded = False
        else:
            self.model_loaded = False
    
    def generate_course(self, req: CurriculumRequest):
        if not self.model_loaded:
            return self._get_sample_course(req.skill)
        
        prompt = f"""
Create a structured learning curriculum for: {req.skill}
Target level: {req.level}
Total hours: {req.hours_budget}
Goal: {req.goal}

Output ONLY valid JSON with this exact structure:
{{
  "skill": "string",
  "rootTitle": "string", 
  "stages": [
    {{
      "id": "stage-1",
      "title": "string",
      "summary": "string",
      "modules": [
        {{
          "id": "m-1-1",
          "title": "string",
          "lessons": [
            {{
              "id": "l-1-1-1",
              "title": "string",
              "time_min": 45,
              "content": "string (learning material)",
              "tasks": ["string", "string", "string"],
              "resources": [
                {{"type": "youtube", "title": "string", "url": "string"}},
                {{"type": "article", "title": "string", "url": "string"}}
              ],
              "quiz": {{
                "passing_score": 70,
                "questions": [
                  {{
                    "id": "q1",
                    "type": "mcq",
                    "prompt": "string",
                    "options": ["string", "string", "string", "string"],
                    "correct_index": 0
                  }}
                ]
              }}
            }}
          ]
        }}
      ]
    }}
  ]
}}

Make 3 stages. Each stage: 2-3 modules. Each module: 2-3 lessons.
Total lessons: 12-18. Each lesson: 30-90 minutes.
Include practical tasks and relevant resources.
"""
        try:
            result = self.pipe(prompt, max_length=4096)[0]["generated_text"]
            
            # Clean and parse JSON
            cleaned = self._clean_json_output(result)
            course_data = json.loads(cleaned)
            
            # Add metadata
            course_data['id'] = str(uuid.uuid4())
            course_data['generated_at'] = datetime.utcnow().isoformat()
            course_data['skill'] = req.skill
            course_data['level'] = req.level
            
            return course_data
            
        except Exception as e:
            print(f"Error generating course: {e}")
            return self._get_sample_course(req.skill)
    
    def _clean_json_output(self, text: str) -> str:
        """Extract JSON from model output"""
        start = text.find('{')
        end = text.rfind('}') + 1
        if start >= 0 and end > start:
            return text[start:end]
        return text
    
    def _get_sample_course(self, skill: str):
        """Fallback sample course"""
        return {
            "id": str(uuid.uuid4()),
            "skill": skill,
            "rootTitle": f"Learn {skill} - Sample Curriculum",
            "generated_at": datetime.utcnow().isoformat(),
            "level": "beginner",
            "stages": [
                {
                    "id": "stage-1",
                    "title": "Foundations",
                    "summary": "Learn the basics and fundamental concepts",
                    "modules": [
                        {
                            "id": "m-1-1",
                            "title": "Getting Started",
                            "lessons": [
                                {
                                    "id": "l-1-1-1",
                                    "title": "Introduction to Key Concepts",
                                    "time_min": 45,
                                    "content": f"This lesson introduces you to the fundamental concepts of {skill}. You'll learn the basic terminology and understand why this skill is important.",
                                    "tasks": [
                                        "Research 3 real-world applications",
                                        "Write down 5 key terms and their definitions",
                                        "Set up your learning environment"
                                    ],
                                    "resources": [
                                        {
                                            "type": "youtube",
                                            "title": f"{skill} Tutorial for Beginners",
                                            "url": "https://www.youtube.com/results?search_query=beginner+tutorial+" + skill.replace(" ", "+")
                                        },
                                        {
                                            "type": "article", 
                                            "title": "Official Documentation",
                                            "url": "https://example.com/docs"
                                        }
                                    ],
                                    "quiz": {
                                        "passing_score": 70,
                                        "questions": [
                                            {
                                                "id": "q1",
                                                "type": "mcq",
                                                "prompt": f"What is the main purpose of {skill}?",
                                                "options": [
                                                    "To solve complex problems",
                                                    "To create beautiful designs", 
                                                    "To manage data efficiently",
                                                    "All of the above"
                                                ],
                                                "correct_index": 0
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }

# Initialize generator
curriculum_generator = CurriculumGenerator()

# In-memory storage (replace with database in production)
COURSES_DB = {}
USER_PROGRESS = {}