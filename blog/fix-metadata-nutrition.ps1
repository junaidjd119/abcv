$base = "E:\gym\abcv-main\abcv-main\blog"
$parts = @(5,21,26,31,33,36,43,68,77,82)

# Fix Part X of 10 -> Part X &mdash; Nutrition Series
foreach ($p in $parts) {
    $path = "$base\ultimate-guide-nutrition-part-$p.html"
    $c = [System.IO.File]::ReadAllText($path)
    $orig = $c
    
    # Fix series label
    $c = $c -replace '(Part \d+) of 10', '$1 &mdash; Nutrition Series'
    
    # Fix JSON-LD keywords
    $keywordMap = @{
        5 = "BMR, TDEE, calorie target, basal metabolic rate, total daily energy expenditure, calorie calculator, fat loss calories, muscle gain calories, gymtranning"
        21 = "leucine threshold, muscle protein synthesis, protein sources, protein distribution, amino acids, leucine content, gymtranning"
        26 = "carbohydrate timing, glycogen timing, pre workout carbs, post workout carbs, glycogen replenishment, carb cycling, gymtranning"
        31 = "healthy fats, dietary fat, hormone health, testosterone, omega 3, fat intake, essential fats, gymtranning"
        33 = "pre workout nutrition, post workout nutrition, nutrient timing, pre workout meal, post workout meal, anabolic window, gymtranning"
        36 = "hydration, electrolytes, athletic performance, sodium, potassium, magnesium, water intake, gymtranning"
        43 = "micronutrients, vitamins, minerals, vitamin D, magnesium, zinc, iron, B vitamins, lifter nutrition, gymtranning"
        68 = "supplements, creatine, whey protein, caffeine, evidence based supplements, supplement guide, gymtranning"
        77 = "meal prep, batch cooking, meal planning, macro meals, food prep, weekly meal prep, gymtranning"
        82 = "intuitive eating, calorie tracking, macro tracking, portion control, mindful eating, nutrition awareness, gymtranning"
    }
    $newKw = $keywordMap[$p]
    $replacement = '"keywords": "' + $newKw + '"'
    $c = $c -replace '"keywords": "[^"]+"', $replacement
    
    # Fix video descriptions (replace article meta description with exercise-specific)
    if ($c -match '<meta name="description" content="([^"]+)"') {
        $metaDesc = $matches[1]
        $safeDesc = [regex]::Escape($metaDesc)
        $c = $c -replace $safeDesc, 'Watch this exercise demonstration to improve your form and technique.'
    }
    
    if ($c -ne $orig) {
        [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
        Write-Host "Fixed metadata for part $p"
    }
}

Write-Host "Nutrition metadata fixes complete."
