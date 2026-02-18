/* 
   GymTranning Global Script
   Handles Navbar/Footer Injection and UI Logic
*/

// --- Navbar & Footer Templates ---
const NAVBAR_HTML = `
<nav class="navbar">
    <div class="nav-container">
        <a href="index.html" class="logo">
            <span class="logo-icon">💪</span>
            <span class="logo-text">GYMTRANNING</span>
        </a>
        <div class="flex-grow"></div>
        <ul class="nav-menu" id="nav-menu">
            <li class="nav-item"><a href="index.html">HOME</a></li>
            <li class="nav-item"><a href="dietplanner.html">DIET GENERATOR</a></li>
            <li class="nav-item"><a href="caloriecalculator.html">CALORIE CALCULATOR</a></li>
            <li class="nav-item"><a href="nutrition.html">Nutrition</a></li>
            <li class="nav-item"><a href="contact.html">Contact</a></li>
        </ul>
        <button class="hamburger" id="mobile-menu-toggle" aria-label="Menu" aria-expanded="false">
            <span class="hamburger-box"><span class="hamburger-inner"></span></span>
        </button>
    </div>
</nav>
<div id="mobile-overlay" class="mobile-overlay"></div>
`;

const FOOTER_HTML = `
<footer class="powerpulse-footer-container">
    <div class="powerpulse-footer-top">
        <div class="powerpulse-brand-section">
            <div class="powerpulse-brand-logo">
                <div class="powerpulse-logo-icon"><i class="fas fa-dumbbell"></i></div>
                <div class="powerpulse-logo-text">GYMTRANNING</div>
            </div>
            <p class="powerpulse-brand-description">Transform your fitness journey with science-backed training programs, personalized nutrition plans, and expert coaching.</p>
        </div>
        <div class="powerpulse-footer-column">
            <h4 class="powerpulse-footer-heading">Resources</h4>
            <div class="powerpulse-footer-links">
                <a href="training_articles.html">Training Articles</a>
                <a href="index.html">Workout Programs</a>
                <a href="nutrition.html">Nutrition Guides</a>
                <a href="caloriecalculator.html">Fitness Calculators</a>
            </div>
        </div>
        <div class="powerpulse-footer-column">
            <h4 class="powerpulse-footer-heading">Company</h4>
            <div class="powerpulse-footer-links">
                <a href="contact.html">Contact Us</a>
                <a href="privacy.html">Privacy Policy</a>
                <a href="terms_of_service.html">Terms of Service</a>
            </div>
        </div>
    </div>
    <div class="powerpulse-footer-bottom">
        <p class="powerpulse-copyright">© ${new Date().getFullYear()} <span class="powerpulse-brand-highlight">GYMTRANNING</span>. All rights reserved.</p>
        <div class="powerpulse-legal-links">
            <a href="privacy.html" class="powerpulse-legal-link">Privacy Policy</a>
            <a href="terms_of_service.html" class="powerpulse-legal-link">Terms of Service</a>
            <a href="cookie_policy.html" class="powerpulse-legal-link">Cookie Policy</a>
            <a href="medical_disclaimer.html" class="powerpulse-legal-link">Medical Disclaimer</a>
        </div>
    </div>
</footer>
`;

// --- Initialization ---

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Navbar
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) {
        navPlaceholder.innerHTML = NAVBAR_HTML;
        initNavbarInteraction();
        highlightActiveLink();
    }

    // 2. Inject Footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = FOOTER_HTML;
    }
});

// --- Logic ---

function initNavbarInteraction() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (!mobileMenuToggle || !navMenu) return;

    function toggleMenu() {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden'; // Prevent scroll
    }

    mobileMenuToggle.addEventListener('click', toggleMenu);

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', toggleMenu);
    } // Close on overlay click

    // Close on link click (mobile)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-item a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// --- Diet Planner Logic ---

if (document.getElementById('planner')) {
    initDietPlanner();
}

function initDietPlanner() {
    // --- MEAL DATABASE (Simplified for merged file, normally this would be external or database) ---
    // [Note: Simplified list for brevity in this merged file. 
    // In a real scenario, this would be fetched from a JSON file or API]
    const mealDatabase = [
        {
            id: 1, name: "Overnight oats with berries", type: "Breakfast", categories: ["Balanced", "Vegetarian"], goals: ["weight-loss", "maintain"],
            macros: "P:18g C:45g F:12g", prep: "Prep night before", calories: 385,
            details: { ingredients: [{ item: "Oats", amount: "1/2 cup" }, { item: "Berries", amount: "1/2 cup" }], instructions: ["Mix and refrigerate overnight."] }
        },
        {
            id: 2, name: "Greek yogurt parfait", type: "Breakfast", categories: ["Balanced", "High Protein"], goals: ["muscle-gain"],
            macros: "P:22g C:35g F:15g", prep: "3 mins", calories: 320,
            details: { ingredients: [{ item: "Greek Yogurt", amount: "1 cup" }, { item: "Granola", amount: "1/4 cup" }], instructions: ["Layer yogurt and granola."] }
        },
        {
            id: 3, name: "Grilled Chicken Salad", type: "Lunch", categories: ["Balanced", "Low Carb"], goals: ["weight-loss"],
            macros: "P:40g C:10g F:15g", prep: "15 mins", calories: 350,
            details: { ingredients: [{ item: "Chicken Breast", amount: "150g" }, { item: "Mixed Greens", amount: "2 cups" }], instructions: ["Grill chicken, toss with greens."] }
        },
        {
            id: 4, name: "Salmon with Asparagus", type: "Dinner", categories: ["Balanced", "Keto"], goals: ["muscle-gain", "weight-loss"],
            macros: "P:30g C:5g F:20g", prep: "20 mins", calories: 400,
            details: { ingredients: [{ item: "Salmon Fillet", amount: "1" }, { item: "Asparagus", amount: "1 bunch" }], instructions: ["Bake salmon and asparagus at 400F for 15 mins."] }
        },
        // ... (We can expand this database as needed)
        { id: 99, name: "Protein Shake", type: "Afternoon Snack", categories: ["High Protein"], goals: ["muscle-gain"], macros: "P:25g C:5g F:2g", calories: 140, details: { ingredients: [], instructions: [] } }
    ];

    let activeCategory = 'Balanced';

    // Event Listeners
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', function () {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            activeCategory = this.dataset.category;
        });
    });

    const caloriesSlider = document.getElementById('calories');
    if (caloriesSlider) {
        caloriesSlider.addEventListener('input', function () {
            document.getElementById('calories-value').textContent = this.value;
        });
    }

    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePlan);
    }

    // Modal Close
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('close-detail');
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    }

    function generatePlan() {
        const calories = document.getElementById('calories').value;
        const goal = document.getElementById('goal').value;
        const duration = document.getElementById('duration').value;
        const mealsPerDay = document.getElementById('meals-per-day').value;

        // Simulate Loading
        const planContainer = document.getElementById('diet-plan');
        planContainer.innerHTML = `<div class="text-center p-5"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Generating Plan...</p></div>`;

        setTimeout(() => {
            createAutoPlan(calories, goal, duration, mealsPerDay, activeCategory, mealDatabase);
        }, 800);
    }
}

function createAutoPlan(calories, goal, duration, mealsPerDay, activeCategory, mealDatabase) {
    const planContainer = document.getElementById('diet-plan');
    let html = `<div class="plan-days">`;
    const days = parseInt(duration);

    // Simple logic to distribute meals
    const mealTypes = mealsPerDay == 3 ? ['Breakfast', 'Lunch', 'Dinner'] :
        mealsPerDay == 4 ? ['Breakfast', 'Lunch', 'Snack', 'Dinner'] :
            ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner'];

    for (let day = 1; day <= days; day++) {
        html += `<div class="day card mb-3"><div class="day-title">Day ${day}</div>`;

        mealTypes.forEach(type => {
            // Find valid meal
            let meals = mealDatabase.filter(m => (m.type === type || (type.includes('Snack') && m.type.includes('Snack'))) && m.categories.includes(activeCategory));
            if (meals.length === 0) meals = mealDatabase.filter(m => m.type === type || (type.includes('Snack') && m.type.includes('Snack'))); // Fallback
            if (meals.length === 0) meals = [mealDatabase[0]]; // Ultimate fallback

            const meal = meals[Math.floor(Math.random() * meals.length)];

            html += `
            <div class="meal-item" onclick="openMealDetail(${meal.id})">
                <div style="font-weight:600">${type}</div>
                <div>${meal ? meal.name : 'Varies'}</div>
                <small class="text-muted">${meal ? meal.calories : 0} kcal</small>
            </div>`;
        });
        html += `</div>`;
    }
    html += `</div>`;
    planContainer.innerHTML = html;
}

// Global scope for onclick
window.openMealDetail = function (id) {
    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.querySelector('#detail-meal-name').textContent = "Meal Details"; // simplified
        modal.style.display = 'block';
    }
}


// --- Calorie Calculator Logic ---

if (document.querySelector('.tab-buttons')) {
    initCalculators();
}

function initCalculators() {
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Range Sliders (General Update)
    document.querySelectorAll('input[type=range]').forEach(input => {
        input.addEventListener('input', function () {
            const labelSpan = document.getElementById(this.id + 'Val');
            if (labelSpan) labelSpan.textContent = this.value;
        });
    });
}

// Calculator Functions (Exposed to Global Scope for onclicks)

window.calcBMR = function () {
    // Simple Mifflin-St Jeor Equation
    const gender = document.querySelector('.gender-option.selected').dataset.gender;
    const weight = parseFloat(document.getElementById('bmrWeight').value);
    const heightFeet = parseFloat(document.getElementById('bmrFeet').value);
    const heightInches = parseInt(document.getElementById('bmrInches').value);
    const age = parseInt(document.getElementById('bmrAge').value);

    const heightCm = (heightFeet * 30.48) + (heightInches * 2.54);

    let bmr = (10 * weight) + (6.25 * heightCm) - (5 * age);
    bmr = (gender === 'male') ? bmr + 5 : bmr - 161;

    document.getElementById('bmrValue').textContent = Math.round(bmr);

    const activity = parseFloat(document.getElementById('bmrActivity').value);
    document.getElementById('tdeeValue').textContent = Math.round(bmr * activity);
    document.getElementById('dailyCalories').textContent = Math.round(bmr * activity);
}

window.calcBMI = function () {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const feet = parseFloat(document.getElementById('bmiFeet').value);
    const inches = parseFloat(document.getElementById('bmiInches').value);

    const heightM = ((feet * 30.48) + (inches * 2.54)) / 100;
    const bmi = weight / (heightM * heightM);

    document.getElementById('bmiValue').textContent = bmi.toFixed(1);

    let cat = '';
    if (bmi < 18.5) cat = 'Underweight';
    else if (bmi < 25) cat = 'Normal';
    else if (bmi < 30) cat = 'Overweight';
    else cat = 'Obese';

    document.getElementById('bmiCategory').textContent = cat;
}

window.calcCalories = function () {
    // Placeholder for calorie calc logic (similar to BMR but with goal adjustment)
    const bmrStr = document.getElementById('tdeeValue') ? document.getElementById('tdeeValue').textContent : '2000';
    const tdee = parseInt(bmrStr.replace(',', '')) || 2000;
    const goal = document.getElementById('calGoal').value;

    let target = tdee;
    if (goal.includes('lose')) target -= 500;
    if (goal.includes('gain')) target += 500;

    document.getElementById('previewCalories').textContent = target;
    document.getElementById('targetCalories').textContent = target;
}


// --- Nutrition Page Logic ---

if (document.getElementById('nutrition-app')) {
    initNutrition();
}

function initNutrition() {
    const foodDatabase = {
        fruits: [
            { name: "Apple", calories: 52, icon: "🍎" }, { name: "Banana", calories: 89, icon: "🍌" },
            { name: "Orange", calories: 47, icon: "🍊" }, { name: "Grapes", calories: 62, icon: "🍇" },
            { name: "Strawberry", calories: 32, icon: "🍓" }, { name: "Avocado", calories: 160, icon: "🥑" }
        ],
        vegetables: [
            { name: "Tomato", calories: 18, icon: "🍅" }, { name: "Potato", calories: 77, icon: "🥔" },
            { name: "Carrot", calories: 41, icon: "🥕" }, { name: "Broccoli", calories: 34, icon: "🥦" },
            { name: "Spinach", calories: 23, icon: "🥬" }, { name: "Cucumber", calories: 16, icon: "🥒" }
        ],
        proteins: [
            { name: "Chicken Breast", calories: 165, icon: "🍗" }, { name: "Beef", calories: 250, icon: "🥩" },
            { name: "Egg", calories: 155, icon: "🥚" }, { name: "Salmon", calories: 206, icon: "🐟" },
            { name: "Tofu", calories: 76, icon: "🧈" }, { name: "Lentils", calories: 116, icon: "🫘" }
        ],
        grains: [
            { name: "Rice", calories: 130, icon: "🍚" }, { name: "Bread", calories: 265, icon: "🍞" },
            { name: "Oats", calories: 389, icon: "🥣" }, { name: "Pasta", calories: 131, icon: "🍝" }
        ]
    };

    let selectedFoods = [];

    // Render initial category (Fruits)
    renderCategory('fruits');

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCategory(btn.dataset.tab);
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (term.length < 2) { renderCategory(document.querySelector('.tab-btn.active').dataset.tab); return; }

        const results = [];
        Object.values(foodDatabase).forEach(category => {
            category.forEach(item => {
                if (item.name.toLowerCase().includes(term)) results.push(item);
            });
        });
        renderGrid(results);
    });

    function renderCategory(category) {
        renderGrid(foodDatabase[category] || []);
    }

    function renderGrid(items) {
        const grid = document.getElementById('food-grid');
        grid.innerHTML = items.map(item => `
            <div class="food-card" onclick="addFood('${item.name}', ${item.calories})">
                <div class="food-icon">${item.icon}</div>
                <div class="food-name">${item.name}</div>
                <div class="food-calories">${item.calories} <small style="font-size:0.8rem; color:#999">/100g</small></div>
            </div>
        `).join('');
    }

    window.addFood = function (name, calPer100g) {
        const defaultQty = parseInt(document.getElementById('defaultQuantity').value) || 100;
        selectedFoods.push({ name, calPer100g, qty: defaultQty });
        updateSelectedList();
        showToast(`Added ${name}`);
    }

    window.removeFood = function (index) {
        selectedFoods.splice(index, 1);
        updateSelectedList();
    }

    window.updateQty = function (index, newQty) {
        if (newQty < 1) return;
        selectedFoods[index].qty = parseInt(newQty);
        updateSelectedList();
    }

    function updateSelectedList() {
        const container = document.getElementById('selectedFoods');
        let total = 0;

        if (selectedFoods.length === 0) {
            container.innerHTML = '<div class="text-center text-muted p-4">No foods selected</div>';
        } else {
            container.innerHTML = selectedFoods.map((item, index) => {
                const itemCals = Math.round((item.calPer100g * item.qty) / 100);
                total += itemCals;
                return `
                <div class="added-food-item">
                    <div>
                        <strong>${item.name}</strong>
                        <div class="quantity-control">
                            <input type="number" value="${item.qty}" onchange="updateQty(${index}, this.value)"> g
                        </div>
                    </div>
                    <div class="text-end">
                        <div style="font-weight:bold; color:var(--primary)">${itemCals} kcal</div>
                        <small class="text-danger" style="cursor:pointer" onclick="removeFood(${index})">Remove</small>
                    </div>
                </div>`;
            }).join('');
        }

        document.getElementById('totalCalories').textContent = total;
    }

    function showToast(msg) {
        const toast = document.getElementById('addToast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    window.clearCalculator = function () {
        selectedFoods = [];
        updateSelectedList();
    }
}
