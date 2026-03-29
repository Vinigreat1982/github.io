$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $projectRoot "index.html"

$requiredFiles = @(
  "index.html",
  "styles.css",
  "script.js",
  "assets\Sauna+logo.png",
  "assets\Logo (2).png"
)

$missingFiles = $requiredFiles | Where-Object {
  -not (Test-Path (Join-Path $projectRoot $_))
}

if ($missingFiles.Count -gt 0) {
  throw "Missing required files: $($missingFiles -join ', ')"
}

$resolvedIndexPath = (Resolve-Path $indexPath).Path
$fileUri = [System.Uri]::new($resolvedIndexPath).AbsoluteUri

$chromeCandidates = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

$chromePath = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($chromePath) {
  Start-Process -FilePath $chromePath -ArgumentList @($fileUri) | Out-Null
  Write-Output "Opened $fileUri as a tab in $chromePath"
  exit 0
}

$fallbackCandidates = @(
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Mozilla Firefox\firefox.exe",
  "C:\Program Files (x86)\Mozilla Firefox\firefox.exe"
)

$fallbackPath = $fallbackCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $fallbackPath) {
  throw "No supported browser found for local preview."
}

if ($fallbackPath -match "msedge\.exe$") {
  Start-Process -FilePath $fallbackPath -ArgumentList @($fileUri) | Out-Null
} else {
  Start-Process -FilePath $fallbackPath -ArgumentList @("-new-tab", $fileUri) | Out-Null
}

Write-Output "Opened $fileUri in fallback browser $fallbackPath"
