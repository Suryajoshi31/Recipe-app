import { createBrowserRouter, RouterProvider, Navigate, Outlet, useNavigation } from "react-router-dom";
import Navbar from './Components/Navbar'

import Home from "./Pages/Home";
import Recipe from "./Pages/Recipe";
import Profile from "./Pages/Profile";
import RecipeDetails from "./Pages/RecipeDetails";
import Footer from './Components/Footer';
import Login from './Pages/Login';
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContextHelper";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Global Layout component to include Navbar, Footer, and the Loading Screen
function Layout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Loading Screen Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-orange-600 font-semibold text-lg animate-pulse">Loading...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

// Function to simulate a network delay so you can see the loading screen
const delayLoader = async () => {
  await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay
  return null;
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { 
        path: "login", 
        element: <Login />,
        loader: delayLoader // Added delay to demonstrate the loading screen
      },
      { 
        index: true, 
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        loader: delayLoader
      },
      { 
        path: "recipe", 
        element: (
          <ProtectedRoute>
            <Recipe />
          </ProtectedRoute>
        ),
        loader: delayLoader
      },
      {
        path: "recipe/:id",
        element: (
          <ProtectedRoute>
            <RecipeDetails />
          </ProtectedRoute>
        ),
        loader: delayLoader
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        loader: delayLoader
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
