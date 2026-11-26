# Validate post front matter against the site taxonomy vocabulary.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-taxonomy.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$postsRoot = Join-Path $root 'content\posts'
$taxonomyPath = Join-Path $root 'data\taxonomy.json'

$taxonomy = Get-Content -LiteralPath $taxonomyPath -Raw -Encoding UTF8 | ConvertFrom-Json
$allowedCategories = @($taxonomy.categories)
$allowedTags = @($taxonomy.tags)
$maxTags = 32
$maxTagsPerPost = 4

$errors = New-Object System.Collections.Generic.List[string]
$usedTags = New-Object System.Collections.Generic.HashSet[string]
$usedCategories = New-Object System.Collections.Generic.HashSet[string]
$files = Get-ChildItem -Path $postsRoot -Recurse -Filter *.md

function Get-FrontMatterList([string]$text, [string]$name) {
    if ($text -match "(?m)^$($name):\s*\[(.*?)\]") {
        return @($matches[1] -split ',' | ForEach-Object { $_.Trim().Trim('"') } | Where-Object { $_ -ne '' })
    }
    return @()
}

foreach ($file in $files) {
    $rel = $file.FullName.Substring($postsRoot.Length + 1)
    $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $tags = Get-FrontMatterList $text 'tags'
    $categories = Get-FrontMatterList $text 'categories'

    if ($tags.Count -eq 0) { $errors.Add("${rel}: no tags") }
    if ($tags.Count -gt $maxTagsPerPost) { $errors.Add("${rel}: $($tags.Count) tags (max $maxTagsPerPost)") }
    if ($categories.Count -eq 0) { $errors.Add("${rel}: no categories") }

    foreach ($tag in $tags) {
        [void]$usedTags.Add($tag)
        if ($allowedTags -notcontains $tag) { $errors.Add("${rel}: unknown tag '$tag'") }
        if ($allowedCategories -contains $tag) { $errors.Add("${rel}: tag '$tag' duplicates a category") }
    }
    foreach ($category in $categories) {
        [void]$usedCategories.Add($category)
        if ($allowedCategories -notcontains $category) { $errors.Add("${rel}: unknown category '$category'") }
    }
}

if ($usedTags.Count -gt $maxTags) {
    $errors.Add("distinct tags: $($usedTags.Count) (max $maxTags)")
}

Write-Output "posts=$($files.Count) tags=$($usedTags.Count) categories=$($usedCategories.Count)"
if ($errors.Count -gt 0) {
    Write-Output "taxonomy check failed:"
    $errors | ForEach-Object { Write-Output "  - $_" }
    exit 1
}
Write-Output 'taxonomy check passed'
exit 0
