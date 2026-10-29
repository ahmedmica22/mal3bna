param(
  [Parameter(Mandatory = $true)][string]$PreviousImage,
  [string]$ComposeFile = "docker-compose.yml"
)

$ErrorActionPreference = 'Stop'
Write-Host "Rollback procedure: restore application image $PreviousImage"
Write-Host "1. Stop traffic and preserve logs."
Write-Host "2. Deploy the previous immutable application artifact."
Write-Host "3. Do not reverse applied Prisma migrations destructively."
Write-Host "4. Run scripts/staging-smoke.mjs and verify the database backup checkpoint."
Write-Host "5. Reopen traffic only after smoke and health checks pass."
