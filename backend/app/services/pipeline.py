from pathlib import Path

from app.services.downloader import download_video
from app.services.scene_detector import detect_scenes
from app.services.frame_extractor import extract_frames
from app.services.shot_analyzer import analyze_shots


def process_video_sync(job_id: str, url: str, status_store: dict, frames_dir: str):
    """Run the full video processing pipeline (called via asyncio.to_thread)."""
    work_dir = Path(frames_dir) / job_id
    work_dir.mkdir(parents=True, exist_ok=True)

    try:
        # Stage 1: Download
        status_store[job_id] = {"status": "downloading", "progress": 0.0, "message": "正在下载视频..."}

        def on_download_progress(p):
            status_store[job_id] = {"status": "downloading", "progress": p, "message": "正在下载视频..."}

        video_path, metadata = download_video(url, work_dir, progress_callback=on_download_progress)

        # Stage 2: Scene detection
        status_store[job_id] = {"status": "detecting", "progress": 0.0, "message": "正在检测镜头切换..."}
        scenes = detect_scenes(video_path)

        if not scenes:
            # If no scene changes detected, treat the whole video as one shot
            import cv2
            cap = cv2.VideoCapture(str(video_path))
            total_duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
            cap.release()
            scenes = [(0.0, total_duration)]

        # Stage 3: Frame extraction
        status_store[job_id] = {"status": "extracting", "progress": 0.0, "message": "正在提取镜头截图..."}

        def on_extract_progress(p):
            status_store[job_id] = {"status": "extracting", "progress": p, "message": "正在提取镜头截图..."}

        frame_paths = extract_frames(video_path, scenes, work_dir, progress_callback=on_extract_progress)

        # Stage 4: Analysis
        status_store[job_id] = {"status": "analyzing", "progress": 0.0, "message": "正在分析镜头信息..."}
        shots = analyze_shots(frame_paths, scenes, job_id)

        # Stage 5: Done
        status_store[job_id] = {
            "status": "done",
            "progress": 1.0,
            "message": "处理完成",
            "metadata": metadata,
            "shots": [s.model_dump() for s in shots],
        }

        # Clean up source video to save space
        for f in work_dir.iterdir():
            if f.suffix in (".mp4", ".mkv", ".webm"):
                f.unlink()

    except Exception as e:
        status_store[job_id] = {
            "status": "error",
            "progress": 0.0,
            "message": f"处理失败: {str(e)}",
        }
