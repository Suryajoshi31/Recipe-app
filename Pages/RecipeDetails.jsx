import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recipes as localRecipes } from "../data/recipes";
import { useAuth } from "../context/AuthContextHelper";
import { getMealById } from "../api/mealdb";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customRecipes } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipeDetails() {
      setLoading(true);
      setError(null);
      
      try {
        if (id.startsWith("api-")) {
          // Fetch from API
          const apiId = id.replace("api-", "");
          const apiRecipe = await getMealById(apiId);
          if (apiRecipe) {
            setRecipe(apiRecipe);
          } else {
            setError("Recipe not found online.");
          }
        } else {
          // Search in local recipes and custom recipes
          // local recipes have integer IDs, custom have timestamp (number) IDs. 
          // useParams returns a string.
          const numericId = parseInt(id, 10);
          
          let foundRecipe = localRecipes.find((r) => r.id === numericId);
          
          if (!foundRecipe) {
            foundRecipe = customRecipes.find((r) => r.id === numericId);
          }
          
          if (foundRecipe) {
            setRecipe(foundRecipe);
          } else {
            setError("Recipe not found in local database.");
          }
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading the recipe details.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipeDetails();
  }, [id, customRecipes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-orange-600 font-semibold text-lg animate-pulse">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-amber-50/30 pt-24 pb-16 px-4 flex flex-col items-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <span className="text-5xl mb-4 block" role="img" aria-label="sad face">😕</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-500 mb-6">{error || "Recipe not found."}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper to format instructions if they are just a long string
  const formatInstructions = (instructions) => {
    if (!instructions) return <p className="text-gray-500 italic">No instructions provided.</p>;
    
    // Split by newlines. Filter out empty lines.
    const steps = instructions.split('\n').filter(step => step.trim() !== '');
    
    return (
      <ol className="space-y-4 list-decimal list-inside text-gray-700 leading-relaxed">
        {steps.map((step, index) => {
          // If step already starts with a number (e.g. "1. "), we can just render it. 
          // Or we can clean it up. For simplicity, just render the text.
          let text = step.trim();
          // Optional: strip leading numbers if we are using <ol>
          text = text.replace(/^\d+[\.\)]\s*/, '');
          
          return (
            <li key={index} className="pl-2">
              <span className="text-gray-800">{text}</span>
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <div className="min-h-screen bg-amber-50/30 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Header Image */}
        <div className="h-64 sm:h-80 md:h-96 relative bg-gray-200">
          <img 
            src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1000"} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full shadow transition text-gray-800 cursor-pointer"
            title="Go Back"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10">
          
          {/* Title & Meta Info */}
          <div className="mb-8 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {recipe.category}
              </span>
              {recipe.area && (
                <span className="bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {recipe.area}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{recipe.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium bg-gray-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱</span> 
                <span>{recipe.time || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">👤</span> 
                <span>{recipe.servings || "N/A"} servings</span>
              </div>
              <div className="flex items-center gap-2 text-orange-500">
                <span className="text-xl">★</span> 
                <span>{recipe.rating || "N/A"}</span>
              </div>
              {recipe.isUserAdded && (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-xl">👨‍🍳</span>
                  <span>My Recipe</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Ingredients Column */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🛒</span> Ingredients
              </h2>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                      <div className="w-2 h-2 mt-2 rounded-full bg-orange-400 flex-shrink-0" />
                      <span className="text-gray-700">{ing}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                  No ingredients listed.
                </p>
              )}
            </div>

            {/* Instructions Column */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>👩‍🍳</span> Instructions
              </h2>
              <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
                {formatInstructions(recipe.fullInstructions)}
              </div>
              
              {/* Optional Video Link */}
              {recipe.youtube && (
                <div className="mt-8">
                  <a 
                    href={recipe.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-5 py-3 rounded-xl transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Watch Video Tutorial
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
