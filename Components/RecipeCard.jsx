import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContextHelper";

const RecipeCard = ({ id, image, title, description, category, time, servings, rating, isUserAdded }) => {
  const { isAuthenticated, favorites, toggleFavorite, deleteCustomRecipe } = useAuth();
  const isFavorited = favorites.includes(id);

  return (
    <div className='bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-orange-300 hover:shadow-md transition duration-300 relative group flex flex-col h-full'>

      {/* Image container with scale effect and absolute buttons */}
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=600"}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />

        {/* Favorite heart icon */}
        {isAuthenticated && (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(id);
            }}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-md transition duration-200 cursor-pointer text-red-500 active:scale-90 z-10"
            title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          >
            {isFavorited ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
        )}

        {/* Custom recipe tag */}
        {isUserAdded && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md z-10">
            My Recipe
          </span>
        )}
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-grow'>

        {/* Category + Rating */}
        <div className='flex justify-between items-center mb-2'>
          <span className='bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full'>
            {category}
          </span>
          <span className='text-orange-400 text-sm font-semibold'>★ {rating}</span>
        </div>

        {/* Title */}
        <h3 className='text-lg font-bold text-gray-800 mb-1 line-clamp-1'>{title}</h3>

        {/* Description */}
        <p className='text-gray-500 text-sm mb-3 line-clamp-2 flex-grow'>{description}</p>

        {/* Time & Servings */}
        <div className='flex items-center gap-4 text-gray-400 text-sm mb-4 font-medium'>
          <span>⏱ {time}</span>
          <span>👤 {servings} servings</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link 
            to={`/recipe/${id}`} 
            className='w-full bg-orange-400 hover:bg-orange-500 transition text-white font-semibold py-2 rounded-lg cursor-pointer text-sm text-center block'
          >
            View Recipe
          </Link>
          {isUserAdded && (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this recipe?")) {
                  deleteCustomRecipe(id);
                }
              }}
              className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 p-2 rounded-lg transition cursor-pointer flex items-center justify-center flex-shrink-0"
              title="Delete Recipe"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default RecipeCard;