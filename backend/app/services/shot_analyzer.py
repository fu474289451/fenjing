from pathlib import Path

from app.models import Shot


def analyze_shots(
    frame_paths: list[Path],
    scenes: list[tuple[float, float]],
    job_id: str,
) -> list[Shot]:
    """Build Shot objects for each scene. V1 uses default values for shot_size and camera_movement."""
    shots = []

    for i, ((start, end), frame_path) in enumerate(zip(scenes, frame_paths)):
        duration = end - start

        def format_timecode(seconds: float) -> str:
            h = int(seconds // 3600)
            m = int((seconds % 3600) // 60)
            s = seconds % 60
            return f"{h:02d}:{m:02d}:{s:06.3f}"

        shot = Shot(
            shot_number=i + 1,
            screenshot_url=f"/static/frames/{job_id}/{frame_path.name}",
            timecode_start=format_timecode(start),
            timecode_end=format_timecode(end),
            duration_seconds=round(duration, 3),
            shot_size="中景",
            camera_movement="固定",
            description=f"镜头 {i + 1}",
        )
        shots.append(shot)

    return shots
