import { Link } from "react-router-dom";
import Foodimage from "../assets/Foodimg.jpg";

const Hero = () => {
  return (
    <section className="bg-white min-h-[70vh] flex items-center pt-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Row 1: Intro text + Image */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="py-20">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              What Are We About
            </h1>
            <p className="mt-6 text-gray-600 text-lg max-w-xl">
              RecipeNest is a place where you can please your soul and tummy
              with delicious food recipes of all cuisines. And our service is
              absolutely free. So start exploring now.
            </p>
            <Link
              to="/recipe"
              className="inline-block mt-8 bg-orange-400 hover:bg-orange-500 text-white transition px-6 py-3 rounded-lg font-semibold cursor-pointer text-center"
            >
              EXPLORE NOW
            </Link>
          </div>

          <div>
            <img
              src={Foodimage}
              alt="Food"
              className="w-full max-w-[500px] h-[300px] rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Row 2: Skills + Quote */}
        <div className="grid md:grid-cols-2 gap-10 items-center mt-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Improve Your Culinary Skills
            </h2>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">
              <li>Learn new recipes</li>
              <li>Experiment with food</li>
              <li>Know nutrition facts</li>
              <li>Get cooking tips</li>
              <li>Get ranked</li>
            </ul>
           
          </div>

          <div>
            <blockquote className="italic text-gray-500 border-l-4 border-orange-400 pl-4 text-lg">
              "Food is everything we are. It's an extension of nationalist
              feeling, ethnic feeling, your personal history, your province,
              your region, your tribe, your grandma. It's inseparable from
              those things from the get-go."
            </blockquote>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;