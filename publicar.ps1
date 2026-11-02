$ErrorActionPreference = 'Stop'
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Web/index.html'), (Join-Path $PSScriptRoot 'Web/datos.js') -Destination $PSScriptRoot
Copy-Item -Path (Join-Path $PSScriptRoot 'Web/assets/*') -Destination (Join-Path $PSScriptRoot 'assets') -Recurse -Force
