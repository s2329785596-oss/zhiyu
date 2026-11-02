# ============================================================
# 知隅 v2.9.7 一键重打包（Windows / D:\zhiyu 工程）
# v2.9.7 新增：约会策划接高德真实场所（真店真评分真人均，票价拿不到就不编）
# 继承 v2.9.5：状态画像（后台静默读人，只改怎么说，不改说什么）
# 继承 v2.9.4：话术库(120场景/360条) + 聊天解读多图识别/攒记录/关系复盘
# ============================================================
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$APP   = 'D:\zhiyu\app'
$AND   = Join-Path $APP 'android'
$GH    = 'D:\zhiyu\_gh_latest'          # 从 GitHub 拉的最新 H5
$PATCH = 'D:\zhiyu\_v297'
$DIST  = 'D:\zhiyu\dist'

Write-Host '===== [1/8] 环境检查 =====' -ForegroundColor Cyan
if (-not $env:JAVA_HOME) { $env:JAVA_HOME = 'C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot\' }
Write-Host "JAVA_HOME=$env:JAVA_HOME"
Write-Host "sdk.dir=$(Get-Content (Join-Path $AND 'local.properties'))"

Write-Host '===== [2/8] 定位最新 H5 源码（优先云盘本地，失败回退 GitHub）=====' -ForegroundColor Cyan
$driveSrc = 'C:\Users\电脑\Coze\Drive\情感成长助手\zhiyu_gh_pages'
$SRC = $null
if ((Test-Path (Join-Path $driveSrc 'index.html')) -and
    (Select-String -Path (Join-Path $driveSrc 'index.html') -Pattern 'i-clock' -Quiet) -and
    (Select-String -Path (Join-Path $driveSrc 'js\app.js') -Pattern 'iconSVG' -Quiet)) {
  $SRC = Get-Item $driveSrc
  Write-Host "  使用云盘最新源码: $driveSrc"
} else {
  $zip = "$env:TEMP\zhiyu_main.zip"
  if (Test-Path $zip) { Remove-Item $zip -Force }
  Invoke-WebRequest -Uri 'https://codeload.github.com/s2329785596-oss/zhiyu/zip/refs/heads/main' -OutFile $zip -UseBasicParsing -TimeoutSec 120
  if (Test-Path $PATCH) { Remove-Item $PATCH -Recurse -Force }
  New-Item -ItemType Directory -Path $PATCH | Out-Null
  Expand-Archive -Path $zip -DestinationPath $PATCH -Force
  $SRC = Get-ChildItem $PATCH -Directory | Select-Object -First 1
  Write-Host "  使用 GitHub 源码: $($SRC.FullName)"
}
$srcOk = Select-String -Path (Join-Path $SRC.FullName 'index.html') -Pattern 'i-clock' -Quiet
$libOk = Test-Path (Join-Path $SRC.FullName 'js\scriptsData.js')
$profOk = Test-Path (Join-Path $SRC.FullName 'js\profile.js')
if (-not $libOk) { throw '源码里没有话术库(js/scriptsData.js)，不是 v2.9.7' }
if (-not $profOk) { throw '源码里没有状态画像(js/profile.js)，不是 v2.9.7' }
$amapOk = Test-Path (Join-Path $SRC.FullName 'js\amap.js')
if (-not $amapOk) { throw '源码里没有高德检索(js/amap.js)，不是 v2.9.7' }
if (-not $srcOk) { throw '源码不是 v2.9.7（找不到 SVG 图标或话术库），中止' }

Write-Host '===== [3/8] 同步 H5 到三处目录 =====' -ForegroundColor Cyan
$targets = @(
  (Join-Path $APP 'www'),
  'D:\zhiyu\h5',
  (Join-Path $AND 'app\src\main\assets\public')
)
foreach ($t in $targets) {
  # /E 含子目录 /XD 排除 .git 与 _deploy /NFL /NDL 精简输出
  robocopy $SRC.FullName $t /E /XD '.git' '_deploy' 'download' /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "robocopy 失败(码 $LASTEXITCODE): $t" }
  Write-Host "  OK $t"
}

Write-Host '===== [4/8] 打开 CapacitorHttp（绕过跨域）=====' -ForegroundColor Cyan
$cfgPath = Join-Path $APP 'capacitor.config.json'
$cfg = Get-Content $cfgPath -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $cfg.plugins) { $cfg | Add-Member -NotePropertyName plugins -NotePropertyValue ([pscustomobject]@{}) }
if ($cfg.plugins.PSObject.Properties.Name -notcontains 'CapacitorHttp') {
  $cfg.plugins | Add-Member -NotePropertyName CapacitorHttp -NotePropertyValue ([pscustomobject]@{ enabled = $true })
} else { $cfg.plugins.CapacitorHttp.enabled = $true }
($cfg | ConvertTo-Json -Depth 20) | Set-Content $cfgPath -Encoding UTF8
Get-Content $cfgPath

Write-Host '===== [4b/8] 内容延伸到状态栏（edge-to-edge，消除顶部白条）=====' -ForegroundColor Cyan
$javaDir = Join-Path $AND 'app\src\main\java\com\zhiyu\app'
$mainJava = Join-Path $javaDir 'MainActivity.java'
if (-not (Test-Path $mainJava)) {
  $found = Get-ChildItem -Path (Join-Path $AND 'app\src') -Recurse -Filter 'MainActivity.java' -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($found) { $mainJava = $found.FullName; $javaDir = Split-Path $mainJava }
}
if (Test-Path $mainJava) {
  Copy-Item $mainJava (Join-Path $javaDir 'MainActivity.java.bak') -Force
}
$mainSrc = @"
package com.zhiyu.app;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsetsController;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // v2.9.7: draw content under the status bar (API 30+ only, older roms would crash)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        }

        // v2.9.7: transparent status bar, so the webview cream background shows through.
        // before this the system painted a white bar over the top of the header
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.parseColor("#F6F3EE")));

        // dark status bar icons on the light cream background
        View decor = getWindow().getDecorView();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController c = decor.getWindowInsetsController();
            if (c != null) {
                c.setSystemBarsAppearance(
                    WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS,
                    WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS);
            }
        } else {
            decor.setSystemUiVisibility(decor.getSystemUiVisibility()
                | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }

        // v2.9.7: hand the real status bar height to the web layer (CSS var --zy-sat),
        // so every phone gets an exact top inset instead of a guessed value
        int resId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        int hPx = resId > 0 ? getResources().getDimensionPixelSize(resId) : 0;
        float density = getResources().getDisplayMetrics().density;
        final int satDp = (hPx > 0 && density > 0) ? Math.round(hPx / density) : 0;

        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().addJavascriptInterface(new Object() {
                    @android.webkit.JavascriptInterface
                    public int getStatusBarHeight() {
                        return satDp;
                    }
                }, "ZYNative");
            }
        } catch (Exception e) {
            // never block startup; CSS falls back to 26px
        }
    }
}
"@
[System.IO.Directory]::CreateDirectory($javaDir) | Out-Null
[System.IO.File]::WriteAllText($mainJava, $mainSrc, (New-Object Text.UTF8Encoding($false)))
Write-Host "  MainActivity.java -> $mainJava"

Write-Host '===== [5/8] 版本号 -> 29700 / 2.9.7 =====' -ForegroundColor Cyan
$gradle = Join-Path $AND 'app\build.gradle'
$gc = Get-Content $gradle -Raw -Encoding UTF8
$gc = $gc -replace 'versionCode \d+', 'versionCode 29700'
$gc = $gc -replace 'versionName "[\d.]+"', 'versionName "2.9.7"'
[System.IO.File]::WriteAllText($gradle, $gc, (New-Object Text.UTF8Encoding($false)))
Select-String -Path $gradle -Pattern 'versionCode|versionName' | ForEach-Object { Write-Host ('  ' + $_.Line.Trim()) }

Write-Host '===== [6/8] cap sync（把配置与 www 同步进安卓壳）=====' -ForegroundColor Cyan
Push-Location $APP
& (Join-Path $APP 'node_modules\.bin\cap.cmd') sync android 2>&1 | Select-Object -Last 8
Pop-Location

Write-Host '===== [7/8] 编译 release APK =====' -ForegroundColor Cyan
Push-Location $AND
$glog = 'D:\zhiyu\_gradle_build.log'
cmd /c ".\gradlew.bat assembleRelease --no-daemon > `"$glog`" 2>&1"
Get-Content $glog -Tail 6
if ($LASTEXITCODE -ne 0) { throw "gradle 编译失败，完整日志: $glog" }
Pop-Location
$apk = Join-Path $AND 'app\build\outputs\apk\release\app-release.apk'
if (-not (Test-Path $apk)) { throw 'APK 未生成' }

Write-Host '===== [8/8] 校验并交付 =====' -ForegroundColor Cyan
& 'D:\android-sdk\build-tools\34.0.0\apksigner.bat' verify -v --min-sdk-version 23 $apk 2>&1 | Select-String 'Verifies|v2 scheme'
if (-not (Test-Path $DIST)) { New-Item -ItemType Directory -Path $DIST | Out-Null }
$out = Join-Path $DIST 'zhiyu-v2.9.7.apk'
Copy-Item $apk $out -Force
$md5 = (Get-FileHash $out -Algorithm MD5).Hash
Write-Host ("交付: {0}  {1} bytes  MD5={2}" -f $out,(Get-Item $out).Length,$md5) -ForegroundColor Green

# 复制进云盘供下载（注意：云盘大文件可能同步成空壳，复制后校验大小）
$drive = 'C:\Users\电脑\Coze\Drive\情感成长助手\zhiyu-v2.9.7.apk'
Copy-Item $out $drive -Force
Start-Sleep -Seconds 3
if ((Get-Item $drive).Length -eq (Get-Item $out).Length) {
  Write-Host "云盘副本 OK: $drive" -ForegroundColor Green
} else {
  Write-Host '警告：云盘副本大小不一致，请稍后用 file_to_url 前再核对' -ForegroundColor Yellow
}
