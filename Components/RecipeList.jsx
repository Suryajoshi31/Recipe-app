import RecipeCard from './RecipeCard'
import { recipes } from '../data/recipes'

const RecipeList = () => {
  return (
    <section className='max-w-7xl mx-auto px-6 py-16'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8'>All Recipes</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))}
      </div>
    </section>
  )
}

export default RecipeList