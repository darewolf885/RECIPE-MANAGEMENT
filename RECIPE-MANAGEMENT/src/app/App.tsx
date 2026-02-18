import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, TrendingUp, ChefHat } from "lucide-react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { SearchBar } from "./components/SearchBar";
import { FilterButtons } from "./components/FilterButtons";
import { SortDropdown } from "./components/SortDropdown";
import { RestaurantCard } from "./components/RestaurantCard";
import { RestaurantCardSkeleton } from "./components/RestaurantCardSkeleton";
import { AuthModal } from "./components/AuthModal";
import { supabase, API_URL } from "./lib/supabase";
import { publicAnonKey } from "/utils/supabase/info";
import { toast, Toaster } from "sonner";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  waitTime: number;
  prepTime: number;
  image: string;
  description: string;
  isOpen: boolean;
}

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<{ name: string; accessToken: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
    loadRestaurants();
  }, []);

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token && data?.session?.user?.user_metadata?.name) {
        setUser({
          accessToken: data.session.access_token,
          name: data.session.user.user_metadata.name,
        });
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/restaurants`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.restaurants && data.restaurants.length > 0) {
        setRestaurants(data.restaurants);
        setDataInitialized(true);
      } else {
        // Initialize data if not exists
        await initializeData();
      }
    } catch (error) {
      console.error("Load restaurants error:", error);
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      const response = await fetch(`${API_URL}/restaurants/init`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        await loadRestaurants();
        toast.success("Restaurant data initialized!");
      }
    } catch (error) {
      console.error("Initialize data error:", error);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Load favorites error:", error);
    }
  };

  const toggleFavorite = async (restaurantId: string) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      setShowAuthModal(true);
      return;
    }

    try {
      const isFavorite = favorites.includes(restaurantId);

      if (isFavorite) {
        const response = await fetch(`${API_URL}/favorites/${restaurantId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFavorites(data.favorites);
          toast.success("Removed from favorites");
        }
      } else {
        const response = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({ restaurantId }),
        });

        const data = await response.json();

        if (response.ok) {
          setFavorites(data.favorites);
          toast.success("Added to favorites");
        }
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setFavorites([]);
    setShowFavoritesOnly(false);
    toast.success("Signed out successfully");
  };

  // Filter and sort logic
  const cuisines = ["All", ...Array.from(new Set(restaurants.map((r) => r.cuisine)))];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;

    const matchesFavorites = !showFavoritesOnly || favorites.includes(restaurant.id);

    return matchesSearch && matchesCuisine && matchesFavorites;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "waitTime":
        return a.waitTime - b.waitTime;
      case "prepTime":
        return a.prepTime - b.prepTime;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full blur-3xl opacity-30 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full blur-3xl opacity-30 pointer-events-none"
      />

      <Toaster position="top-center" richColors />

      <Header
        user={user}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        favoritesCount={favorites.length}
      />

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 pb-20 relative z-10">
        <div className="mb-16">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <FilterButtons
            cuisines={cuisines}
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
          />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Results count with animation */}
        {!loading && sortedRestaurants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-5 h-5 text-orange-500" />
            </motion.div>
            <span className="text-lg font-semibold text-gray-700">
              Found{" "}
              <motion.span
                key={sortedRestaurants.length}
                initial={{ scale: 1.5, color: "#f97316" }}
                animate={{ scale: 1, color: "#374151" }}
                className="font-bold"
              >
                {sortedRestaurants.length}
              </motion.span>{" "}
              amazing {sortedRestaurants.length === 1 ? "restaurant" : "restaurants"}
            </span>
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <ChefHat className="w-5 h-5 text-pink-500" />
            </motion.div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[...Array(6)].map((_, index) => (
                <RestaurantCardSkeleton key={index} index={index} />
              ))}
            </motion.div>
          ) : sortedRestaurants.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="inline-block mb-6"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <TrendingUp className="w-16 h-16 text-gray-400" />
                  </motion.div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {showFavoritesOnly
                  ? "No favorite restaurants yet"
                  : "No restaurants found"}
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                {showFavoritesOnly
                  ? "Start exploring and add your favorite restaurants!"
                  : "Try adjusting your search or filters to find more options"}
              </p>
              {showFavoritesOnly && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFavoritesOnly(false)}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow-lg"
                >
                  Browse All Restaurants
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {sortedRestaurants.map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isFavorite={favorites.includes(restaurant.id)}
                    onToggleFavorite={toggleFavorite}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to top button */}
        {!loading && sortedRestaurants.length > 6 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-30 p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-2xl"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              ↑
            </motion.div>
          </motion.button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(accessToken, userName) => {
          setUser({ accessToken, name: userName });
          toast.success(`Welcome, ${userName}!`);
        }}
      />

      {/* Footer with animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-20 py-12 border-t border-gray-200 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-block mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          </motion.div>
          <p className="text-gray-600 font-medium">
            Made with ❤️ for food lovers everywhere
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2026 FoodieFind. Discover amazing restaurants.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}