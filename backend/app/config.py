from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Fenjing"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000"]
    static_dir: str = "static"
    frames_dir: str = "static/frames"
    max_video_duration: int = 1800  # 30 minutes
    scene_threshold: float = 27.0
    video_max_height: int = 1080

    class Config:
        env_file = ".env"


settings = Settings()
