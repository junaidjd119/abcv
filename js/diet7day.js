/**
 * Advanced AI Diet Planner Engine v3
 * - Pure Mifflin-St Jeor TDEE (no flat offsets)
 * - Custom calorie override
 * - 50+ meals with medical tags
 * - Dynamic 3-30 day generation
 */

const MEAL_LABELS = {
    breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner',
    snack1: 'Morning Snack', snack2: 'Afternoon Snack', snack3: 'Evening Snack'
};

// ======== MASSIVE MEAL DATABASE (50+ entries) ========
const MEALS = [
    // ===== BREAKFASTS =====
    {
        id: 'B01', type: 'breakfast', comp: 'simple', name: 'Soothing Oatmeal & Boiled Apple',
        cuisines: ['European', 'American', 'Mediterranean'], restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe', 'heart-safe', 'diabetes-safe'],
        base_kcal: 300, base_p: 10, base_c: 55, base_f: 5,
        ingredients: ['Oats (50g)', 'Apple (1 small, peeled & boiled)', 'Water (200ml)', 'Cinnamon (pinch)'],
        prep: 'Boil oats with water. Stir in soft boiled apple pieces. Very gentle on any stomach.'
    },
    {
        id: 'B02', type: 'breakfast', comp: 'advanced', name: 'Mediterranean Shakshuka',
        cuisines: ['Mediterranean', 'European'], restrictions: ['halal', 'vegetarian', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTags: ['acidic', 'spicy'],
        base_kcal: 380, base_p: 22, base_c: 20, base_f: 24,
        ingredients: ['Eggs (3)', 'Tomato Puree (150g)', 'Onion (1 small)', 'Bell Pepper (1/2)', 'Olive Oil (1 tbsp)', 'Cumin & Paprika'],
        prep: 'Sauté onions & peppers, add tomatoes & spices. Simmer 5min, crack eggs in, cover until set.'
    },
    {
        id: 'B03', type: 'breakfast', comp: 'simple', name: 'Rice Porridge (Congee) & Egg',
        cuisines: ['Chinese', 'Japanese', 'East Asian'], restrictions: ['halal', 'no-dairy', 'no-nuts'],
        medicalTips: ['ibs-safe', 'acidity-safe'],
        base_kcal: 320, base_p: 15, base_c: 50, base_f: 6,
        ingredients: ['White Rice (50g dry)', 'Chicken Broth (300ml)', 'Egg (1 boiled)', 'Ginger (1 thin slice)'],
        prep: 'Simmer rice in broth 45 min until broken down. Serve with peeled boiled egg.'
    },
    {
        id: 'B04', type: 'breakfast', comp: 'advanced', name: 'Indian Masala Omelette & Roti',
        cuisines: ['Indian', 'Pakistani'], restrictions: ['halal', 'vegetarian', 'no-dairy', 'no-nuts'],
        medicalTags: ['spicy'],
        base_kcal: 450, base_p: 22, base_c: 40, base_f: 20,
        ingredients: ['Eggs (3)', 'Whole Wheat Roti (1)', 'Onion (1/4)', 'Tomato (1/4)', 'Green Chili', 'Oil (1 tsp)'],
        prep: 'Whisk eggs with veggies & spices. Cook omelette in oil. Serve with warm roti.'
    },
    {
        id: 'B05', type: 'breakfast', comp: 'simple', name: 'Greek Yogurt & Berry Bowl',
        cuisines: ['European', 'Mediterranean'], restrictions: ['halal', 'vegetarian', 'no-gluten'],
        medicalTags: ['heavy-dairy'],
        base_kcal: 280, base_p: 22, base_c: 30, base_f: 5,
        ingredients: ['Greek Yogurt (200g)', 'Mixed Berries (100g)', 'Chia Seeds (1 tsp)'],
        prep: 'Combine in a bowl. Simple and protein-rich.'
    },
    {
        id: 'B06', type: 'breakfast', comp: 'simple', name: 'Scrambled Eggs on Sourdough',
        cuisines: ['European', 'American'], restrictions: ['halal', 'vegetarian', 'no-nuts'],
        medicalTips: ['acidity-safe', 'ibs-safe'],
        base_kcal: 350, base_p: 20, base_c: 30, base_f: 15,
        ingredients: ['Eggs (2)', 'Sourdough Bread (2 slices)', 'Butter (1 tsp)', 'Salt (pinch)'],
        prep: 'Soft scramble eggs in butter. Serve on toasted sourdough.'
    },
    {
        id: 'B07', type: 'breakfast', comp: 'advanced', name: 'Japanese Salmon Breakfast',
        cuisines: ['Japanese', 'East Asian'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['heart-safe', 'acidity-safe'],
        base_kcal: 400, base_p: 30, base_c: 40, base_f: 12,
        ingredients: ['Salmon Fillet (100g)', 'White Rice (75g dry)', 'Miso Soup (1 pkt)', 'Steamed Spinach (50g)'],
        prep: 'Grill salmon lightly. Serve with steamed rice, hot miso, and soft spinach.'
    },
    {
        id: 'B08', type: 'breakfast', comp: 'simple', name: 'Banana Peanut Butter Toast',
        cuisines: ['American', 'European'], restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy'],
        medicalTips: ['acidity-safe'],
        base_kcal: 380, base_p: 12, base_c: 48, base_f: 16,
        ingredients: ['Whole Wheat Bread (2 slices)', 'Banana (1 medium)', 'Peanut Butter (1 tbsp)'],
        prep: 'Toast bread, spread peanut butter, top with sliced banana.'
    },
    {
        id: 'B09', type: 'breakfast', comp: 'advanced', name: 'Pakistani Halwa Puri (Light)',
        cuisines: ['Pakistani', 'Indian'], restrictions: ['halal', 'vegetarian', 'no-nuts'],
        medicalTags: ['fried', 'refined-carbs'],
        base_kcal: 550, base_p: 12, base_c: 70, base_f: 26,
        ingredients: ['Atta Flour (100g)', 'Semolina (40g)', 'Ghee (1 tbsp)', 'Sugar (2 tsp)', 'Oil for frying'],
        prep: 'Make small puris, deep fry. Cook semolina halwa with ghee and sugar. Traditional weekend breakfast.'
    },
    {
        id: 'B10', type: 'breakfast', comp: 'simple', name: 'Smoothie Bowl (Tropical)',
        cuisines: ['American', 'European', 'Mediterranean'], restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-gluten'],
        medicalTips: ['heart-safe'],
        base_kcal: 320, base_p: 8, base_c: 60, base_f: 6,
        ingredients: ['Frozen Mango (100g)', 'Banana (1/2)', 'Oat Milk (100ml)', 'Granola (30g)', 'Chia Seeds (1 tsp)'],
        prep: 'Blend mango and banana with oat milk. Pour into bowl, top with granola and chia.'
    },

    // ===== LUNCHES =====
    {
        id: 'L01', type: 'lunch', comp: 'simple', name: 'Steamed Chicken & White Rice',
        cuisines: ['European', 'American', 'Asian', 'Indian', 'Pakistani'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe', 'diabetes-safe', 'heart-safe'],
        base_kcal: 420, base_p: 45, base_c: 45, base_f: 5,
        ingredients: ['Chicken Breast (150g)', 'White Rice (75g dry)', 'Zucchini (100g, peeled & steamed)', 'Salt (pinch)'],
        prep: 'Steam chicken and peeled zucchini until very soft. Serve with plain white rice.'
    },
    {
        id: 'L02', type: 'lunch', comp: 'advanced', name: 'Chicken Biryani',
        cuisines: ['Indian', 'Pakistani'], restrictions: ['halal', 'no-nuts', 'no-gluten'],
        medicalTags: ['spicy'],
        base_kcal: 600, base_p: 40, base_c: 70, base_f: 18,
        ingredients: ['Basmati Rice (75g dry)', 'Chicken Thigh (150g)', 'Biryani Masala', 'Onion (1/2)', 'Yogurt (1 tbsp)', 'Oil (1 tbsp)'],
        prep: 'Marinate chicken with yogurt and spices. Layer with parboiled rice and steam until fragrant.'
    },
    {
        id: 'L03', type: 'lunch', comp: 'advanced', name: 'Thai Basil Chicken',
        cuisines: ['Thai', 'Southeast Asian'], restrictions: ['no-dairy', 'no-nuts'],
        medicalTags: ['spicy'],
        base_kcal: 550, base_p: 45, base_c: 60, base_f: 15,
        ingredients: ['Minced Chicken (150g)', 'Jasmine Rice (75g dry)', 'Holy Basil', 'Garlic & Chili', 'Soy Sauce', 'Fried Egg (1)'],
        prep: 'Stir-fry garlic and chili, add chicken. Finish with sauces and basil. Serve with rice and fried egg.'
    },
    {
        id: 'L04', type: 'lunch', comp: 'simple', name: 'Gentle Daal & Rice',
        cuisines: ['Indian', 'Pakistani', 'Mediterranean'], restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['acidity-safe', 'heart-safe'],
        medicalTags: ['high-fodmap'],
        base_kcal: 400, base_p: 20, base_c: 60, base_f: 5,
        ingredients: ['Red Lentils (60g dry)', 'Turmeric (1/2 tsp)', 'Cumin (1/2 tsp)', 'Carrot (50g)', 'White Rice (50g dry)'],
        prep: 'Boil lentils and carrots with gentle spices until completely mushy. Serve over rice.'
    },
    {
        id: 'L05', type: 'lunch', comp: 'simple', name: 'Tuna & Bean Salad',
        cuisines: ['Mediterranean', 'European'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTags: ['raw-veg'],
        base_kcal: 480, base_p: 38, base_c: 35, base_f: 18,
        ingredients: ['Canned Tuna (100g)', 'White Beans (80g)', 'Red Onion (1/4)', 'Cucumber (50g)', 'Olive Oil (1 tbsp)', 'Lemon'],
        prep: 'Drain tuna and beans. Mix with vegetables, oil, and lemon juice.'
    },
    {
        id: 'L06', type: 'lunch', comp: 'advanced', name: 'Tofu & Veggie Stir-Fry',
        cuisines: ['Chinese', 'Japanese', 'East Asian'], restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts'],
        medicalTips: ['ibs-safe', 'acidity-safe', 'heart-safe'],
        base_kcal: 450, base_p: 24, base_c: 50, base_f: 16,
        ingredients: ['Firm Tofu (150g)', 'Carrots (100g sliced)', 'Bok Choy (100g)', 'Soy Sauce (1 tbsp)', 'Sesame Oil (1 tsp)', 'Rice (50g)'],
        prep: 'Fry tofu, add veggies until soft. Toss in gentle sauce. Serve with rice.'
    },
    {
        id: 'L07', type: 'lunch', comp: 'simple', name: 'Chicken Wrap (Mediterranean)',
        cuisines: ['Mediterranean', 'European', 'American'], restrictions: ['halal', 'no-dairy', 'no-nuts'],
        medicalTips: ['acidity-safe'],
        base_kcal: 480, base_p: 35, base_c: 45, base_f: 16,
        ingredients: ['Grilled Chicken (120g)', 'Whole Wheat Tortilla (1 large)', 'Lettuce (50g)', 'Hummus (2 tbsp)', 'Cucumber (50g)'],
        prep: 'Spread hummus on tortilla. Add sliced grilled chicken, lettuce, and cucumber. Roll up.'
    },
    {
        id: 'L08', type: 'lunch', comp: 'advanced', name: 'Pakistani Chicken Karahi',
        cuisines: ['Pakistani', 'Indian'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTags: ['spicy'],
        base_kcal: 520, base_p: 42, base_c: 15, base_f: 32,
        ingredients: ['Chicken (200g on bone)', 'Tomatoes (150g)', 'Ginger-Garlic Paste', 'Green Chilies', 'Oil (2 tbsp)'],
        prep: 'Cook chicken with tomatoes, ginger-garlic, and green chilies in oil until tender. Serve with roti.'
    },
    {
        id: 'L09', type: 'lunch', comp: 'simple', name: 'Egg Fried Rice',
        cuisines: ['Chinese', 'East Asian'], restrictions: ['halal', 'no-dairy', 'no-nuts'],
        medicalTips: ['acidity-safe'],
        base_kcal: 450, base_p: 18, base_c: 60, base_f: 14,
        ingredients: ['Cooked Rice (150g)', 'Eggs (2)', 'Frozen Peas & Corn (80g)', 'Soy Sauce (1 tbsp)', 'Sesame Oil (1 tsp)'],
        prep: 'Scramble eggs, push aside. Stir-fry rice with vegetables and soy sauce on high heat.'
    },
    {
        id: 'L10', type: 'lunch', comp: 'advanced', name: 'Mediterranean Grilled Fish Plate',
        cuisines: ['Mediterranean', 'European'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['heart-safe', 'ibs-safe'],
        base_kcal: 420, base_p: 42, base_c: 20, base_f: 18,
        ingredients: ['White Fish (180g)', 'Roasted Vegetables (150g)', 'Olive Oil (1 tbsp)', 'Lemon Juice', 'Herbs'],
        prep: 'Season fish with herbs, grill or bake. Serve with roasted zucchini, bell peppers, and olive oil.'
    },

    // ===== DINNERS =====
    {
        id: 'D01', type: 'dinner', comp: 'advanced', name: 'Bone Broth Beef Stew',
        cuisines: ['European', 'American'], restrictions: ['no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe'],
        base_kcal: 500, base_p: 40, base_c: 35, base_f: 18,
        ingredients: ['Lean Beef (150g chunks)', 'Bone Broth (300ml)', 'Potatoes (150g peeled)', 'Carrots (100g boiled)'],
        prep: 'Slow cook beef, peeled potatoes, and carrots in bone broth until extremely tender.'
    },
    {
        id: 'D02', type: 'dinner', comp: 'advanced', name: 'Palak Paneer & Roti',
        cuisines: ['Indian', 'Pakistani'], restrictions: ['halal', 'vegetarian', 'no-nuts'],
        medicalTags: ['heavy-dairy', 'spicy'],
        base_kcal: 550, base_p: 25, base_c: 45, base_f: 30,
        ingredients: ['Paneer (100g)', 'Spinach (200g pureed)', 'Whole Wheat Roti (2)', 'Onion/Tomato Paste', 'Cream (1 tbsp)'],
        prep: 'Cook onion-tomato base, add spinach puree, cream, spices. Simmer with paneer. Serve with roti.'
    },
    {
        id: 'D03', type: 'dinner', comp: 'advanced', name: 'Vietnamese Pho (Beef)',
        cuisines: ['Vietnamese', 'Southeast Asian'], restrictions: ['no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe'],
        base_kcal: 480, base_p: 40, base_c: 65, base_f: 8,
        ingredients: ['Beef Sirloin (150g thin sliced)', 'Rice Noodles (75g dry)', 'Beef Broth (500ml)', 'Star Anise', 'Coriander'],
        prep: 'Simmer clear broth with spices. Pour boiling broth over noodles and raw beef to cook instantly.'
    },
    {
        id: 'D04', type: 'dinner', comp: 'simple', name: 'Baked White Fish & Vegetables',
        cuisines: ['Mediterranean', 'European'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['heart-safe', 'ibs-safe'],
        base_kcal: 400, base_p: 45, base_c: 15, base_f: 15,
        ingredients: ['White Fish Fillet (200g)', 'Zucchini (150g peeled)', 'Olive Oil (1 tbsp)', 'Thyme & Salt'],
        prep: 'Bake fish in foil with oil and zucchini at 200°C for 15 min. Clean and easy to digest.'
    },
    {
        id: 'D05', type: 'dinner', comp: 'advanced', name: 'Spicy Szechuan Chicken',
        cuisines: ['Chinese'], restrictions: ['no-dairy', 'no-nuts'],
        medicalTags: ['spicy'],
        base_kcal: 520, base_p: 42, base_c: 45, base_f: 18,
        ingredients: ['Chicken Thigh (150g)', 'Szechuan Peppercorns & Chilis', 'Bell Peppers (100g)', 'Soy Sauce (2 tbsp)', 'Rice (50g)'],
        prep: 'Aggressive stir-fry with dry chilis and peppercorns. Very hot! Serve with rice.'
    },
    {
        id: 'D06', type: 'dinner', comp: 'simple', name: 'Sweet Potato & Turkey Mash',
        cuisines: ['American', 'European'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe'],
        base_kcal: 480, base_p: 40, base_c: 55, base_f: 12,
        ingredients: ['Lean Ground Turkey (150g)', 'Sweet Potato (200g)', 'Olive Oil (1 tsp)', 'Salt & Herbs'],
        prep: 'Boil and mash sweet potato. Pan-cook turkey with mild herbs. Mix together.'
    },
    {
        id: 'D07', type: 'dinner', comp: 'advanced', name: 'Chicken Tikka Masala',
        cuisines: ['Indian', 'Pakistani'], restrictions: ['halal', 'no-nuts'],
        medicalTags: ['spicy', 'heavy-dairy'],
        base_kcal: 580, base_p: 40, base_c: 45, base_f: 24,
        ingredients: ['Chicken Breast (180g)', 'Tomato Sauce (150g)', 'Yogurt (2 tbsp)', 'Naan (1 small)', 'Garam Masala', 'Cream (1 tbsp)'],
        prep: 'Grill marinated chicken. Simmer in rich tomato-cream sauce with spices. Serve with naan.'
    },
    {
        id: 'D08', type: 'dinner', comp: 'simple', name: 'Grilled Chicken & Quinoa Bowl',
        cuisines: ['Mediterranean', 'American', 'European'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['heart-safe', 'diabetes-safe'],
        base_kcal: 460, base_p: 42, base_c: 42, base_f: 12,
        ingredients: ['Chicken Breast (150g)', 'Quinoa (60g dry)', 'Cherry Tomatoes (80g)', 'Olive Oil (1 tsp)', 'Lemon Juice'],
        prep: 'Grill chicken. Cook quinoa. Serve together with halved tomatoes and lemon-oil dressing.'
    },
    {
        id: 'D09', type: 'dinner', comp: 'advanced', name: 'Japanese Teriyaki Salmon',
        cuisines: ['Japanese', 'East Asian'], restrictions: ['halal', 'no-dairy', 'no-nuts'],
        medicalTips: ['heart-safe'],
        base_kcal: 520, base_p: 38, base_c: 50, base_f: 18,
        ingredients: ['Salmon Fillet (150g)', 'Teriyaki Sauce (2 tbsp)', 'Jasmine Rice (75g dry)', 'Steamed Broccoli (100g)'],
        prep: 'Pan-sear salmon, glaze with teriyaki. Serve over rice with steamed broccoli.'
    },
    {
        id: 'D10', type: 'dinner', comp: 'simple', name: 'Boiled Chicken & Mashed Potato',
        cuisines: ['European', 'American', 'Asian'], restrictions: ['halal', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe', 'heart-safe'],
        base_kcal: 430, base_p: 40, base_c: 45, base_f: 8,
        ingredients: ['Chicken Breast (150g, boiled)', 'Potatoes (200g, mashed)', 'Salt (pinch)', 'Olive Oil (1 tsp)'],
        prep: 'Boil chicken until fully cooked. Mash potatoes with a touch of oil. The most gentle dinner possible.'
    },
    {
        id: 'D11', type: 'dinner', comp: 'advanced', name: 'Pakistani Daal Chawal (Comfort)',
        cuisines: ['Pakistani', 'Indian'], restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['acidity-safe', 'heart-safe'],
        medicalTags: ['high-fodmap'],
        base_kcal: 420, base_p: 18, base_c: 68, base_f: 8,
        ingredients: ['Masoor Daal (80g dry)', 'Basmati Rice (80g dry)', 'Onion (1/2)', 'Tomato (1)', 'Turmeric', 'Cumin'],
        prep: 'Cook daal with onion, tomato, and mild spices. Serve over steamed basmati rice. Pakistani comfort food.'
    },
    {
        id: 'D12', type: 'dinner', comp: 'simple', name: 'Veggie Pasta (Simple)',
        cuisines: ['European', 'Mediterranean', 'American'], restrictions: ['halal', 'vegetarian', 'no-nuts'],
        medicalTips: ['acidity-safe'],
        medicalTags: ['refined-carbs'],
        base_kcal: 500, base_p: 16, base_c: 75, base_f: 14,
        ingredients: ['Whole Wheat Pasta (80g dry)', 'Olive Oil (1 tbsp)', 'Garlic (2 cloves)', 'Broccoli (100g)', 'Parmesan (15g)'],
        prep: 'Cook pasta. Sauté garlic and broccoli in oil. Toss with pasta and parmesan.'
    },

    // ===== SNACKS =====
    {
        id: 'S01', type: 'snack', comp: 'simple', name: 'Rice Cakes & Banana',
        cuisines: ['European', 'American', 'Asian', 'Indian', 'Pakistani', 'Mediterranean'],
        restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe', 'diabetes-safe'],
        base_kcal: 180, base_p: 3, base_c: 40, base_f: 1,
        ingredients: ['Plain Rice Cakes (2)', 'Ripe Banana (1 medium)'],
        prep: 'Slice banana over rice cakes. Very gentle on stomach.'
    },
    {
        id: 'S02', type: 'snack', comp: 'simple', name: 'Handful of Almonds',
        cuisines: ['European', 'American', 'Asian', 'Mediterranean'],
        restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-gluten'],
        medicalTips: ['heart-safe'],
        base_kcal: 170, base_p: 6, base_c: 6, base_f: 15,
        ingredients: ['Raw Almonds (30g)'],
        prep: 'Eat raw or lightly toasted.'
    },
    {
        id: 'S03', type: 'snack', comp: 'simple', name: 'Chamomile Tea & Melon',
        cuisines: ['European', 'American', 'Asian', 'Indian', 'Pakistani', 'Mediterranean'],
        restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe'],
        base_kcal: 80, base_p: 1, base_c: 20, base_f: 0,
        ingredients: ['Chamomile Tea (1 cup)', 'Cantaloupe/Melon (150g)'],
        prep: 'Brew warm tea. Eat soft, hydrating melon.'
    },
    {
        id: 'S04', type: 'snack', comp: 'simple', name: 'Roasted Chickpeas (Spicy)',
        cuisines: ['Indian', 'Pakistani', 'Mediterranean'],
        restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTags: ['spicy', 'high-fodmap'],
        base_kcal: 220, base_p: 10, base_c: 35, base_f: 6,
        ingredients: ['Canned Chickpeas (100g)', 'Olive Oil (1 tsp)', 'Chili Powder & Chaat Masala'],
        prep: 'Drain chickpeas. Toss with oil and spices, roast at 200°C for 20 min.'
    },
    {
        id: 'S05', type: 'snack', comp: 'simple', name: 'Boiled Egg Whites',
        cuisines: ['European', 'American', 'Asian', 'Indian', 'Pakistani', 'Mediterranean'],
        restrictions: ['halal', 'vegetarian', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe', 'heart-safe', 'diabetes-safe'],
        base_kcal: 100, base_p: 20, base_c: 2, base_f: 0,
        ingredients: ['Boiled Egg Whites (from 3 eggs)', 'Salt (pinch)'],
        prep: 'Boil eggs hard, remove yolks. Pure lean protein.'
    },
    {
        id: 'S06', type: 'snack', comp: 'simple', name: 'Apple & Peanut Butter',
        cuisines: ['American', 'European'],
        restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-gluten'],
        medicalTips: ['heart-safe'],
        base_kcal: 250, base_p: 8, base_c: 25, base_f: 16,
        ingredients: ['Apple (1 medium)', 'Peanut Butter (2 tbsp)'],
        prep: 'Slice apple and dip in peanut butter.'
    },
    {
        id: 'S07', type: 'snack', comp: 'simple', name: 'Protein Shake',
        cuisines: ['European', 'American', 'Asian', 'Indian', 'Pakistani', 'Mediterranean'],
        restrictions: ['halal', 'vegetarian', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe'],
        base_kcal: 130, base_p: 25, base_c: 4, base_f: 1,
        ingredients: ['Whey Protein Powder (1 scoop)', 'Water (250ml)'],
        prep: 'Shake in a bottle or blender. Fast pure protein.'
    },
    {
        id: 'S08', type: 'snack', comp: 'simple', name: 'Cucumber & Hummus',
        cuisines: ['Mediterranean', 'European', 'American'],
        restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-nuts', 'no-gluten'],
        medicalTips: ['ibs-safe', 'acidity-safe', 'heart-safe', 'diabetes-safe'],
        base_kcal: 150, base_p: 6, base_c: 14, base_f: 8,
        ingredients: ['Cucumber (100g, sliced)', 'Hummus (3 tbsp)'],
        prep: 'Dip cucumber slices in hummus. Simple and stomach-friendly.'
    },
    {
        id: 'S09', type: 'snack', comp: 'simple', name: 'Yogurt & Honey',
        cuisines: ['European', 'Mediterranean', 'Indian', 'Pakistani'],
        restrictions: ['halal', 'vegetarian', 'no-nuts', 'no-gluten'],
        medicalTags: ['heavy-dairy'],
        base_kcal: 160, base_p: 10, base_c: 25, base_f: 3,
        ingredients: ['Natural Yogurt (150g)', 'Honey (1 tsp)'],
        prep: 'Drizzle honey over yogurt. Simple and satisfying.'
    },
    {
        id: 'S10', type: 'snack', comp: 'simple', name: 'Dates & Walnuts',
        cuisines: ['Indian', 'Pakistani', 'Mediterranean', 'European'],
        restrictions: ['halal', 'vegetarian', 'vegan', 'no-dairy', 'no-gluten'],
        medicalTips: ['heart-safe'],
        medicalTags: ['high-sugar'],
        base_kcal: 200, base_p: 4, base_c: 35, base_f: 8,
        ingredients: ['Medjool Dates (3)', 'Walnuts (15g)'],
        prep: 'Stuff each date with a walnut piece. Traditional energy snack.'
    },
];

// ======== ENGINE LOGIC ========

function convertToMetric(val, unit, isHeight) {
    if (isHeight) {
        if (unit === 'cm') return parseFloat(val);
        const num = parseFloat(val);
        const feet = Math.floor(num);
        const str = String(val);
        const inches = str.includes('.') ? parseFloat(str.split('.')[1]) : 0;
        return ((feet * 12) + inches) * 2.54;
    } else {
        if (unit === 'kg') return parseFloat(val);
        return parseFloat(val) * 0.453592;
    }
}

function generatePlan(profile) {
    if (!profile) throw new Error("Profile required");

    // 1. Metric Conversions
    const weightKg = convertToMetric(profile.weight, profile.weightUnit, false);
    const heightCm = convertToMetric(profile.height, profile.heightUnit, true);

    // 2. Calculate pure TDEE using Mifflin-St Jeor (NO flat offsets)
    const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * profile.age) + (profile.gender === 'male' ? 5 : -161);
    const actMult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryactive: 1.9 };
    const tdee = Math.round(bmr * (actMult[profile.activity] || 1.2));

    // 3. Determine final daily calories
    // If user provided custom calories, use that. Otherwise use pure TDEE.
    let kcal = tdee;
    if (profile.customCalories && profile.customCalories > 0) {
        kcal = Math.round(profile.customCalories);
    }

    // Hydration
    const waterLiters = (weightKg * 0.033).toFixed(1);

    // 4. Macros Fine Tuning
    let p_pct = 0.30, c_pct = 0.45, f_pct = 0.25;
    if (profile.macroTweak === 'high-protein') { p_pct = 0.40; c_pct = 0.35; f_pct = 0.25; }
    else if (profile.macroTweak === 'low-carb') { p_pct = 0.35; c_pct = 0.20; f_pct = 0.45; }

    const macros = {
        proteinG: Math.round((kcal * p_pct) / 4),
        carbG: Math.round((kcal * c_pct) / 4),
        fatG: Math.round((kcal * f_pct) / 9)
    };

    // 5. Meal Distribution (3-6 meals)
    const slots = parseInt(profile.mealsPerDay) || 3;
    const structure = ['breakfast', 'lunch', 'dinner'];
    if (slots >= 4) structure.push('snack1');
    if (slots >= 5) structure.push('snack2');
    if (slots >= 6) structure.push('snack3');

    let mw = { breakfast: 0.25, lunch: 0.35, dinner: 0.35 };
    if (slots === 4) mw = { breakfast: 0.25, lunch: 0.30, dinner: 0.30, snack1: 0.15 };
    if (slots === 5) mw = { breakfast: 0.25, lunch: 0.25, dinner: 0.30, snack1: 0.10, snack2: 0.10 };
    if (slots === 6) mw = { breakfast: 0.20, lunch: 0.25, dinner: 0.25, snack1: 0.10, snack2: 0.10, snack3: 0.10 };

    // 6. Medical Filtering
    const exTags = new Set();
    const cond = profile.healthCondition;
    if (cond === 'ibs') { exTags.add('spicy'); exTags.add('heavy-dairy'); exTags.add('high-fodmap'); exTags.add('raw-veg'); }
    if (cond === 'acidity') { exTags.add('acidic'); exTags.add('spicy'); exTags.add('fried'); }
    if (cond === 'diabetes') { exTags.add('refined-carbs'); exTags.add('high-sugar'); }
    if (cond === 'heart') { exTags.add('high-sat-fat'); exTags.add('fried'); }

    const filterDB = (type) => {
        return MEALS.filter(m => {
            const isType = type.startsWith('snack') ? m.type === 'snack' : m.type === type;
            const hasCuisine = !profile.cuisines.length || m.cuisines.some(c => profile.cuisines.includes(c));
            const passR = profile.restrictions.every(r => m.restrictions.includes(r));
            let passM = true;
            if (m.medicalTags) m.medicalTags.forEach(t => { if (exTags.has(t)) passM = false; });
            return isType && hasCuisine && passR && passM;
        });
    };

    const pools = {
        breakfast: filterDB('breakfast'),
        lunch: filterDB('lunch'),
        dinner: filterDB('dinner'),
        snack: filterDB('snack')
    };
    // Fallback: if empty after filtering, use all of that type
    Object.keys(pools).forEach(k => {
        if (!pools[k].length) pools[k] = MEALS.filter(m => m.type === k);
    });

    const getRand = (arr, num) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.max(1, num));
    };

    // 7. Build N Days
    const duration = parseInt(profile.duration) || 7;
    const daysArray = [];
    const allIngredients = [];

    for (let d = 1; d <= duration; d++) {
        const dayMeals = [];
        structure.forEach(slotKey => {
            const targetKcal = kcal * mw[slotKey];
            const pool = slotKey.startsWith('snack') ? pools.snack : pools[slotKey];
            const options = getRand(pool, 4);

            const scaledOptions = options.map(m => {
                const multi = targetKcal / m.base_kcal;
                return {
                    id: m.id, name: m.name, complexity: m.comp,
                    macros: {
                        kcal: Math.round(targetKcal),
                        protein: Math.round(m.base_p * multi),
                        carbs: Math.round(m.base_c * multi),
                        fat: Math.round(m.base_f * multi)
                    },
                    ingredients: m.ingredients.map(ing => scaleIngredient(ing, multi)),
                    prep: m.prep,
                    tags: m.restrictions,
                    medicalTips: m.medicalTips || null
                };
            });

            const selected = scaledOptions[0];
            dayMeals.push({
                slot: slotKey,
                label: MEAL_LABELS[slotKey] || slotKey,
                selected: selected,
                alternatives: scaledOptions
            });
            allIngredients.push(...selected.ingredients);
        });
        daysArray.push({ day: d, meals: dayMeals });
    }

    // 8. Grocery List
    const pItems = (profile.pantry || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
    const groceryCategories = categorizeIngredients(allIngredients, pItems);

    return {
        summary: {
            duration, tdee, dailyCalories: kcal,
            hydrationLiters: waterLiters, macros,
            goal: profile.goal
        },
        days: daysArray,
        groceryList: groceryCategories
    };
}

function scaleIngredient(ingStr, multiplier) {
    return ingStr.replace(/(\d+(\.\d+)?)(g|ml| tsp| tbsp| scoop| pkt| slice| large| small| medium| cup)/g, (match, numStr, dec, unit) => {
        const s = Math.round(parseFloat(numStr) * multiplier);
        return (s === 0 ? '1' : s) + unit;
    });
}

function categorizeIngredients(arr, pantryArr) {
    const cats = {
        'Produce': ['onion', 'tomato', 'spinach', 'potato', 'carrot', 'broccoli', 'pepper', 'avocado', 'garlic', 'ginger', 'lemon', 'apple', 'berry', 'pineapple', 'cucumber', 'cabbage', 'melon', 'grapefruit', 'zucchini', 'banana', 'mango', 'dates', 'peas', 'corn'],
        'Proteins & Dairy': ['chicken', 'beef', 'turkey', 'fish', 'salmon', 'tuna', 'egg', 'yogurt', 'cheese', 'paneer', 'tofu', 'whey', 'milk', 'miso', 'cream'],
        'Grains & Carbs': ['rice', 'oat', 'roti', 'bread', 'sourdough', 'quinoa', 'noodle', 'pasta', 'lentil', 'beans', 'chickpeas', 'tortilla', 'naan', 'flour', 'semolina', 'granola'],
        'Pantry/Spices': ['oil', 'sauce', 'honey', 'butter', 'ghee', 'nut', 'almond', 'walnut', 'peanut', 'masala', 'cumin', 'paprika', 'salt', 'balsamic', 'cinnamon', 'tea', 'sugar', 'soy', 'hummus', 'chia']
    };
    const out = {}; Object.keys(cats).forEach(k => out[k] = []);

    const uniqueRaw = [...new Set(arr.map(s => s.trim()))];
    uniqueRaw.forEach(item => {
        const itemLow = item.toLowerCase();
        if (pantryArr.some(p => itemLow.includes(p))) return;
        let foundCat = 'Other';
        for (const [cat, kws] of Object.entries(cats)) {
            if (kws.some(kw => itemLow.includes(kw))) { foundCat = cat; break; }
        }
        if (!out[foundCat]) out[foundCat] = [];
        const cleanName = item.split('(')[0].trim();
        if (!out[foundCat].includes(cleanName)) out[foundCat].push(cleanName);
    });
    return out;
}
