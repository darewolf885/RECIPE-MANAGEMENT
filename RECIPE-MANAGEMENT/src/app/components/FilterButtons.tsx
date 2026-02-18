import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Utensils, Sparkles } from "lucide-react";

interface FilterButtonsProps {
  cuisines: string[];
  selectedCuisine: string;
  onSelectCuisine: (cuisine: string) => void;
}

export function FilterButtons({ cuisines, selectedCuisine, onSelectCuisine }: FilterButtonsProps) {
  // Cuisine emoji mapping
  const cuisineEmojis: { [key: string]: string } = {
    All: "🌍",
    Italian: "🍝",
    Japanese: "🍱",
    Indian: "🍛",
    French: "🥐",
    Chinese: "🥢",
    Mexican: "🌮",
    Thai: "🍜",
    American: "🍔",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      {/* Background decoration */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="absolute -inset-4 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 rounded-3xl blur-2xl opacity-30 -z-10"
      />

      <div className="flex flex-wrap gap-3 justify-center items-center p-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mr-2"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Utensils className="w-5 h-5 text-gray-600" />
          </motion.div>
          <span className="text-sm font-semibold text-gray-700">Filter by:</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {cuisines.map((cuisine, index) => {
            const isSelected = selectedCuisine === cuisine;
            
            return (
              <motion.div
                key={cuisine}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Glow effect for selected button */}
                {isSelected && (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-lg"
                    />
                    
                    {/* Rotating particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 0.5,
                        }}
                        className="absolute inset-0"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                          className="absolute -top-1 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
                          style={{
                            transformOrigin: "0 20px",
                            rotate: `${i * 60}deg`,
                          }}
                        />
                      </motion.div>
                    ))}
                  </>
                )}

                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onSelectCuisine(cuisine)}
                  className={`relative rounded-full px-5 py-2 font-semibold transition-all duration-300 overflow-hidden group ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-xl border-0"
                      : "bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 shadow-md"
                  }`}
                >
                  {/* Shimmer effect on hover */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6 }}
                    className={`absolute inset-0 w-1/2 bg-gradient-to-r from-transparent ${
                      isSelected ? "via-white/30" : "via-orange-200/50"
                    } to-transparent skew-x-12`}
                  />

                  <span className="relative z-10 flex items-center gap-2">
                    <motion.span
                      animate={isSelected ? {
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{
                        duration: 0.5,
                        repeat: isSelected ? Infinity : 0,
                        repeatDelay: 2,
                      }}
                      className="text-lg"
                    >
                      {cuisineEmojis[cuisine] || "🍽️"}
                    </motion.span>
                    {cuisine}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.div>
                    )}
                  </span>

                  {/* Pulse effect for selected */}
                  {isSelected && (
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20"
                    />
                  )}
                </Button>

                {/* Hover sparkles */}
                {!isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute -top-2 -right-2 pointer-events-none"
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-orange-500" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Active filter indicator */}
      {selectedCuisine !== "All" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="flex items-center gap-2 px-4 py-1 bg-white rounded-full shadow-md text-sm">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="text-gray-600">
              Filtering by <span className="font-bold text-orange-600">{selectedCuisine}</span>
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
