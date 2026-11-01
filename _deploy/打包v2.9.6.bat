@echo off
chcp 65001 >nul
title 知隅 v2.9.6 打包（带高德真实推荐）
cd /d "%~dp0"

echo.
echo  ================================================
echo   知隅 v2.9.6 一键打包
echo   新增：约会策划接高德真实场所
echo  ================================================
echo.

if not exist "D:\zhiyu\js\amap.js" (
    echo  [!] 还没同步完，找不到 D:\zhiyu\js\amap.js
    echo      等 1 分钟再双击一次，或者检查右下角云盘是否在同步
    echo.
    pause
    exit /b 1
)

echo  [OK] 源码已同步
echo  [..] 开始打包，大约 3 分钟，不要关窗口
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\zhiyu\_deploy\rebuild_v296.ps1"

if errorlevel 1 (
    echo.
    echo  [!] 打包失败，把上面的红字截图发给老大
    pause
    exit /b 1
)

echo.
echo  ================================================
echo   打包完成
echo   APK: D:\zhiyu\dist\zhiyu-v2.9.6.apk
echo   云盘副本已自动复制，可以直接下载
echo  ================================================
echo.
pause
