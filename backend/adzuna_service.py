import requests
import os
from typing import List, Dict
import time

class AdzunaService:
    def __init__(self):
        self.app_id = "b8826903"
        self.app_key = "d8cdf5bf1daa42dd0823f81043ef954d"
        self.base_url = "https://api.adzuna.com/v1/api/jobs"
        self.country = "za"  # South Africa
    
    def search_jobs(self, what="data scientist", where="johannesburg", results_per_page=20, page=1):
        """Search jobs from Adzuna API"""
        url = f"{self.base_url}/{self.country}/search/{page}"
        
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "results_per_page": results_per_page,
            "what": what,
            "where": where,
            "content-type": "application/json"
        }
        
        try:
            print(f"Fetching jobs from Adzuna: {what} in {where}")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            jobs = self._transform_adzuna_jobs(data.get("results", []))
            print(f"Successfully fetched {len(jobs)} jobs")
            return jobs
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching from Adzuna API: {e}")
            return []
        except Exception as e:
            print(f"Unexpected error: {e}")
            return []
    
    def _transform_adzuna_jobs(self, adzuna_jobs: List[Dict]) -> List[Dict]:
        """Transform Adzuna job format to our format"""
        transformed_jobs = []
        
        for job in adzuna_jobs:
            # Extract skills from title and description using simple keyword matching
            description = f"{job.get('title', '')} {job.get('description', '')}".lower()
            skills = self._extract_skills(description)
            
            transformed_job = {
                "id": str(job.get("id", "")),
                "title": job.get("title", ""),
                "company": job.get("company", {}).get("display_name", "Unknown Company"),
                "location": job.get("location", {}).get("display_name", "Location not specified"),
                "description": job.get("description", "")[:500],  # Limit description length
                "requiredSkills": skills,
                "url": job.get("redirect_url", "#"),
                "minYearsExperience": self._extract_experience(description),
                "remote": "remote" in description or "work from home" in description,
                "postedDate": job.get("created", ""),
                "salary": self._format_salary(job.get("salary_min"), job.get("salary_max"))
            }
            transformed_jobs.append(transformed_job)
        
        return transformed_jobs
    
    def _extract_skills(self, description: str) -> List[str]:
        """Extract skills from job description using keyword matching"""
        skills_keywords = {
            "python": "Python",
            "javascript": "JavaScript",
            "java": "Java",
            "sql": "SQL",
            "machine learning": "Machine Learning",
            "data analysis": "Data Analysis",
            "react": "React",
            "node.js": "Node.js",
            "aws": "AWS",
            "docker": "Docker",
            "kubernetes": "Kubernetes",
            "mongodb": "MongoDB",
            "postgresql": "PostgreSQL",
            "mysql": "MySQL",
            "html": "HTML",
            "css": "CSS",
            "typescript": "TypeScript",
            "angular": "Angular",
            "vue": "Vue.js",
            "php": "PHP",
            "c#": "C#",
            "c++": "C++",
            "ruby": "Ruby",
            "go": "Go",
            "rust": "Rust",
            "scala": "Scala",
            "r language": "R",
            "tensorflow": "TensorFlow",
            "pytorch": "PyTorch",
            "pandas": "Pandas",
            "numpy": "NumPy",
            "tableau": "Tableau",
            "power bi": "Power BI",
            "excel": "Excel",
            "git": "Git",
            "jenkins": "Jenkins",
            "linux": "Linux"
        }
        
        found_skills = []
        description_lower = description.lower()
        
        for keyword, skill_name in skills_keywords.items():
            if keyword in description_lower:
                found_skills.append(skill_name)
        
        # Return unique skills, limit to 8
        return list(set(found_skills))[:8]
    
    def _extract_experience(self, description: str) -> int:
        """Extract years of experience from description"""
        import re
        description_lower = description.lower()
        
        # Look for patterns like "3+ years", "5 years experience", etc.
        patterns = [
            r'(\d+)\+? years? experience',
            r'experience.*?(\d+)\+? years?',
            r'minimum.*?(\d+)\+? years?',
            r'(\d+)\+? years? in'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, description_lower)
            if matches:
                return int(matches[0])
        
        return 0  # Default to 0 if no experience requirement found
    
    def _format_salary(self, min_salary, max_salary):
        """Format salary range"""
        if min_salary and max_salary:
            return f"R{min_salary:,} - R{max_salary:,}"
        elif min_salary:
            return f"From R{min_salary:,}"
        elif max_salary:
            return f"Up to R{max_salary:,}"
        else:
            return "Salary not specified"

# Singleton instance
adzuna_service = AdzunaService()