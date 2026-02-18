import { motion, useMotionValue, useTransform } from "motion/react";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.1);
    mouseY.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const trendingSearches = ["Italian", "Sushi", "Pizza", "Tacos", "Thai"];

  return (
    <div className="relative max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative perspective-1000"
      >
        {/* Animated glow background */}
        <motion.div
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl blur-xl opacity-0"
        />

        {/* Animated border gradient */}
        <motion.div
          animate={{
            background: isFocused
              ? [
                  "linear-gradient(45deg, #f97316, #ec4899, #8b5cf6, #f97316)",
                  "linear-gradient(90deg, #f97316, #ec4899, #8b5cf6, #f97316)",
                  "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6, #f97316)",
                ]
              : "linear-gradient(45deg, #e5e7eb, #e5e7eb)",
            backgroundSize: isFocused ? "400% 400%" : "100% 100%",
          }}
          transition={{
            duration: 3,
            repeat: isFocused ? Infinity : 0,
          }}
          className="absolute -inset-[3px] rounded-3xl"
        />

        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Shimmer effect */}
          <motion.div
            animate={{
              x: isFocused ? ["0%", "200%"] : "0%",
            }}
            transition={{
              duration: 1.5,
              repeat: isFocused ? Infinity : 0,
              ease: "linear",
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 skew-x-12"
          />

          <div className="relative flex items-center p-2">
            {/* Search icon with animation */}
            <motion.div
              animate={{
                scale: isFocused ? [1, 1.2, 1] : 1,
                rotate: isFocused ? [0, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: isFocused ? Infinity : 0,
                repeatDelay: 2,
              }}
              className="absolute left-6 z-10"
            >
              <div className="relative">
                <Search className="w-6 h-6 text-gray-400" />
                {isFocused && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                        }}
                        className="absolute inset-0 border-2 border-orange-400 rounded-full"
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>

            <Input
              type="text"
              placeholder="Search restaurants, cuisines, dishes..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="pl-16 pr-6 py-8 text-lg border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />

            {/* Clear button */}
            {value && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange("")}
                className="absolute right-6 z-10 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-600 font-bold">×</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Progress bar animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full origin-left"
          style={{ transformStyle: "preserve-3d", translateZ: 10 }}
        >
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
          />
        </motion.div>

        {/* Floating particles */}
        {isFocused && [...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: -50,
              x: (i - 4) * 15,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute top-full left-1/2 w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
          />
        ))}
      </motion.div>

      {/* Trending searches */}
      {!value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <TrendingUp className="w-4 h-4" />
            </motion.div>
            <span className="font-medium">Trending:</span>
          </div>
          {trendingSearches.map((search, i) => (
            <motion.button
              key={search}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(search)}
              className="relative px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-300 group"
            >
              <span className="relative z-10 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                {search}
              </span>
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100" />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Search suggestions count */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
            </motion.div>
            <span className="text-sm text-gray-600">
              Finding best matches for <span className="font-bold text-orange-600">"{value}"</span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
