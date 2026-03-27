"use client";

import { useState } from "react";
import { Download, ImageIcon, FileText, Loader2 } from "lucide-react";
import { exportAsPng, exportAsPdf } from "@/lib/export";

interface Props {
  tableRef: React.RefObject<HTMLDivElement | null>;
  videoTitle: string;
}

export default function ExportToolbar({ tableRef, videoTitle }: Props) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: "png" | "pdf") => {
    if (!tableRef.current) return;
    setExporting(format);
    try {
      const filename = `${videoTitle || "storyboard"}_分镜表`;
      if (format === "png") {
        await exportAsPng(tableRef.current, `${filename}.png`);
      } else {
        await exportAsPdf(tableRef.current, `${filename}.pdf`);
      }
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 flex items-center gap-1">
        <Download className="w-4 h-4" />
        导出:
      </span>
      <button
        onClick={() => handleExport("png")}
        disabled={!!exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {exporting === "png" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
        PNG
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={!!exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {exporting === "pdf" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        PDF
      </button>
    </div>
  );
}
