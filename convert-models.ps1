# convert-models.ps1
# Unzips every Poly Haven .gltf.zip from Downloads, converts each one to a
# single .glb file with 1K textures and Draco compression, and saves it in
# public\models\ inside the project.

$downloads = "$env:USERPROFILE\Downloads"
$rawDir    = "$env:USERPROFILE\Desktop\raw-models"
$outDir    = "$PSScriptRoot\public\models"

# Create the folders if they don't exist yet
New-Item -ItemType Directory -Force -Path $rawDir, $outDir | Out-Null

# Find every Poly Haven glTF ZIP in Downloads
$zips = Get-ChildItem $downloads -Filter "*.gltf.zip"
Write-Host "Found $($zips.Count) ZIP files."

foreach ($zip in $zips) {
    # Example: wooden_stool_01_4k.gltf.zip -> wooden_stool_01_4k
    $base = $zip.Name -replace '\.gltf\.zip$', ''

    # 1. Unzip into Desktop\raw-models\<base name>
    $folder = Join-Path $rawDir $base
    if (-not (Test-Path $folder)) {
        Expand-Archive -Path $zip.FullName -DestinationPath $folder
    }

    # 2. Find the .gltf file inside the unzipped folder
    $gltf = Get-ChildItem $folder -Recurse -Filter *.gltf | Select-Object -First 1
    if (-not $gltf) {
        Write-Host "WARNING: no .gltf file found for $base" -ForegroundColor Yellow
        continue
    }

    # 3. Make the output name: remove _4k, lowercase, underscores to dashes
    #    wooden_stool_01_4k -> wooden-stool-01
    $name = ($base -replace '_4k$', '').ToLower() -replace '_', '-'
    $out  = Join-Path $outDir "$name.glb"

    # 4. Convert to .glb with 1K textures and Draco compression
    Write-Host "Converting $name ..." -ForegroundColor Cyan
    npx -y @gltf-transform/cli optimize $gltf.FullName $out --compress draco --texture-size 1024
}

Write-Host "Done. Check public\models for your .glb files." -ForegroundColor Green