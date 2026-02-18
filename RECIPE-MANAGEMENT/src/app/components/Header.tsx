import { motion } from "motion/react";
import { User, LogOut, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  user: { name: string; accessToken: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

export function Header({
  user,
  onSignIn,
  onSignOut,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="bg-white shadow-sm sticky top-0 z-40 backdrop-blur-lg bg-white/95"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">🍽️</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            FoodieFind
          </span>
        </motion.div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  onClick={onToggleFavorites}
                  className={`flex items-center gap-2 rounded-full ${
                    showFavoritesOnly
                      ? "bg-gradient-to-r from-orange-500 to-pink-500"
                      : ""
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      showFavoritesOnly ? "fill-white" : ""
                    }`}
                  />
                  <span>
                    Favorites {favoritesCount > 0 && `(${favoritesCount})`}
                  </span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {user.name}
                  </span>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={onSignOut}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}

          {!user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onSignIn}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-full px-6"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
