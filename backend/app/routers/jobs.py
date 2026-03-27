import asyncio
import uuid

from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models import (
    JobCreateRequest,
    JobCreateResponse,
    JobDetailResponse,
    JobStatusResponse,
    Shot,
    ShotUpdateRequest,
)
from app.services.pipeline import process_video_sync

router = APIRouter()

# In-memory job store
jobs: dict[str, dict] = {}


@router.post("/jobs", response_model=JobCreateResponse)
async def create_job(req: JobCreateRequest):
    job_id = str(uuid.uuid4())[:8]
    jobs[job_id] = {"status": "pending", "progress": 0.0, "message": "排队中..."}

    asyncio.get_event_loop().run_in_executor(
        None, process_video_sync, job_id, req.url, jobs, settings.frames_dir
    )

    return JobCreateResponse(job_id=job_id, status="pending")


@router.get("/jobs/{job_id}/status", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    job = jobs[job_id]
    return JobStatusResponse(
        job_id=job_id,
        status=job["status"],
        progress=job.get("progress", 0.0),
        message=job.get("message", ""),
    )


@router.get("/jobs/{job_id}", response_model=JobDetailResponse)
async def get_job_detail(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    job = jobs[job_id]
    if job["status"] != "done":
        return JobDetailResponse(job_id=job_id, status=job["status"])

    metadata = job.get("metadata", {})
    shots_data = job.get("shots", [])
    shots = [Shot(**s) for s in shots_data]

    return JobDetailResponse(
        job_id=job_id,
        status="done",
        video_title=metadata.get("title", ""),
        video_duration=metadata.get("duration", 0),
        total_shots=len(shots),
        shots=shots,
    )


@router.patch("/jobs/{job_id}/shots/{shot_number}")
async def update_shot(job_id: str, shot_number: int, req: ShotUpdateRequest):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    job = jobs[job_id]
    if job["status"] != "done":
        raise HTTPException(status_code=400, detail="Job not done yet")

    shots = job.get("shots", [])
    for shot in shots:
        if shot["shot_number"] == shot_number:
            if req.description is not None:
                shot["description"] = req.description
            if req.shot_size is not None:
                shot["shot_size"] = req.shot_size
            if req.camera_movement is not None:
                shot["camera_movement"] = req.camera_movement
            return {"ok": True}

    raise HTTPException(status_code=404, detail="Shot not found")
