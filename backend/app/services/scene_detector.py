from pathlib import Path

from scenedetect import detect, ContentDetector

from app.config import settings


def detect_scenes(video_path: Path, threshold: float | None = None) -> list[tuple[float, float]]:
    """Detect scene changes in video. Returns list of (start_seconds, end_seconds)."""
    th = threshold or settings.scene_threshold
    scene_list = detect(str(video_path), ContentDetector(threshold=th))

    scenes = []
    for scene in scene_list:
        start = scene[0].get_seconds()
        end = scene[1].get_seconds()
        scenes.append((start, end))

    return scenes
