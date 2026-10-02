$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$launcher = Join-Path $env:USERPROFILE '.codex\skills\impeccable\scripts\impeccable.cmd'
if (-not (Test-Path -LiteralPath $launcher)) {
    throw "Impeccable launcher not found: $launcher"
}
$previousCache = $env:IMPECCABLE_HOME
Push-Location -LiteralPath $projectRoot
try {
    $env:IMPECCABLE_HOME = Join-Path $projectRoot '.impeccable\runtime'
    & $launcher engine-probe
    if ($LASTEXITCODE -ne 0) { throw 'Impeccable engine could not start.' }
    & $launcher detect --json --scope type src/pages/index.astro src/styles/global.css
    if ($LASTEXITCODE -ne 0) { throw 'Impeccable type detection failed.' }
} finally {
    $env:IMPECCABLE_HOME = $previousCache
    Pop-Location
}
