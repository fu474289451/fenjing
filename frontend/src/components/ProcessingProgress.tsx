"use client";

import type { JobStatus } from "@/lib/types";
import { Loader2 } from "lucide-react";

const STAGE_LABELS: Record<string, string> = {
  pending: "排队中",
  downloading: "下载视频",
  detecting: "检测镜头",
  extracting: "提取截图",
  analyzing: "分析镜头",
};

interface Props {
  status: JobStatus;
}

export default function ProcessingProgress({ status }: Props) {
  const stages = ["downloading", "detecting", "extracting", "analyzing"];
  const currentIndex = stages.indexOf(status.status);
  const overallProgress =
    status.status === "pending"
      ? 0
      : ((currentIndex + status.progress) / stages.length) * 100;

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-center gap-2 text-gray-700">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-lg font-medium">
          {STAGE_LABELS[status.status] || status.status}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(overallProgress, 2)}%` }}
        />
      </div>

      <p className="text-center text-sm text-gray-500">{status.message}</p>

      <div className="flex justify-between text-xs text-gray-400 px-1">
        {stages.map((stage, i) => (
          <span
            key={stage}
            className={i <= currentIndex ? "text-blue-600 font-medium" : ""}
          >
            {STAGE_LABELS[stage]}
          </span>
        ))}
      </div>
    </div>
  );
}
