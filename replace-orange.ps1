# Replace all orange color variants with #ff7800 (rgb(255, 120, 0))

$targetDir = "c:\Users\iannc\Desktop\Private\docs-prod\wildfire-wiki\docs\.vitepress\theme"
$files = Get-ChildItem -Path $targetDir -Include *.vue,*.css,*.ts -Recurse

$replacements = @(
    @{ Pattern = '(?i)#ff4500'; Replacement = '#ff7800' }
    @{ Pattern = '(?i)#ff8c00'; Replacement = '#ff7800' }
    @{ Pattern = '(?i)#e63e00'; Replacement = '#ff7800' }
    @{ Pattern = 'rgb\(255,\s*69,\s*0\)'; Replacement = 'rgb(255, 120, 0)' }
    @{ Pattern = 'rgba\(255,\s*69,\s*0'; Replacement = 'rgba(255, 120, 0' }
)

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    foreach ($item in $replacements) {
        $content = $content -replace $item.Pattern, $item.Replacement
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $count++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal files updated: $count"
