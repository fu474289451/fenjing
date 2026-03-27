import subprocess
from pathlib import Path


def extract_frames(
    video_path: Path,
    scenes: list[tuple[float, float]],
    work_dir: Path,
    progress_callback=None,
) -> list[Path]:
    """Extract a representative frame from each scene using FFmpeg."""
    frame_paths = []
    total = len(scenes)

    for i, (start, end) in enumerate(scenes):
        # Pick frame at 20% into the scene to avoid transition artifacts
        duration = end - start
        target_time = start + duration * 0.2
        output_file = work_dir / f"{i + 1:04d}.jpg"

        cmd = [
            "ffmpeg",
            "-ss", f"{target_time:.3f}",
            "-i", str(video_path),
            "-frames:v", "1",
            "-q:v", "2",
            "-y",
            str(output_file),
        ]
        subprocess.run(cmd, capture_output=True, check=True)
        frame_paths.append(output_file)

        if progress_callback:
            progress_callback((i + 1) / total)

    return frame_paths
