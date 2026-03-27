@echo off
chcp 65001 >nul
title Fenjing - 在线视频分镜工具

echo ========================================
echo    Fenjing 分镜工具 - 一键启动
echo ========================================
echo.

set "ROOT=%~dp0"

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Python，请先安装 Python 3.10+
    echo 下载地址: https://www.python.org/downloads/
    echo 安装时请勾选 "Add Python to PATH"
    pause
    exit /b 1
)
echo [OK] Python 已安装

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js 已安装

:: Check FFmpeg
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo [警告] 未检测到 FFmpeg
    echo 视频处理需要 FFmpeg，请安装:
    echo   下载: https://github.com/BtbN/FFmpeg-Builds/releases
    echo   解压后将 bin 目录添加到系统 PATH
    echo.
) else (
    echo [OK] FFmpeg 已安装
)

:: Install backend dependencies
echo.
echo [1/4] 安装后端依赖（首次运行需要几分钟）...
pip install fastapi uvicorn[standard] pydantic pydantic-settings yt-dlp "scenedetect[opencv]" pillow python-multipart
if errorlevel 1 (
    echo [错误] 后端依赖安装失败，请检查上面的错误信息
    pause
    exit /b 1
)
echo       后端依赖安装完成

:: Install frontend dependencies
echo [2/4] 安装前端依赖（首次运行需要几分钟）...
cd /d "%ROOT%frontend"
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo [错误] 前端依赖安装失败
        pause
        exit /b 1
    )
)
echo       前端依赖安装完成
cd /d "%ROOT%"

:: Start backend in a new visible window
echo [3/4] 启动后端服务器 (端口 8000)...
start "Fenjing Backend" cmd /k "cd /d "%ROOT%backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

:: Wait for backend
echo       等待后端启动...
timeout /t 5 /nobreak >nul

:: Start frontend in a new visible window
echo [4/4] 启动前端服务器 (端口 3000)...
start "Fenjing Frontend" cmd /k "cd /d "%ROOT%frontend" && npx next dev -p 3000"

:: Wait for frontend to be ready
echo.
echo 正在启动前端，请稍候...
timeout /t 10 /nobreak >nul

:: Open browser
echo.
echo ========================================
echo    启动完成！正在打开浏览器...
echo    地址: http://localhost:3000
echo.
echo    如果页面空白，请等几秒后刷新
echo    关闭 Backend 和 Frontend 窗口可停止服务
echo ========================================
start http://localhost:3000

pause
