"use client";

import { forwardRef } from "react";
import type { Shot } from "@/lib/types";
import { SHOT_SIZES, CAMERA_MOVEMENTS } from "@/lib/types";
import { getScreenshotUrl } from "@/lib/api";
import EditableCell from "./EditableCell";

interface Props {
  shots: Shot[];
  videoTitle: string;
  onUpdateShot: (shotNumber: number, field: keyof Shot, value: string) => void;
}

const StoryboardTable = forwardRef<HTMLDivElement, Props>(
  ({ shots, videoTitle, onUpdateShot }, ref) => {
    return (
      <div ref={ref} className="bg-white">
        {/* Header */}
        <div className="text-center py-4 border-b-2 border-gray-800">
          <h2 className="text-xl font-bold text-gray-900">{videoTitle || "分镜表"}</h2>
          <p className="text-sm text-gray-500 mt-1">共 {shots.length} 个镜头</p>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-16">
                镜头
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-48">
                截图
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-28">
                开始时间
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-28">
                结束时间
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-20">
                时长
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-20">
                景别
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-20">
                运动
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 min-w-[200px]">
                画面描述
              </th>
            </tr>
          </thead>
          <tbody>
            {shots.map((shot) => (
              <tr key={shot.shot_number} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center text-sm font-mono">
                  {shot.shot_number}
                </td>
                <td className="border border-gray-300 p-1">
                  <img
                    src={getScreenshotUrl(shot.screenshot_url)}
                    alt={`镜头 ${shot.shot_number}`}
                    className="w-full h-auto rounded"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-xs font-mono">
                  {shot.timecode_start}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-xs font-mono">
                  {shot.timecode_end}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                  {shot.duration_seconds.toFixed(1)}s
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <EditableCell
                    value={shot.shot_size}
                    onChange={(v) => onUpdateShot(shot.shot_number, "shot_size", v)}
                    type="select"
                    options={SHOT_SIZES}
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <EditableCell
                    value={shot.camera_movement}
                    onChange={(v) => onUpdateShot(shot.shot_number, "camera_movement", v)}
                    type="select"
                    options={CAMERA_MOVEMENTS}
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <EditableCell
                    value={shot.description}
                    onChange={(v) => onUpdateShot(shot.shot_number, "description", v)}
                    type="textarea"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

StoryboardTable.displayName = "StoryboardTable";
export default StoryboardTable;
