// ============================================================
//  7-Day Personalized Diet Plan Engine
//  GymTranning.com | diet7day.js
// ============================================================

// ── Meal Database ──────────────────────────────────────────
// t: breakfast|lunch|dinner|snack
// cu: cuisines (array)
// r: allowed restrictions (halal/vegetarian/no-nuts/no-dairy/no-gluten)
// kcal/p/c/f: macros  | cost: low/med/high
// ing: ingredients with qty  | note: prep note
const MEALS = [
    // ── BREAKFASTS ─────────────────────────────────────────
    {
        id: 1, n: "Aloo Paratha with Yogurt & Pickle", t: "breakfast", cu: ["Indian", "Pakistani"], r: ["halal", "vegetarian"], kcal: 420, p: 14, c: 62, f: 13, cost: { low: 0.6, med: 0.9, hi: 1.4 },
        ing: ["Whole wheat dough 120g", "Boiled potato 80g", "Cumin ½tsp", "Coriander ½tsp", "Green chilli 1", "Yogurt 100g", "Butter 1tsp"], note: "Serve hot off the tawa"
    },
    {
        id: 2, n: "Egg Bhurji (Spiced Scrambled Eggs) with Roti", t: "breakfast", cu: ["Indian", "Pakistani"], r: ["halal"], kcal: 380, p: 22, c: 30, f: 18, cost: { low: 0.7, med: 1.0, hi: 1.5 },
        ing: ["Eggs 3", "Onion 50g", "Tomato 50g", "Green chilli 1", "Cumin ½tsp", "Ghee 1tsp", "Whole wheat roti 2"], note: "Cook eggs on low heat for creaminess"
    },
    {
        id: 3, n: "Chana Chaat Breakfast Bowl", t: "breakfast", cu: ["Indian", "Pakistani"], r: ["halal", "vegetarian", "no-dairy"], kcal: 340, p: 16, c: 52, f: 6, cost: { low: 0.5, med: 0.8, hi: 1.2 },
        ing: ["Boiled chickpeas 150g", "Tomato 60g", "Onion 40g", "Tamarind chutney 1tbsp", "Cumin powder ½tsp", "Lemon juice 1tsp"], note: "Toss just before serving"
    },
    {
        id: 4, n: "Congee (Rice Porridge) with Soft-Boiled Egg", t: "breakfast", cu: ["Chinese", "Vietnamese"], r: ["halal", "no-dairy", "no-gluten"], kcal: 310, p: 14, c: 48, f: 6, cost: { low: 0.4, med: 0.7, hi: 1.1 },
        ing: ["Jasmine rice 60g", "Chicken broth 400ml", "Egg 1", "Ginger 5g", "Sesame oil ½tsp", "Spring onion 10g", "Soy sauce 1tsp"], note: "Simmer rice low and slow 30 min"
    },
    {
        id: 5, n: "Japanese Tamago-kake Gohan (Egg on Rice)", t: "breakfast", cu: ["Japanese"], r: ["halal", "no-dairy", "no-gluten"], kcal: 360, p: 18, c: 55, f: 8, cost: { low: 0.5, med: 0.8, hi: 1.2 },
        ing: ["Steamed rice 200g", "Raw fresh egg 1", "Soy sauce 1tsp", "Sesame oil ½tsp", "Nori strips 2g"], note: "Stir egg into warm rice rapidly"
    },
    {
        id: 6, n: "Thai Rice Soup (Khao Tom) with Chicken", t: "breakfast", cu: ["Thai"], r: ["halal", "no-dairy", "no-gluten"], kcal: 325, p: 20, c: 42, f: 6, cost: { low: 0.6, med: 0.9, hi: 1.4 },
        ing: ["Jasmine rice 60g", "Chicken breast 80g", "Fish sauce 1tsp", "Ginger 10g", "Garlic 2 cloves", "Spring onion 10g", "Coriander 5g"], note: "Season with fish sauce to taste"
    },
    {
        id: 7, n: "Mediterranean Shakshuka (Eggs in Tomato Sauce)", t: "breakfast", cu: ["Mediterranean"], r: ["halal", "vegetarian", "no-gluten"], kcal: 350, p: 20, c: 24, f: 18, cost: { low: 0.7, med: 1.1, hi: 1.6 },
        ing: ["Eggs 3", "Crushed tomatoes 200g", "Bell pepper 80g", "Onion 50g", "Cumin 1tsp", "Paprika 1tsp", "Olive oil 1tbsp", "Feta 20g optional"], note: "Serve with crusty bread or pita"
    },
    {
        id: 8, n: "Oatmeal with Banana & Peanut Butter", t: "breakfast", cu: ["European", "Mediterranean"], r: ["halal", "vegetarian", "no-gluten"], kcal: 390, p: 14, c: 58, f: 12, cost: { low: 0.5, med: 0.8, hi: 1.2 },
        ing: ["Rolled oats 80g", "Milk 200ml", "Banana 1 medium", "Peanut butter 1tbsp", "Honey 1tsp", "Cinnamon ¼tsp"], note: "Use almond milk for dairy-free"
    },
    {
        id: 9, n: "Avocado Toast with Poached Egg", t: "breakfast", cu: ["European", "Mediterranean"], r: ["halal", "vegetarian", "no-dairy"], kcal: 410, p: 18, c: 38, f: 22, cost: { low: 1.0, med: 1.4, hi: 2.0 },
        ing: ["Wholegrain bread 2 slices", "Avocado ½", "Egg 1", "Lemon juice ½tsp", "Chilli flakes pinch", "Salt & pepper"], note: "Add microgreens for colour"
    },

    // ── LUNCHES ────────────────────────────────────────────
    {
        id: 10, n: "Dal Makhani with Brown Rice", t: "lunch", cu: ["Indian", "Pakistani"], r: ["halal", "vegetarian"], kcal: 480, p: 18, c: 72, f: 12, cost: { low: 0.8, med: 1.2, hi: 1.8 },
        ing: ["Black lentils 100g", "Kidney beans 50g", "Tomato 100g", "Cream 2tbsp", "Butter 1tsp", "Garam masala 1tsp", "Ginger-garlic paste 1tsp", "Brown rice 150g"], note: "Slow cook lentils 6–8 hrs for best result"
    },
    {
        id: 11, n: "Chicken Karahi with Naan", t: "lunch", cu: ["Pakistani", "Indian"], r: ["halal"], kcal: 540, p: 38, c: 40, f: 22, cost: { low: 1.2, med: 1.8, hi: 2.5 },
        ing: ["Chicken 200g", "Tomato 150g", "Yogurt 50g", "Ginger-garlic 1tbsp", "Green chilli 2", "Ghee 1tbsp", "Whole wheat naan 1"], note: "High-heat wok cooking is key"
    },
    {
        id: 12, n: "Palak Paneer with Roti", t: "lunch", cu: ["Indian"], r: ["halal", "vegetarian"], kcal: 460, p: 20, c: 38, f: 24, cost: { low: 0.9, med: 1.3, hi: 1.9 },
        ing: ["Spinach 200g", "Paneer 100g", "Onion 80g", "Tomato 80g", "Cream 1tbsp", "Cumin 1tsp", "Garam masala 1tsp", "Whole wheat roti 2"], note: "Blanch spinach before blending"
    },
    {
        id: 13, n: "Vietnamese Pho with Chicken", t: "lunch", cu: ["Vietnamese"], r: ["halal", "no-dairy", "no-gluten"], kcal: 420, p: 30, c: 52, f: 6, cost: { low: 1.0, med: 1.5, hi: 2.2 },
        ing: ["Rice noodles 80g", "Chicken breast 120g", "Beef/chicken broth 500ml", "Bean sprouts 50g", "Star anise 2", "Cinnamon 1 stick", "Fish sauce 1tbsp", "Basil & lime"], note: "Toast spices first for depth"
    },
    {
        id: 14, n: "Thai Green Curry with Tofu & Jasmine Rice", t: "lunch", cu: ["Thai"], r: ["halal", "vegetarian", "no-gluten"], kcal: 490, p: 18, c: 62, f: 18, cost: { low: 0.9, med: 1.4, hi: 2.0 },
        ing: ["Tofu firm 150g", "Coconut milk 200ml", "Green curry paste 2tbsp", "Jasmine rice 150g", "Zucchini 80g", "Baby corn 60g", "Thai basil 5g", "Lime juice"], note: "Add vegetables in last 5 min"
    },
    {
        id: 15, n: "Chinese Kung Pao Chicken with Steamed Rice", t: "lunch", cu: ["Chinese"], r: ["halal", "no-dairy"], kcal: 510, p: 34, c: 55, f: 16, cost: { low: 1.1, med: 1.6, hi: 2.3 },
        ing: ["Chicken breast 180g", "Peanuts 30g", "Bell pepper 80g", "Dried chilli 4", "Soy sauce 2tbsp", "Hoisin sauce 1tbsp", "Sesame oil 1tsp", "Rice 150g"], note: "Marinate chicken 20 min"
    },
    {
        id: 16, n: "Mediterranean Grilled Chicken Salad", t: "lunch", cu: ["Mediterranean"], r: ["halal", "no-dairy", "no-gluten"], kcal: 380, p: 38, c: 20, f: 16, cost: { low: 1.3, med: 1.8, hi: 2.6 },
        ing: ["Chicken breast 180g", "Romaine lettuce 80g", "Cherry tomato 80g", "Cucumber 60g", "Olives 30g", "Olive oil 1tbsp", "Lemon juice", "Oregano 1tsp"], note: "Grill chicken with za'atar"
    },
    {
        id: 17, n: "Lentil Soup with Sourdough Bread", t: "lunch", cu: ["European", "Mediterranean"], r: ["halal", "vegetarian", "no-dairy", "no-gluten"], kcal: 410, p: 20, c: 60, f: 7, cost: { low: 0.7, med: 1.1, hi: 1.6 },
        ing: ["Red lentils 120g", "Carrot 80g", "Celery 60g", "Tomato 80g", "Cumin 1tsp", "Olive oil 1tbsp", "Sourdough 1 slice"], note: "Blend half for creamy texture"
    },
    {
        id: 18, n: "Caprese Pasta with Grilled Chicken", t: "lunch", cu: ["European", "Mediterranean"], r: ["halal", "vegetarian"], kcal: 520, p: 32, c: 60, f: 14, cost: { low: 1.1, med: 1.6, hi: 2.4 },
        ing: ["Whole wheat pasta 100g", "Chicken breast 150g", "Mozzarella 40g", "Cherry tomato 100g", "Fresh basil 5g", "Olive oil 1tbsp", "Balsamic glaze 1tsp"], note: "Al dente pasta holds sauce better"
    },

    // ── DINNERS ────────────────────────────────────────────
    {
        id: 19, n: "Biryani (Chicken) — Aromatic 1-Pot", t: "dinner", cu: ["Indian", "Pakistani"], r: ["halal"], kcal: 580, p: 35, c: 72, f: 16, cost: { low: 1.4, med: 2.0, hi: 2.8 },
        ing: ["Basmati rice 150g", "Chicken 200g", "Onion 80g", "Yogurt 60g", "Biryani masala 1tbsp", "Saffron pinch", "Ghee 1tbsp", "Mint & coriander"], note: "Dum cook on low heat 20 min"
    },
    {
        id: 20, n: "Mutton/Beef Nihari (Slow-Cooked Stew)", t: "dinner", cu: ["Pakistani", "Indian"], r: ["halal"], kcal: 560, p: 40, c: 32, f: 28, cost: { low: 1.8, med: 2.5, hi: 3.5 },
        ing: ["Beef shank 250g", "Onion 100g", "Ginger 15g", "Nihari masala 2tbsp", "Ghee 1tbsp", "Whole wheat naan 2"], note: "Cook 6–8 hrs for fall-off-bone tenderness"
    },
    {
        id: 21, n: "Rajma Chawal (Red Kidney Bean Curry & Rice)", t: "dinner", cu: ["Indian", "Pakistani"], r: ["halal", "vegetarian"], kcal: 490, p: 20, c: 80, f: 8, cost: { low: 0.7, med: 1.1, hi: 1.6 },
        ing: ["Kidney beans 150g", "Basmati rice 150g", "Tomato 100g", "Onion 80g", "Garam masala 1tsp", "Ginger-garlic 1tbsp", "Mustard oil 1tbsp"], note: "Soak beans overnight"
    },
    {
        id: 22, n: "Japanese Teriyaki Salmon with Rice and Broccoli", t: "dinner", cu: ["Japanese"], r: ["halal", "no-dairy", "no-gluten"], kcal: 520, p: 38, c: 50, f: 18, cost: { low: 1.8, med: 2.4, hi: 3.2 },
        ing: ["Salmon fillet 180g", "Steamed rice 150g", "Broccoli 120g", "Soy sauce 2tbsp", "Mirin 1tbsp", "Sesame seeds 5g", "Ginger 5g"], note: "Broil salmon 4 min each side"
    },
    {
        id: 23, n: "Chinese Steamed Fish with Ginger & Spring Onion", t: "dinner", cu: ["Chinese"], r: ["halal", "no-dairy", "no-gluten"], kcal: 360, p: 34, c: 8, f: 14, cost: { low: 1.2, med: 1.8, hi: 2.6 },
        ing: ["White fish fillet 200g", "Ginger 15g", "Spring onion 20g", "Soy sauce 2tbsp", "Sesame oil 1tbsp", "Coriander 5g"], note: "Steam 8–10 min, finish with hot oil"
    },
    {
        id: 24, n: "Thai Basil Chicken Stir-Fry (Pad Krapow Gai)", t: "dinner", cu: ["Thai"], r: ["halal", "no-dairy"], kcal: 480, p: 32, c: 45, f: 16, cost: { low: 0.9, med: 1.4, hi: 2.0 },
        ing: ["Minced chicken 200g", "Thai basil 15g", "Bird-eye chilli 3", "Garlic 4 cloves", "Oyster sauce 1tbsp", "Soy sauce 1tbsp", "Fish sauce 1tsp", "Steamed rice 150g"], note: "High heat, cook fast 5–6 min"
    },
    {
        id: 25, n: "Vietnamese Grilled Lemongrass Beef with Rice", t: "dinner", cu: ["Vietnamese"], r: ["halal", "no-dairy", "no-gluten"], kcal: 500, p: 36, c: 48, f: 16, cost: { low: 1.4, med: 2.0, hi: 2.8 },
        ing: ["Beef sirloin 180g", "Lemongrass 1 stalk", "Garlic 3 cloves", "Fish sauce 1tbsp", "Brown sugar 1tsp", "Jasmine rice 150g"], note: "Marinate 2 hrs, grill on hot coals"
    },
    {
        id: 26, n: "Mediterranean Grilled Sea Bass with Herbs", t: "dinner", cu: ["Mediterranean"], r: ["halal", "no-dairy", "no-gluten"], kcal: 440, p: 38, c: 14, f: 22, cost: { low: 1.6, med: 2.2, hi: 3.0 },
        ing: ["Sea bass 200g", "Olive oil 1tbsp", "Lemon 1", "Garlic 2 cloves", "Thyme & rosemary", "Cherry tomato 80g", "Capers 1tbsp"], note: "Score fish for even cooking"
    },
    {
        id: 27, n: "Spaghetti Bolognese (Lean Beef)", t: "dinner", cu: ["European"], r: ["halal", "no-dairy"], kcal: 560, p: 35, c: 62, f: 16, cost: { low: 1.2, med: 1.7, hi: 2.5 },
        ing: ["Whole wheat spaghetti 100g", "Lean beef mince 180g", "Tomato passata 200g", "Onion 60g", "Carrot 40g", "Celery 40g", "Garlic 2", "Italian herbs 1tsp"], note: "Simmer sauce 30 min for richness"
    },
    {
        id: 28, n: "Chicken & Vegetable Soup (Low-Budget)", t: "dinner", cu: ["European"], r: ["halal", "no-dairy", "no-gluten"], kcal: 340, p: 28, c: 32, f: 8, cost: { low: 0.8, med: 1.2, hi: 1.7 },
        ing: ["Chicken thigh 160g", "Potato 100g", "Carrot 80g", "Celery 60g", "Onion 60g", "Chicken stock 600ml", "Parsley 5g", "Bay leaf 1"], note: "Use bone-in for richer broth"
    },

    // ── SNACKS ─────────────────────────────────────────────
    {
        id: 29, n: "Boiled Eggs × 2", t: "snack", cu: ["Indian", "Pakistani", "European", "Mediterranean"], r: ["halal", "no-dairy", "no-gluten"], kcal: 155, p: 13, c: 1, f: 11, cost: { low: 0.3, med: 0.5, hi: 0.7 },
        ing: ["Eggs 2", "Salt & pepper", "Chaat masala optional"], note: "Boil 9 min for hard-boiled"
    },
    {
        id: 30, n: "Roasted Chana (Spiced Chickpeas)", t: "snack", cu: ["Indian", "Pakistani"], r: ["halal", "vegetarian", "no-dairy", "no-gluten"], kcal: 180, p: 10, c: 28, f: 4, cost: { low: 0.2, med: 0.4, hi: 0.6 },
        ing: ["Dried chickpeas 60g", "Cumin 1tsp", "Chilli powder ½tsp", "Amchur pinch", "Oil spray"], note: "Roast 400°F 25 min"
    },
    {
        id: 31, n: "Greek Yogurt with Honey & Walnuts", t: "snack", cu: ["European", "Mediterranean"], r: ["halal", "vegetarian", "no-gluten"], kcal: 220, p: 16, c: 20, f: 9, cost: { low: 0.6, med: 0.9, hi: 1.3 },
        ing: ["Greek yogurt 150g", "Honey 1tsp", "Walnuts 15g", "Cinnamon pinch"], note: "Swap walnuts for seeds if nut allergy"
    },
    {
        id: 32, n: "Banana with Peanut Butter", t: "snack", cu: ["European", "Indian", "Pakistani", "Thai"], r: ["halal", "vegetarian", "no-dairy", "no-gluten"], kcal: 200, p: 6, c: 32, f: 7, cost: { low: 0.3, med: 0.5, hi: 0.7 },
        ing: ["Banana 1 medium", "Peanut butter 1tbsp"], note: "Skip PB if nut-free; use sunflower seed butter"
    },
    {
        id: 33, n: "Edamame with Sea Salt", t: "snack", cu: ["Japanese", "Chinese"], r: ["halal", "vegetarian", "no-dairy", "no-gluten"], kcal: 150, p: 12, c: 12, f: 5, cost: { low: 0.5, med: 0.8, hi: 1.1 },
        ing: ["Frozen edamame 150g", "Sea salt ½tsp"], note: "Boil 5 min from frozen"
    },
    {
        id: 34, n: "Fruit Chaat (Mixed Fruit with Chaat Masala)", t: "snack", cu: ["Indian", "Pakistani"], r: ["halal", "vegetarian", "no-dairy", "no-gluten"], kcal: 130, p: 2, c: 30, f: 0.5, cost: { low: 0.4, med: 0.6, hi: 0.9 },
        ing: ["Apple 80g", "Banana 50g", "Orange 60g", "Watermelon 80g", "Chaat masala 1tsp", "Lemon juice"], note: "Serve chilled"
    },
    {
        id: 35, n: "Hummus with Carrot & Cucumber Sticks", t: "snack", cu: ["Mediterranean", "European"], r: ["halal", "vegetarian", "no-dairy", "no-gluten"], kcal: 190, p: 8, c: 22, f: 8, cost: { low: 0.5, med: 0.8, hi: 1.2 },
        ing: ["Hummus 60g", "Carrot 80g", "Cucumber 80g"], note: "Homemade hummus: blend chickpeas + tahini + lemon + garlic"
    },
    {
        id: 36, n: "Rice Cake with Almond Butter", t: "snack", cu: ["European", "Japanese"], r: ["halal", "vegetarian", "no-dairy"], kcal: 160, p: 5, c: 22, f: 7, cost: { low: 0.5, med: 0.8, hi: 1.1 },
        ing: ["Rice cakes 2", "Almond butter 1tbsp"], note: "Add sliced banana for extra carbs"
    },
];

// ── Calorie Calc ────────────────────────────────────────────
function calcTDEE(profile) {
    const { gender, age, weight, height, activity, goal } = profile;
    // Mifflin–St Jeor
    let bmr = gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const pal = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryactive: 1.9 };
    let tdee = Math.round(bmr * (pal[activity] || 1.55));
    const adj = { 'weight-loss': -500, 'muscle-gain': 300, maintain: 0 };
    return tdee + (adj[goal] || 0);
}

function calcMacros(kcal, weight, goal) {
    const proteinG = Math.round(goal === 'muscle-gain' ? weight * 2 : weight * 1.6);
    const fatG = Math.round((kcal * 0.25) / 9);
    const carbG = Math.round((kcal - proteinG * 4 - fatG * 9) / 4);
    return { kcal, proteinG, fatG, carbG };
}

// ── Plan Generator ──────────────────────────────────────────
let currentPlan = null;
let currentProfile = null;

function generatePersonalizedPlan() {
    const profile = {
        gender: document.getElementById('gender').value,
        age: parseInt(document.getElementById('age').value) || 30,
        weight: parseFloat(document.getElementById('weight').value) || 75,
        height: parseFloat(document.getElementById('height').value) || 175,
        activity: document.getElementById('activity').value,
        goal: document.getElementById('goal').value,
        budget: document.getElementById('budget').value,
    };

    // Multi-select cuisines & restrictions
    profile.cuisines = [...document.querySelectorAll('#cuisine-categories .category.active')].map(el => el.dataset.cuisine);
    profile.restrictions = [...document.querySelectorAll('#restriction-categories .category.active')].map(el => el.dataset.restriction);

    if (profile.cuisines.length === 0) { alert('Please select at least one cuisine.'); return; }
    if (!profile.age || !profile.weight || !profile.height) { alert('Please fill in all profile fields.'); return; }

    currentProfile = profile;
    const kcal = calcTDEE(profile);
    const macros = calcMacros(kcal, profile.weight, profile.goal);

    // Show TDEE box
    document.getElementById('tdee-display').style.display = 'block';
    document.getElementById('tdee-value').textContent = kcal + ' kcal / day';
    document.getElementById('macro-targets').textContent =
        `Protein ${macros.proteinG}g · Carbs ${macros.carbG}g · Fat ${macros.fatG}g`;

    // Show loading
    const btn = document.getElementById('generate-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    document.getElementById('diet-plan').innerHTML = `<div class="empty-state"><div class="spinner"></div><h3>Building your 7-day plan…</h3></div>`;

    setTimeout(() => {
        try {
            currentPlan = buildPlan(profile, macros);
            renderPlan(currentPlan, profile.budget);
            renderGroceryList(currentPlan, profile.budget);
            document.getElementById('plan-summary').innerHTML =
                `<strong>7-day plan</strong> for ${profile.weight}kg ${profile.gender}, ${profile.age}yrs · <strong>${kcal} kcal/day</strong> · Goal: ${profile.goal.replace('-', ' ')}`;
            document.getElementById('output-tabs').style.display = 'flex';
            switchTab('plan');
        } catch (e) {
            document.getElementById('diet-plan').innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>Error</h3><p>${e.message}</p></div>`;
        } finally {
            btn.disabled = false; btn.innerHTML = '<i class="fas fa-magic"></i> Generate 7-Day Plan';
        }
    }, 600);
}

function buildPlan(profile, macros) {
    const { cuisines, restrictions, budget } = profile;

    function filterMeals(type) {
        return MEALS.filter(m => {
            if (m.t !== type) return false;
            if (!m.cu.some(c => cuisines.includes(c))) return false;
            if (restrictions.length && !restrictions.every(r => m.r.includes(r))) return false;
            return true;
        });
    }

    const pool = {
        breakfast: filterMeals('breakfast'),
        lunch: filterMeals('lunch'),
        dinner: filterMeals('dinner'),
        snack: filterMeals('snack'),
    };

    // Fallback: if no match after restriction filter, drop restriction filter
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(t => {
        if (pool[t].length === 0)
            pool[t] = MEALS.filter(m => m.t === t && m.cu.some(c => cuisines.includes(c)));
    });

    const plan = [];
    for (let d = 1; d <= 7; d++) {
        plan.push({
            day: d,
            breakfast: pickRandom(pool.breakfast, d, 0),
            lunch: pickRandom(pool.lunch, d, 1),
            dinner: pickRandom(pool.dinner, d, 2),
            snack1: pickRandom(pool.snack, d, 3),
            snack2: pickRandom(pool.snack, d, 4),
        });
    }
    return { plan, macros, budget };
}

function pickRandom(arr, day, offset) {
    if (!arr.length) return null;
    return arr[(day * 7 + offset * 3) % arr.length];
}

// ── Render Plan ─────────────────────────────────────────────
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealIcons = { breakfast: 'fa-sun', lunch: 'fa-utensils', dinner: 'fa-moon', snack1: 'fa-apple-alt', snack2: 'fa-seedling' };

function renderPlan(data, budget) {
    const { plan, macros } = data;
    let html = '';
    plan.forEach((day, i) => {
        const meals = [
            { key: 'breakfast', label: 'Breakfast' },
            { key: 'snack1', label: 'Morning Snack' },
            { key: 'lunch', label: 'Lunch' },
            { key: 'snack2', label: 'Afternoon Snack' },
            { key: 'dinner', label: 'Dinner' },
        ];
        const dayKcal = meals.reduce((s, m) => s + (day[m.key]?.kcal || 0), 0);

        html += `<div class="day">
      <div class="day-title">${dayNames[i]} <span class="macro-info">${dayKcal} kcal</span></div>
      <div class="meals">`;

        meals.forEach(({ key, label }) => {
            const meal = day[key];
            if (!meal) return;
            const icon = mealIcons[key] || 'fa-utensils';
            const cost = budgetCost(meal, budget);
            html += `
        <div class="meal">
          <div class="meal-title"><span><i class="fas ${icon}"></i> ${label}</span></div>
          <div class="meal-items">
            <div class="meal-item" onclick="showSwapModal(${meal.id},'${key}',${i})" title="Click to swap this meal">
              ${meal.n}
              <span class="macro-info">P:${meal.p}g C:${meal.c}g F:${meal.f}g</span>
              <div class="prep-note"><i class="fas fa-dollar-sign"></i> ~$${cost.toFixed(2)} &nbsp;|&nbsp; <i class="fas fa-clock"></i> ${meal.note}</div>
            </div>
          </div>
        </div>`;
        });

        html += `</div></div>`;
    });

    document.getElementById('diet-plan').innerHTML = `<div class="plan-days">${html}</div>`;
    document.getElementById('grocery-panel').style.display = 'none';
    document.getElementById('diet-plan').style.display = 'block';
}

function budgetCost(meal, budget) {
    return meal.cost[budget === 'low' ? 'low' : budget === 'high' ? 'hi' : 'med'];
}

// ── Tab Switcher ─────────────────────────────────────────────
function switchTab(tab) {
    document.getElementById('tab-plan').classList.toggle('active', tab === 'plan');
    document.getElementById('tab-grocery').classList.toggle('active', tab === 'grocery');
    document.getElementById('diet-plan').style.display = tab === 'plan' ? 'block' : 'none';
    document.getElementById('grocery-panel').style.display = tab === 'grocery' ? 'block' : 'none';
}

// ── Grocery List ─────────────────────────────────────────────
function renderGroceryList(data, budget) {
    const categories = {
        'Proteins 🥩': ['chicken', 'beef', 'fish', 'salmon', 'egg', 'tofu', 'paneer', 'mutton', 'tuna'],
        'Grains & Carbs 🍚': ['rice', 'oat', 'naan', 'roti', 'bread', 'pasta', 'spaghetti', 'noodle', 'roti', 'spaghetti', 'paratha'],
        'Legumes 🫘': ['lentil', 'beans', 'chickpea', 'chana', 'rajma', 'dal', 'edamame'],
        'Produce 🥦': ['onion', 'tomato', 'spinach', 'potato', 'carrot', 'celery', 'broccoli', 'zucchini', 'pepper', 'cucumber', 'banana', 'apple', 'orange', 'watermelon', 'avocado', 'garlic', 'ginger', 'lemon', 'lime', 'spring onion', 'basil', 'coriander', 'mint', 'parsley', 'lemongrass'],
        'Dairy & Eggs 🥚': ['egg', 'yogurt', 'milk', 'cream', 'butter', 'ghee', 'cheese', 'mozzarella', 'feta'],
        'Pantry 🫙': ['oil', 'olive oil', 'soy sauce', 'fish sauce', 'sesame oil', 'honey', 'peanut butter', 'almond butter', 'cumin', 'coriander', 'garam masala', 'paprika', 'turmeric', 'cinnamon', 'chilli', 'salt', 'pepper', 'masala', 'hoisin', 'mirin', 'tahini', 'balsamic'],
    };

    const allIngredients = [];
    data.plan.forEach(day => {
        ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'].forEach(key => {
            const meal = day[key];
            if (meal) meal.ing.forEach(i => allIngredients.push(i.toLowerCase()));
        });
    });

    // Deduplicate by keyword
    const uniqueItems = [...new Set(allIngredients)];

    let html = '<div style="padding:10px 0"><h3 style="color:#4776E6;margin-bottom:16px"><i class="fas fa-shopping-cart"></i> Weekly Grocery List</h3>';

    for (const [cat, keywords] of Object.entries(categories)) {
        const matched = uniqueItems.filter(item => keywords.some(kw => item.includes(kw)));
        if (!matched.length) continue;
        html += `<div style="margin-bottom:16px"><h4 style="color:#8E54E9;margin-bottom:8px">${cat}</h4><ul style="padding-left:20px">`;
        // Deduplicate matched
        const seen = new Set();
        matched.forEach(item => {
            const base = item.split(/[\d]/)[0].trim();
            if (!seen.has(base)) { seen.add(base); html += `<li style="margin-bottom:4px">${item}</li>`; }
        });
        html += '</ul></div>';
    }
    html += '</div>';
    document.getElementById('grocery-panel').innerHTML = html;
}

// ── Meal Swap Modal ──────────────────────────────────────────
window.showSwapModal = function (mealId, slotKey, dayIdx) {
    if (!currentPlan || !currentProfile) return;

    const currentMeal = currentPlan.plan[dayIdx][slotKey];
    const mealType = currentMeal.t;
    const { cuisines, restrictions, budget } = currentProfile;

    const alternatives = MEALS.filter(m => {
        if (m.id === mealId) return false;
        if (m.t !== mealType) return false;
        if (!m.cu.some(c => cuisines.includes(c))) return false;
        return true;
    }).slice(0, 6);

    let html = `<div style="padding:20px">
    <h3 style="color:#4776E6;margin-bottom:12px">Swap: ${currentMeal.n}</h3>
    <p style="color:#777;margin-bottom:16px">Choose a replacement meal:</p>`;

    alternatives.forEach(m => {
        const cost = budgetCost(m, budget);
        html += `<div class="meal-item" onclick="swapMeal(${m.id},'${slotKey}',${dayIdx})"
      style="cursor:pointer;border:2px solid #e1e5f1;border-radius:10px;padding:12px;margin-bottom:10px">
      <strong>${m.n}</strong>
      <span class="macro-info">P:${m.p}g C:${m.c}g F:${m.f}g</span>
      <div class="prep-note">~$${cost.toFixed(2)} · ${m.note}</div>
    </div>`;
    });

    if (!alternatives.length) html += '<p style="color:#999">No alternatives found for selected cuisines.</p>';
    html += `<button onclick="closeSwapModal()" class="btn secondary" style="margin-top:12px">Cancel</button></div>`;

    let modal = document.getElementById('swap-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'swap-modal';
        modal.className = 'detail-modal';
        modal.innerHTML = `<div class="detail-modal-content"><div id="swap-modal-body"></div></div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) closeSwapModal(); });
    }
    document.getElementById('swap-modal-body').innerHTML = html;
    modal.style.display = 'block';
};

window.swapMeal = function (newId, slotKey, dayIdx) {
    const newMeal = MEALS.find(m => m.id === newId);
    if (newMeal && currentPlan) {
        currentPlan.plan[dayIdx][slotKey] = newMeal;
        closeSwapModal();
        renderPlan(currentPlan, currentProfile.budget);
        renderGroceryList(currentPlan, currentProfile.budget);
    }
};

window.closeSwapModal = function () {
    const modal = document.getElementById('swap-modal');
    if (modal) modal.style.display = 'none';
};

// ── Clear ────────────────────────────────────────────────────
window.clearPlan = function () {
    if (!confirm('Clear current plan?')) return;
    currentPlan = null;
    document.getElementById('diet-plan').innerHTML = `<div class="empty-state"><i class="fas fa-utensils"></i><h3>Your Diet Plan Awaits</h3><p>Enter your profile and click "Generate 7-Day Plan"</p></div>`;
    document.getElementById('grocery-panel').innerHTML = '';
    document.getElementById('output-tabs').style.display = 'none';
    document.getElementById('tdee-display').style.display = 'none';
    document.getElementById('plan-summary').textContent = 'Fill in your profile and click Generate 7-Day Plan';
};

// ── Multi-select toggle helper ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#cuisine-categories .category').forEach(el => {
        el.addEventListener('click', () => el.classList.toggle('active'));
    });
    document.querySelectorAll('#restriction-categories .category').forEach(el => {
        el.addEventListener('click', () => el.classList.toggle('active'));
    });
});
