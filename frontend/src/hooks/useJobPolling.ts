"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getJobStatus } from "@/lib/api";
import type { JobStatus } from "@/lib/types";

export function useJobPolling(jobId: string | null) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const s = await getJobStatus(jobId);
        setStatus(s);
        if (s.status === "done" || s.status === "error") {
          stopPolling();
        }
      } catch {
        setError("无法获取任务状态");
        stopPolling();
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => stopPolling();
  }, [jobId, stopPolling]);

  return { status, error };
}
