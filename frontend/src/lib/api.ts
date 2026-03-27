const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
const STATIC_BASE = process.env.NEXT_PUBLIC_STATIC_URL || "";

import type { JobStatus, JobDetail } from "./types";

export async function createJob(url: string): Promise<{ job_id: string; status: string }> {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to create job");
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
