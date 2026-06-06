const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white pt-12 pb-6 mt-20'>
      <div className='max-w-7xl mx-auto px-6'>

        {/* Top Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gray-700'>

          {/* Brand */}
          <div>
            <h2 className='text-2xl font-bold'>
              Recipe<span className='text-red-600'>Nest</span>
            </h2>
            <p className='mt-3 text-gray-400 text-sm leading-relaxed'>
              Discover delicious recipes from around the world
              and enjoy cooking with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-gray-400 text-sm'>
              <li><a href='/' className='hover:text-white transition'>Home</a></li>
              <li><a href='/recipe' className='hover:text-white transition'>Recipes</a></li>
            
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Categories</h3>
            <ul className='space-y-2 text-gray-400 text-sm'>
              <li><a href='#' className='hover:text-white transition'>Breakfast</a></li>
              <li><a href='#' className='hover:text-white transition'>Lunch</a></li>
              <li><a href='#' className='hover:text-white transition'>Dinner</a></li>
              <li><a href='#' className='hover:text-white transition'>Desserts</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className='flex flex-col md:flex-row items-center justify-between pt-6 text-gray-500 text-sm gap-3'>
          <p>© {new Date().getFullYear()} RecipeNest. All rights reserved.</p>
          <div className='flex gap-5'>
            <a href='#' className='hover:text-white transition'>Privacy Policy</a>
            <a href='#' className='hover:text-white transition'>Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer