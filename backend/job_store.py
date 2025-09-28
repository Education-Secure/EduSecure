# backend/job_store.py
import json
import sqlite3
from typing import List, Dict
import numpy as np

class JobStore:
    def __init__(self, db_path="jobs.db"):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                title TEXT,
                company TEXT,
                location TEXT,
                description TEXT,
                requiredSkills TEXT,
                url TEXT,
                minYearsExperience INTEGER,
                remote BOOLEAN,
                postedDate TEXT,
                embedding BLOB
            )
        ''')
        conn.commit()
        conn.close()
    
    def save_jobs(self, jobs: List[Dict], embeddings: np.ndarray):
        conn = sqlite3.connect(self.db_path)
        for job, embedding in zip(jobs, embeddings):
            conn.execute('''
                INSERT OR REPLACE INTO jobs 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                job['id'],
                job['title'],
                job['company'],
                job['location'],
                job['description'],
                json.dumps(job['requiredSkills']),
                job['url'],
                job['minYearsExperience'],
                job['remote'],
                job['postedDate'],
                embedding.tobytes()
            ))
        conn.commit()
        conn.close()
    
    def load_jobs(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM jobs')
        jobs = []
        embeddings = []
        for row in cursor.fetchall():
            job = {
                'id': row[0],
                'title': row[1],
                'company': row[2],
                'location': row[3],
                'description': row[4],
                'requiredSkills': json.loads(row[5]),
                'url': row[6],
                'minYearsExperience': row[7],
                'remote': bool(row[8]),
                'postedDate': row[9]
            }
            jobs.append(job)
            embedding = np.frombuffer(row[10], dtype=np.float32)
            embeddings.append(embedding)
        conn.close()
        return jobs, np.array(embeddings) if embeddings else None