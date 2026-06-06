const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

/**
 * Search meals by name from TheMealDB API
 * @param {string} query - search term (e.g. "chicken", "pasta")
 * @returns {Promise<Array>} - array of meals mapped to app format
 */
export async function searchMeals(query = "") {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!data.meals) return [];
  return data.meals.map(mapMealToRecipe);
}

/**
 * Fetch a single meal by ID
 * @param {string} id - TheMealDB meal ID
 * @returns {Promise<Object|null>}
 */
export async function getMealById(id) {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  if (!data.meals || data.meals.length === 0) return null;
  return mapMealToRecipe(data.meals[0]);
}

/**
 * Fetch meals by category (e.g. "Seafood", "Vegetarian")
 * @param {string} category
 * @returns {Promise<Array>}
 */
export async function getMealsByCategory(category) {
  const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  const data = await res.json();
  if (!data.meals) return [];
  return data.meals.map((m) => ({
    id: `api-${m.idMeal}`,
    title: m.strMeal,
    image: m.strMealThumb,
    category,
    description: "",
    time: "",
    servings: 0,
    rating: 0,
    isFromAPI: true,
  }));
}

/**
 * Fetch all available categories
 * @returns {Promise<string[]>}
 */
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  if (!data.categories) return [];
  return data.categories.map((c) => c.strCategory);
}

/**
 * Extract ingredients list from a raw MealDB meal object
 */
function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim());
    }
  }
  return ingredients;
}

/**
 * Map TheMealDB response to match our app's recipe card format
 */
function mapMealToRecipe(meal) {
  const ingredients = extractIngredients(meal);
  return {
    id: `api-${meal.idMeal}`,
    title: meal.strMeal,
    description: meal.strInstructions
      ? meal.strInstructions.substring(0, 120) + "..."
      : "A delicious recipe from TheMealDB.",
    category: meal.strCategory || meal.strArea || "Other",
    time: "30 min",
    servings: 4,
    rating: 4.5,
    image: meal.strMealThumb,
    isFromAPI: true,
    // Extra fields for detail view
    fullInstructions: meal.strInstructions,
    ingredients,
    area: meal.strArea,
    tags: meal.strTags,
    youtube: meal.strYoutube,
    source: meal.strSource,
  };
}
