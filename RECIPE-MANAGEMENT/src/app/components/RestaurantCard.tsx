import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Star, Clock, ChefHat, Heart, MapPin, DollarSign, Users, TrendingUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index: number;
}

export function RestaurantCard({ restaurant, isFavorite, onToggleFavorite, index }: RestaurantCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Generate random particles for sparkle effect
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative bg-gradient-to-br from-white via-white to-orange-50 rounded-3xl shadow-xl overflow-hidden cursor-pointer group perspective-1000"
    >
      {/* Animated gradient border */}
      <motion.div
        animate={{
          background: isHovered 
            ? "linear-gradient(45deg, #f97316, #ec4899, #8b5cf6, #f97316)"
            : "linear-gradient(45deg, transparent, transparent)",
          backgroundSize: "400% 400%",
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-3xl p-[2px] -z-10"
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl"
          style={{ backgroundSize: "200% 200%" }}
        />
      </motion.div>

      {/* Sparkle particles on hover */}
      {isHovered && particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: particle.x,
            y: particle.y,
          }}
          transition={{
            duration: 1.5,
            delay: particle.delay,
            repeat: Infinity,
          }}
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
        />
      ))}

      <div className="relative h-56 overflow-hidden">
        <motion.div
          animate={{
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Animated overlay gradient */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.4 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
        />

        {/* Animated shine effect */}
        <motion.div
          animate={{
            x: isHovered ? "200%" : "-100%",
          }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 skew-x-12"
        />

        {restaurant.isOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
            className="absolute top-4 right-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.7)",
                  "0 0 0 10px rgba(34, 197, 94, 0)",
                  "0 0 0 0 rgba(34, 197, 94, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge className="bg-green-500 text-white font-semibold px-3 py-1 shadow-lg">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ● 
                </motion.span>
                {" "}Open Now
              </Badge>
            </motion.div>
          </motion.div>
        )}

        {/* Favorite button with advanced animation */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(restaurant.id);
          }}
          className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-full p-3 shadow-xl border-2 border-white"
        >
          <motion.div
            animate={isFavorite ? { 
              scale: [1, 1.4, 1],
              rotate: [0, 15, -15, 0]
            } : {}}
            transition={{ duration: 0.4 }}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </motion.div>
          {isFavorite && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 2, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 20,
                    y: Math.sin(i * 60 * Math.PI / 180) * 20,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
                />
              ))}
            </>
          )}
        </motion.button>

        {/* Trending badge */}
        {restaurant.rating >= 4.7 && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
            className="absolute bottom-4 left-4"
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-3 py-1 shadow-lg flex items-center gap-1">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <TrendingUp className="w-3 h-3" />
              </motion.div>
              Trending
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="relative p-6 bg-white/80 backdrop-blur-sm">
        {/* Name and rating with animation */}
        <div className="flex items-start justify-between mb-3">
          <motion.div
            style={{ translateZ: 20 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>0.{Math.floor(Math.random() * 9) + 1} mi away</span>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative"
            style={{ translateZ: 30 }}
          >
            <div className="flex items-center gap-1 bg-gradient-to-br from-yellow-50 to-orange-50 px-3 py-2 rounded-xl border-2 border-yellow-200 shadow-md">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </motion.div>
              <span className="text-lg font-bold text-gray-900">{restaurant.rating}</span>
            </div>
            {/* Rating particle effect */}
            <motion.div
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.5, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-yellow-300 rounded-xl blur-md -z-10"
            />
          </motion.div>
        </div>

        <motion.p 
          className="text-sm text-gray-600 mb-4 leading-relaxed"
          style={{ translateZ: 20 }}
        >
          {restaurant.description}
        </motion.p>

        {/* Cuisine badge with enhanced styling */}
        <motion.div 
          className="flex items-center gap-2 mb-4"
          style={{ translateZ: 25 }}
        >
          <Badge 
            variant="secondary" 
            className="font-semibold text-sm px-4 py-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-orange-100 hover:to-pink-100 transition-all cursor-pointer border-2 border-transparent hover:border-orange-300"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {restaurant.cuisine}
          </Badge>
          <Badge 
            variant="outline" 
            className="font-medium text-xs px-3 py-1"
          >
            <DollarSign className="w-3 h-3 mr-1" />
            $$
          </Badge>
          <Badge 
            variant="outline" 
            className="font-medium text-xs px-3 py-1"
          >
            <Users className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </motion.div>

        {/* Stats with advanced animations */}
        <motion.div 
          className="grid grid-cols-2 gap-3"
          style={{ translateZ: 30 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-blue-500 p-2 rounded-lg"
            >
              <Clock className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Wait Time</div>
              <div className="text-sm font-bold text-gray-900">{restaurant.waitTime} min</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="flex items-center gap-2 bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-xl border border-orange-100"
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                y: [0, -2, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-orange-500 p-2 rounded-lg"
            >
              <ChefHat className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Prep Time</div>
              <div className="text-sm font-bold text-gray-900">{restaurant.prepTime} min</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Book now button */}
        <motion.div
          style={{ translateZ: 40 }}
          className="mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
          >
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 skew-x-12"
            />
            <span className="relative z-10">Book Table Now</span>
          </motion.button>
        </motion.div>
      </div>

      {/* 3D shadow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-2xl -z-20"
      />
    </motion.div>
  );
}
