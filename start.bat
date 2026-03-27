@echo off
chcp 65001 >nul
title Fenjing - 在线视频分镜工具

echo ========================================
echo    Fenjing 分镜工具 - 一键启动
echo ========================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Python，请先安装 Python 3.10+
    echo 下载地址: https://www.python.org/downloads/
    echo 安装时请勾选 "Add Python to PATH"
    pause
    exit /b 1
)

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: Check FFmpeg
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo [警告] 未检测到 FFmpeg，正在尝试通过 pip 安装...
    pip install imageio-ffmpeg >nul 2>&1
    echo 如果后续处理视频出错，请手动安装 FFmpeg:
    echo 1. 下载: https://github.com/BtbN/FFmpeg-Builds/releases
    echo 2. 解压后将 bin 目录添加到系统 PATH
    echo.
)

:: Install backend dependencies
echo [1/4] 安装后端依赖...
pip install fastapi uvicorn pydantic pydantic-settings yt-dlp "scenedetect[opencv]" pillow python-multipart >nul 2>&1
if errorlevel 1 (
    echo [错误] 后端依赖安装失败
    pause
    exit /b 1
)
echo       后端依赖安装完成

:: Install frontend dependencies
echo [2/4] 安装前端依赖...
cd frontend
if not exist node_modules (
    call npm install >nul 2>&1
)
echo       前端依赖安装完成
cd ..

:: Start backend
echo [3/4] 启动后端服务器 (端口 8000)...
cd backend
start /b cmd /c "uvicorn app.main:app --host 0.0.0.0 --port 8000 2>nul"
cd ..

:: Wait for backend
timeout /t 3 /nobreak >nul

:: Start frontend
echo [4/4] 启动前端服务器 (端口 3000)...
cd frontend
start /b cmd /c "npx next dev -p 3000 2>nul"
cd ..

:: Wait for frontend to be ready
echo.
echo 正在启动，请稍候...
timeout /t 8 /nobreak >nul

:: Open browser
echo.
echo ========================================
echo    启动成功！正在打开浏览器...
echo    地址: http://localhost:3000
echo    按 Ctrl+C 停止服务器
echo ========================================
start http://localhost:3000

:: Keep window open
echo.
echo 服务器运行中，关闭此窗口将停止所有服务。
pause >nul
taskkill /f /im uvicorn.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
