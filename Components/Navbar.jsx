import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextHelper";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, userName, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/recipe", name: "Recipes" },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white text-black top-0 left-0 w-full shadow-md fixed z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold tracking-tight"
          >
            Recipe
            <span className="text-red-600">Nest</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 text-lg font-medium">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `transition hover:text-red-500 ${
                        isActive ? "text-red-600 font-semibold" : "text-gray-600"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `transition hover:text-red-500 ${
                        isActive ? "text-red-600 font-semibold" : "text-gray-600"
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              )}
            </ul>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
               
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm hover:shadow transition duration-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-5 py-2 rounded-xl shadow-sm hover:shadow transition duration-200 cursor-pointer"
              >
                Sign In
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 shadow-inner">
          <ul className="flex flex-col items-center gap-5 text-lg font-medium">
            {isAuthenticated && (
              <li className="text-gray-500 text-sm font-semibold py-1">
                Hi, Chef <span className="text-orange-600">{userName}</span>
              </li>
            )}
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `transition hover:text-red-500 ${
                      isActive ? "text-red-600 font-semibold" : "text-gray-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `transition hover:text-red-500 ${
                      isActive ? "text-red-600 font-semibold" : "text-gray-600"
                    }`
                  }
                >
                  Profile
                </NavLink>
              </li>
            )}
            <li className="w-full px-8 mt-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-2.5 rounded-xl shadow-md transition"
                >
                  Sign In
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;