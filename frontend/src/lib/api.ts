const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
const STATIC_BASE = process.env.NEXT_PUBLIC_STATIC_URL || "";

import type { JobStatus, JobDetail } from "./types";

export async function createJob(url: string): Promise<{ job_id: string; status: string }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw new Error("无法连接到后端服务器，请确认后端已启动 (端口 8000)");
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`服务器返回错误 (${res.status}): ${detail}`);
  }
  return res.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/status`);
  if (!res.ok) throw new Error("Failed to get job status");
  return res.json();
}

export async function getJobDetail(jobId: string): Promise<JobDetail> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error("Failed to get job detail");
  return res.json();
}

export async function updateShot(
  jobId: string,
  shotNumber: number,
  data: { description?: string; shot_size?: string; camera_movement?: string }
) {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/shots/${shotNumber}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update shot");
  return res.json();
}

export function getScreenshotUrl(path: string): string {
  return `${STATIC_BASE}${path}`;
}
