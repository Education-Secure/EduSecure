# backend/models.py
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

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

class MatchResponse(BaseModel):
    job: dict
    matchPercent: float
    breakdown: dict
    base_similarity: float