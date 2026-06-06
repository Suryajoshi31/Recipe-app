import { useState } from "react";
import { useAuth } from "../context/AuthContextHelper";
import RecipeCard from "../Components/RecipeCard";
import { recipes as staticRecipes } from "../data/recipes";

const CATEGORIES = ["Nepali", "Indian", "Chinese", "Asian", "Healthy", "Italian", "Mexican", "Other"];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "Nepali",
  time: "",
  servings: "",
  image: "",
};

export default function Profile() {
  const { userName, userEmail, favorites, customRecipes, addCustomRecipe, deleteCustomRecipe } = useAuth();
  const [activeTab, setActiveTab] = useState("favorites");
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Get favorited recipe objects from both static and custom
  const allRecipes = [...customRecipes, ...staticRecipes];
  const favoritedRecipes = allRecipes.filter((r) => favorites.includes(r.id));

  // Avatar initials
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
    setSuccessMsg("");
  };

  const handleAddRecipe = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.time || !form.servings) {
      setFormError("Please fill in all required fields.");
      return;
    }
    addCustomRecipe({
      title: form.title,
      description: form.description,
      category: form.category,
      time: form.time,
      servings: Number(form.servings),
      image: form.image || "",
    });
    setForm(INITIAL_FORM);
    setSuccessMsg("🎉 Recipe added successfully! It's now live in the Recipes page.");
    setActiveTab("myrecipes");
  };

  const tabs = [
    { id: "favorites", label: " Favorites", count: favoritedRecipes.length },
    { id: "myrecipes", label: " My Recipes", count: customRecipes.length },
    { id: "create", label: "➕ Create Recipe", count: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-orange-50/20 to-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg select-none">
              {initials}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-green-400 border-2 border-white rounded-full w-5 h-5" title="Online" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              <span className="text-orange-600">{userName}</span>
            </h1>
            {userEmail && (
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                {userEmail}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-2 font-medium italic">Passionate about cooking and sharing flavors from around the world.</p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 md:ml-auto flex-shrink-0">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-orange-500">{customRecipes.length}</p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Recipes</p>
            </div>
            <div className="w-px bg-gray-100 h-10 self-center" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-red-500">{favoritedRecipes.length}</p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Favorites</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB: Favorites ── */}
        {activeTab === "favorites" && (
          <div>
            {favoritedRecipes.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Saved Favorites
                    <span className="ml-2 text-sm font-normal text-gray-400">({favoritedRecipes.length} recipes)</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {favoritedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} {...recipe} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-6xl select-none">💔</span>
                <h3 className="text-xl font-bold text-gray-800 mt-5">No Favorites Yet</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">
                  Tap the heart ❤️ icon on any recipe card to save it here for quick access.
                </p>
                <button
                  onClick={() => window.location.href = "/recipe"}
                  className="mt-6 bg-orange-400 hover:bg-orange-500 transition text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm shadow-sm hover:shadow"
                >
                  Browse Recipes
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: My Recipes ── */}
        {activeTab === "myrecipes" && (
          <div>
            {customRecipes.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Created Recipes
                    <span className="ml-2 text-sm font-normal text-gray-400">({customRecipes.length} recipes)</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="text-sm bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition cursor-pointer shadow-sm"
                  >
                    + Add Recipe
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {customRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} {...recipe} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-6xl select-none">🍳</span>
                <h3 className="text-xl font-bold text-gray-800 mt-5">No Recipes Added Yet</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">
                  Share your culinary creativity with the world! Create your first recipe.
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-6 bg-orange-400 hover:bg-orange-500 transition text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm shadow-sm hover:shadow"
                >
                  Create First Recipe
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Create Recipe ── */}
        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6">
                <h2 className="text-xl font-bold text-white"> Create a New Recipe</h2>
                <p className="text-orange-100 text-sm mt-1">Share your delicious creation with the community</p>
              </div>

              {/* Success message */}
              {successMsg && (
                <div className="mx-6 mt-5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                  {successMsg}
                </div>
              )}

              {/* Error message */}
              {formError && (
                <div className="mx-6 mt-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleAddRecipe} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Recipe Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Mom's Special Dal Bhat"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition text-gray-800 text-sm bg-gray-50/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Describe your dish – what makes it special, its flavors, origin..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition text-gray-800 text-sm bg-gray-50/50 resize-none"
                  />
                </div>

                {/* Category + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition text-gray-800 text-sm bg-gray-50/50 cursor-pointer appearance-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Cook Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={form.time}
                      onChange={handleFormChange}
                      placeholder="e.g. 30 min"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition text-gray-800 text-sm bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Servings + Image URL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Servings <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="servings"
                      value={form.servings}
                      onChange={handleFormChange}
                      placeholder="e.g. 4"
                      min={1}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition text-gray-800 text-sm bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Image URL <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={form.image}
                      onChange={handleFormChange}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition text-gray-800 text-sm bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {form.image && (
                  <div className="rounded-xl overflow-hidden border border-orange-100 bg-gray-50">
                    <img
                      src={form.image}
                      alt="Recipe Preview"
                      className="w-full h-44 object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <p className="text-center text-xs text-gray-400 py-2 font-medium">Image Preview</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer transform hover:-translate-y-0.5 text-sm"
                >
                   Publish Recipe
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
