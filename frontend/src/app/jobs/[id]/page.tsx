"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Film } from "lucide-react";
import { useJobPolling } from "@/hooks/useJobPolling";
import { useStoryboard } from "@/hooks/useStoryboard";
import ProcessingProgress from "@/components/ProcessingProgress";
import StoryboardTable from "@/components/StoryboardTable";
import ExportToolbar from "@/components/ExportToolbar";
import type { Shot } from "@/lib/types";

export default function JobPage() {
  const params = useParams();
  const jobId = params.id as string;
  const tableRef = useRef<HTMLDivElement>(null);

  const { status, error: pollError } = useJobPolling(jobId);
  const { data, fetchData, updateShot } = useStoryboard(jobId);

  useEffect(() => {
    if (status?.status === "done" && !data) {
      fetchData();
    }
  }, [status?.status, data, fetchData]);

  const handleUpdateShot = (shotNumber: number, field: keyof Shot, value: string) => {
    updateShot(shotNumber, field, value);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">
              {data?.video_title || "处理中..."}
            </span>
          </div>
        </div>
        {data && (
          <ExportToolbar tableRef={tableRef} videoTitle={data.video_title} />
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error state */}
        {(pollError || status?.status === "error") && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{pollError || status?.message || "处理过程中出现错误"}</p>
          </div>
        )}

        {/* Processing state */}
        {status && status.status !== "done" && status.status !== "error" && (
          <div className="flex items-center justify-center min-h-[400px]">
            <ProcessingProgress status={status} />
          </div>
        )}

        {/* Done state */}
        {data && data.shots.length > 0 && (
          <StoryboardTable
            ref={tableRef}
            shots={data.shots}
            videoTitle={data.video_title}
            onUpdateShot={handleUpdateShot}
          />
        )}
      </div>
    </main>
  );
}
