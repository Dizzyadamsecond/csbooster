$f = 'C:\Users\forrydev\Desktop\cscheats_mono\Cs2Booster\WpfClient\Views\MainWindow.xaml'
$a = Get-Content $f -Raw
$a = $a -replace '(?s)<!-- ============================ SIDEBAR (?s)=========================== -->', '<!-- ================ SIDEBAR ================ -->'
$a = $a -replace '(?m)<!-- ------------------------ DASHBOARD ------------------------ -->', '<!-- ========== DASHBOARD ========== -->'
$a = $a -replace '(?m)<!-- ------------------------ OPTIMIZATION ------------------------ -->', '<!-- ========== OPTIMIZATION ========== -->'
$a = $a -replace '(?m)<!-- ------------------------ PROFILES ------------------------ -->', '<!-- ========== PROFILES ========== -->'
$a = $a -replace '(?m)<!-- ------------------------ MONITORAMENTO ------------------------ -->', '<!-- ========== MONITORAMENTO ========== -->'
$a | Set-Content -LiteralPath $f -NoNewline
'Fix applied'
