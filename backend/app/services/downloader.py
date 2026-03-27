import os
from pathlib import Path

import yt_dlp

from app.config import settings


def download_video(url: str, work_dir: Path, progress_callback=None) -> tuple[Path, dict]:
    """Download video using yt-dlp. Returns (video_path, metadata)."""
    output_path = work_dir / "source.mp4"

    def progress_hook(d):
        if progress_callback and d["status"] == "downloading":
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            downloaded = d.get("downloaded_bytes", 0)
            if total > 0:
                progress_callback(downloaded / total)

    ydl_opts = {
        "format": f"bestvideo[height<={settings.video_max_height}]+bestaudio/best[height<={settings.video_max_height}]",
        "merge_output_format": "mp4",
        "outtmpl": str(output_path),
        "progress_hooks": [progress_hook],
        "quiet": True,
        "no_warnings": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)

    metadata = {
        "title": info.get("title", "Unknown"),
        "duration": info.get("duration", 0),
        "uploader": info.get("uploader", ""),
    }

    # yt-dlp may add extensions, find the actual file
    if not output_path.exists():
        for f in work_dir.iterdir():
            if f.suffix in (".mp4", ".mkv", ".webm") and f.stem.startswith("source"):
                output_path = f
                break

    return output_path, metadata
