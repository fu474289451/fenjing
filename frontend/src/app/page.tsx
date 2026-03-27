"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import UrlInputForm from "@/components/UrlInputForm";
import { createJob } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const { job_id } = await createJob(url);
      router.push(`/jobs/${job_id}`);
    } catch {
      setError("提交失败，请检查链接是否有效");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Film className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Fenjing</h1>
        </div>
        <p className="text-lg text-gray-600">在线视频分镜工具</p>
        <p className="text-sm text-gray-400 mt-2">
          输入视频链接，自动识别镜头并生成专业分镜表格
        </p>
      </div>

      <UrlInputForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl text-center">
        <div>
          <div className="text-3xl mb-2">1</div>
          <h3 className="font-medium text-gray-800">粘贴链接</h3>
          <p className="text-sm text-gray-500 mt-1">支持 YouTube, Vimeo 等平台</p>
        </div>
        <div>
          <div className="text-3xl mb-2">2</div>
          <h3 className="font-medium text-gray-800">自动分析</h3>
          <p className="text-sm text-gray-500 mt-1">AI 识别每个镜头并截图</p>
        </div>
        <div>
          <div className="text-3xl mb-2">3</div>
          <h3 className="font-medium text-gray-800">导出分镜</h3>
          <p className="text-sm text-gray-500 mt-1">编辑表格后导出 PNG 或 PDF</p>
        </div>
      </div>
    </main>
  );
}
