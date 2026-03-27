export interface Shot {
  shot_number: number;
  screenshot_url: string;
  timecode_start: string;
  timecode_end: string;
  duration_seconds: number;
  shot_size: string;
  camera_movement: string;
  description: string;
}

export interface JobStatus {
  job_id: string;
  status: string;
  progress: number;
  message: string;
}

export interface JobDetail {
  job_id: string;
  status: string;
  video_title: string;
  video_duration: number;
  total_shots: number;
  shots: Shot[];
}

export const SHOT_SIZES = ["远景", "全景", "中景", "近景", "特写"];
export const CAMERA_MOVEMENTS = ["固定", "推", "拉", "摇", "移", "跟"];
