# Fenjing (分镜) - 在线视频分镜工具

输入视频链接，自动识别镜头切换并生成专业分镜表格。

## 功能

- 支持 YouTube、Vimeo 等视频平台链接
- 自动检测视频镜头切换
- 生成包含截图的专业分镜表格
- 可编辑景别、镜头运动、画面描述
- 导出为 PNG 或 PDF

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Python FastAPI
- **视频处理**: yt-dlp + PySceneDetect + FFmpeg

## 快速开始

### Docker (推荐)

```bash
docker compose up --build
```

访问 http://localhost:3000

### 手动运行

**后端:**

```bash
cd backend
pip install .
uvicorn app.main:app --reload
```

需要系统安装 FFmpeg: `apt install ffmpeg` 或 `brew install ffmpeg`

**前端:**

```bash
cd frontend
npm install
npm run dev
```

## 使用方式

1. 在首页粘贴视频链接
2. 等待系统下载并分析视频
3. 在分镜表格中编辑景别、运动、描述
4. 点击导出为 PNG 或 PDF
