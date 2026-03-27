from pydantic import BaseModel


class JobCreateRequest(BaseModel):
    url: str


class JobCreateResponse(BaseModel):
    job_id: str
    status: str


class Shot(BaseModel):
    shot_number: int
    screenshot_url: str
    timecode_start: str
    timecode_end: str
    duration_seconds: float
    shot_size: str
    camera_movement: str
    description: str


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: float = 0.0
    message: str = ""


class JobDetailResponse(BaseModel):
    job_id: str
    status: str
    video_title: str = ""
    video_duration: float = 0.0
    total_shots: int = 0
    shots: list[Shot] = []


class ShotUpdateRequest(BaseModel):
    description: str | None = None
    shot_size: str | None = None
    camera_movement: str | None = None
