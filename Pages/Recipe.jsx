import { useState, useEffect, useCallback } from "react";
import RecipeCard from "../Components/RecipeCard";
import { recipes } from "../data/recipes";
import { useAuth } from "../context/AuthContextHelper";
import { searchMeals } from "../api/mealdb";

export default function Recipe() {
  const { customRecipes } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [apiRecipes, setApiRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const RECIPES_PER_PAGE = 8;

  // Debounced API search
  const fetchFromAPI = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMeals(query);
      setApiRecipes(results);
    } catch (err) {
      console.error("Failed to fetch from TheMealDB:", err);
      setError("Could not load online recipes. Showing local recipes only.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch default recipes on mount
  useEffect(() => {
    fetchFromAPI("");
  }, [fetchFromAPI]);

  // Debounce the search input for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFromAPI(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchFromAPI]);

  // Combine all recipe sources: custom + local + API
  const allRecipes = [...customRecipes, ...recipes, ...apiRecipes];

  // Extract unique categories from all recipes
  const categories = ["All", ...new Set(allRecipes.map((r) => r.category))];

  // Reset visible count when search or category changes
  useEffect(() => {
    setVisibleCount(8);
  }, [search, selectedCategory]);

  // Filter recipes based on search text and category
  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Only show up to visibleCount recipes
  const visibleRecipes = filteredRecipes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRecipes.length;

  return (
    <div className="min-h-screen bg-amber-50/30 pt-24 pb-16 px-4 md:px-8">
      {/* Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold tracking-wider text-orange-600 uppercase bg-orange-100/60 px-3 py-1 rounded-full">
            Taste the Magic
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 tracking-tight">
            Our Culinary Collection
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Discover and search from your favorite dishes — powered by{" "}
            <a
              href="https://www.themealdb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 font-semibold hover:underline"
            >
              TheMealDB
            </a>{" "}
            + your own recipes.
          </p>
        </div>

        {/* Controls Section (Search + Category Filter) */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search recipes (e.g. chicken, pasta, arrabiata)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition duration-200 text-gray-800 bg-gray-50/50"
            />
            {loading && (
              <span className="absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-orange-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </span>
            )}
          </div>

          {/* Categories Tab Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin scrollbar-thumb-orange-100">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-gray-100 hover:bg-gray-250 text-gray-600 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && apiRecipes.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  <div className="h-9 w-full bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecipes.length > 0 ? (
          <>
            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + RECIPES_PER_PAGE)}
                  className="group flex items-center gap-2 bg-white border-2 border-orange-300 hover:border-orange-500 text-orange-600 hover:text-white hover:bg-orange-500 px-8 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>Load More</span>
                  <span className="text-sm opacity-70">({filteredRecipes.length - visibleCount} remaining)</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl shadow-sm">
            <span className="text-5xl" role="img" aria-label="sad face">
              😕
            </span>
            <h3 className="text-xl font-bold text-gray-800 mt-4">
              No Recipes Found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto px-4">
              We couldn't find anything matching "<strong>{search}</strong>" in the{" "}
              <strong>{selectedCategory}</strong> category. Try checking your spelling or adjusting filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-6 bg-orange-400 hover:bg-orange-500 transition text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer shadow-sm hover:shadow"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Status Count */}
        <p className="text-center text-gray-400 text-sm mt-12 font-medium">
          Showing {visibleRecipes.length} of {filteredRecipes.length} recipes
          {apiRecipes.length > 0 && (
            <span className="ml-1">
              ({apiRecipes.length} from TheMealDB)
            </span>
          )}
        </p>
      </div>
    </div>
  );
}