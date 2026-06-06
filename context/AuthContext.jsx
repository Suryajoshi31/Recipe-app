import { useState } from "react";
import { AuthContext } from "./AuthContextHelper";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "Chef Guest"
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userFavorites")) || [];
    } catch {
      return [];
    }
  });
  const [customRecipes, setCustomRecipes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userRecipes")) || [];
    } catch {
      return [];
    }
  });

  const login = (name, email) => {
    const finalName = name || "Chef Guest";
    const finalEmail = email || "";
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", finalName);
    localStorage.setItem("userEmail", finalEmail);
    setIsAuthenticated(true);
    setUserName(finalName);
    setUserEmail(finalEmail);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserName("Chef Guest");
    setUserEmail("");
  };

  const toggleFavorite = (recipeId) => {
    setFavorites((prev) => {
      const updated = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      localStorage.setItem("userFavorites", JSON.stringify(updated));
      return updated;
    });
  };

  const addCustomRecipe = (recipeData) => {
    const newRecipe = {
      id: Date.now(),
      rating: 4.8,
      ...recipeData,
      isUserAdded: true,
    };
    setCustomRecipes((prev) => {
      const updated = [newRecipe, ...prev];
      localStorage.setItem("userRecipes", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCustomRecipe = (recipeId) => {
    setCustomRecipes((prev) => {
      const updated = prev.filter((r) => r.id !== recipeId);
      localStorage.setItem("userRecipes", JSON.stringify(updated));
      return updated;
    });
    // Also clean from favorites if present
    setFavorites((prev) => {
      if (prev.includes(recipeId)) {
        const updated = prev.filter((id) => id !== recipeId);
        localStorage.setItem("userFavorites", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        userEmail,
        favorites,
        customRecipes,
        login,
        logout,
        toggleFavorite,
        addCustomRecipe,
        deleteCustomRecipe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
