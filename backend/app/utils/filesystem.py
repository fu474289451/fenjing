import shutil
from pathlib import Path


def cleanup_job_dir(frames_dir: str, job_id: str):
    """Remove all files for a job."""
    job_dir = Path(frames_dir) / job_id
    if job_dir.exists():
        shutil.rmtree(job_dir)
