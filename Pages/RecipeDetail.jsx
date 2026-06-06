import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMealById } from "../api/mealdb";
import { recipes } from "../data/recipes";
import { useAuth } from "../context/AuthContextHelper";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customRecipes, isAuthenticated, favorites, toggleFavorite } =
    useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      setError(null);

      try {
        // Check if it's an API recipe
        if (id.startsWith("api-")) {
          const mealId = id.replace("api-", "");
          const data = await getMealById(mealId);
          if (data) {
            setRecipe(data);
          } else {
            setError("Recipe not found.");
          }
        } else {
          // Search in local + custom recipes
          const numId = Number(id);
          const allLocal = [...customRecipes, ...recipes];
          const found = allLocal.find((r) => r.id === numId || r.id === id);
          if (found) {
            setRecipe(found);
          } else {
            setError("Recipe not found.");
          }
        }
      } catch (err) {
        console.error("Failed to load recipe:", err);
        setError("Something went wrong while loading the recipe.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id, customRecipes]);

  const isFavorited = recipe ? favorites.includes(recipe.id) : false;

  // Split instructions into steps
  const getSteps = () => {
    const text = recipe?.fullInstructions || recipe?.description || "";
    if (!text) return [];
    // Split by line breaks or by numbered steps
    return text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/30 pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-gray-200 rounded-lg" />
            <div className="h-80 bg-gray-200 rounded-2xl" />
            <div className="h-10 w-2/3 bg-gray-200 rounded-lg" />
            <div className="flex gap-4">
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-2xl" />
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-amber-50/30 pt-24 pb-16 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl border border-gray-200 p-12 shadow-sm max-w-md">
          <span className="text-6xl">🍽️</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {error || "Recipe not found"}
          </h2>
          <p className="text-gray-500 mt-2">
            The recipe you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={() => navigate("/recipe")}
            className="mt-6 bg-orange-400 hover:bg-orange-500 transition text-white px-6 py-2.5 rounded-xl font-semibold cursor-pointer"
          >
            ← Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const steps = getSteps();
  const ingredients = recipe.ingredients || [];

  return (
    <div className="min-h-screen bg-amber-50/30 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/recipe")}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-medium mb-6 transition cursor-pointer group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Recipes
        </button>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8 group">
          <img
            src={
              recipe.image ||
              "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1200"
            }
            alt={recipe.title}
            className="w-full h-72 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Floating info on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {recipe.category && (
                <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
              )}
              {recipe.area && recipe.area !== recipe.category && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  📍 {recipe.area}
                </span>
              )}
              {recipe.isUserAdded && (
                <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  My Recipe
                </span>
              )}
              {recipe.isFromAPI && (
                <span className="bg-blue-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  TheMealDB
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {recipe.title}
            </h1>
          </div>

          {/* Favorite Button */}
          {isAuthenticated && (
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg transition duration-200 cursor-pointer text-red-500 active:scale-90 z-10"
              title={
                isFavorited ? "Remove from Favorites" : "Add to Favorites"
              }
            >
              {isFavorited ? (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Quick Info Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          {recipe.time && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
              <span className="text-lg">⏱</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Cook Time</p>
                <p className="text-sm font-bold text-gray-800">
                  {recipe.time}
                </p>
              </div>
            </div>
          )}
          {recipe.servings > 0 && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
              <span className="text-lg">👤</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Servings</p>
                <p className="text-sm font-bold text-gray-800">
                  {recipe.servings} people
                </p>
              </div>
            </div>
          )}
          {recipe.rating > 0 && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
              <span className="text-lg">⭐</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Rating</p>
                <p className="text-sm font-bold text-gray-800">
                  {recipe.rating} / 5
                </p>
              </div>
            </div>
          )}
          {recipe.tags && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
              <span className="text-lg">🏷️</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Tags</p>
                <p className="text-sm font-bold text-gray-800">
                  {recipe.tags}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Ingredients */}
          {ingredients.length > 0 && (
            <div className="md:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </span>
                <h2 className="text-xl font-bold text-gray-800">
                  Ingredients
                </h2>
                <span className="ml-auto text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-1 rounded-full">
                  {ingredients.length} items
                </span>
              </div>
              <ul className="space-y-2">
                {ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          <div
            className={`${
              ingredients.length > 0 ? "md:col-span-2" : "md:col-span-3"
            } bg-white rounded-2xl border border-gray-200 p-6 shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
              <h2 className="text-xl font-bold text-gray-800">
                Instructions
              </h2>
            </div>

            {steps.length > 0 ? (
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed pt-1.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <span className="text-4xl">📝</span>
                <p className="mt-2 font-medium">
                  No detailed instructions available for this recipe.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* YouTube & Source Links */}
        {(recipe.youtube || recipe.source) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-red-100 text-red-500 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                </svg>
              </span>
              Learn More
            </h2>
            <div className="flex flex-wrap gap-3">
              {recipe.youtube && (
                <a
                  href={recipe.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer text-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                  </svg>
                  Watch on YouTube
                </a>
              )}
              {recipe.source && (
                <a
                  href={recipe.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer text-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Original Source
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
