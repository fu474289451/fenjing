"use client";

import { useState, useCallback } from "react";
import { getJobDetail, updateShot as apiUpdateShot } from "@/lib/api";
import type { JobDetail, Shot } from "@/lib/types";

export function useStoryboard(jobId: string) {
  const [data, setData] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const detail = await getJobDetail(jobId);
      setData(detail);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const updateShot = useCallback(
    async (shotNumber: number, field: keyof Shot, value: string) => {
      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          shots: prev.shots.map((s) =>
            s.shot_number === shotNumber ? { ...s, [field]: value } : s
          ),
        };
      });

      await apiUpdateShot(jobId, shotNumber, { [field]: value });
    },
    [jobId]
  );

  return { data, loading, fetchData, updateShot };
}
