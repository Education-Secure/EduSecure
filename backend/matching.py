# backend/matching.py
import numpy as np
from sentence_transformers import util
from datetime import datetime
from dateutil import parser as dateparser

class JobMatcher:
    def __init__(self, model):
        self.model = model
    
    def compute_match_score(self, user_profile, job, user_emb, job_emb):
        # Skill similarity (main component)
        skill_sim = (util.pytorch_cos_sim(user_emb, job_emb).item() + 1) / 2
        
        # Title similarity
        title_sim = self._compute_title_similarity(user_profile, job)
        
        # Experience match
        exp_score = self._compute_experience_score(user_profile, job)
        
        # Location match
        loc_score = self._compute_location_score(user_profile, job)
        
        # Recency score
        recency_score = self._compute_recency_score(job)
        
        # Weights (configurable)
        weights = {
            "skill": 0.55,
            "experience": 0.20, 
            "title": 0.15,
            "location": 0.05,
            "recency": 0.05
        }
        
        overall_score = (
            weights["skill"] * skill_sim +
            weights["experience"] * exp_score +
            weights["title"] * title_sim +
            weights["location"] * loc_score +
            weights["recency"] * recency_score
        )
        
        return {
            "overall": max(0, min(100, overall_score * 100)),
            "breakdown": {
                "skill": skill_sim * 100,
                "experience": exp_score * 100,
                "title": title_sim * 100,
                "location": loc_score * 100,
                "recency": recency_score * 100
            }
        }
    
    def _compute_title_similarity(self, user_profile, job):
        if not user_profile.desiredRoles:
            return 0.5  # Neutral score if no desired roles specified
        
        title_text = job.get("title", "")
        roles_text = " ".join(user_profile.desiredRoles)
        
        title_emb = self.model.encode(title_text, convert_to_numpy=True)
        roles_emb = self.model.encode(roles_text, convert_to_numpy=True)
        
        similarity = util.pytorch_cos_sim(roles_emb, title_emb).item()
        return (similarity + 1) / 2
    
    def _compute_experience_score(self, user_profile, job):
        min_exp = job.get("minYearsExperience") or 0
        user_exp = user_profile.yearsExperience or 0
        
        if min_exp == 0:
            return 1.0
        
        if user_exp >= min_exp:
            return 1.0
        else:
            # Gradual penalty for being under-qualified
            return user_exp / min_exp
    
    def _compute_location_score(self, user_profile, job):
        if job.get("remote", False):
            return 1.0
        
        user_loc = (user_profile.location or "").lower()
        job_loc = (job.get("location") or "").lower()
        
        if not user_loc or not job_loc:
            return 0.5  # Neutral if location info missing
        
        # Simple location matching - enhance with geocoding in production
        if user_loc in job_loc or job_loc in user_loc:
            return 1.0
        else:
            return 0.0
    
    def _compute_recency_score(self, job):
        posted = self._parse_posted_date(job.get("postedDate"))
        if not posted:
            return 0.5
        
        days_ago = (datetime.utcnow() - posted).days
        # Exponential decay: 90% at 1 day, 50% at 21 days, 10% at 90 days
        return np.exp(-days_ago / 30.0)
    
    def _parse_posted_date(self, date_value):
        if not date_value:
            return None
        try:
            if isinstance(date_value, (int, float)):
                return datetime.utcfromtimestamp(int(date_value))
            if isinstance(date_value, str):
                return dateparser.parse(date_value)
        except Exception:
            return None