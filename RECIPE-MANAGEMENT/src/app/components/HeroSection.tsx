import { motion, useAnimation } from "motion/react";
import { Utensils, Sparkles, Zap, Award } from "lucide-react";
import { useEffect } from "react";

export function HeroSection() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: { duration: 20, repeat: Infinity, ease: "linear" },
    });
  }, [controls]);

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="relative overflow-hidden py-24 px-4">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      {/* Animated geometric shapes */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full blur-3xl opacity-20"
      />
      
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full blur-3xl opacity-20"
      />

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-10 blur-2xl"
        style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
      />

      {/* Floating stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
          className="absolute bg-yellow-400 rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
        />
      ))}

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Animated icon with complex animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, bounce: 0.5 }}
          className="relative inline-flex items-center justify-center mb-8"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-32 h-32 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-50"
          />
          
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center"
            style={{
              boxShadow: "0 0 60px rgba(251, 146, 60, 0.4)",
            }}
          >
            <Utensils className="w-12 h-12 text-white" />
            
            {/* Orbiting mini icons */}
            {[0, 120, 240].map((rotation, i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3,
                }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                  style={{ rotate: `${rotation}deg`, transformOrigin: "50% 50px" }}
                >
                  {i === 0 && <Sparkles className="w-3 h-3 text-orange-500" />}
                  {i === 1 && <Zap className="w-3 h-3 text-pink-500" />}
                  {i === 2 && <Award className="w-3 h-3 text-purple-500" />}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 2.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
              }}
              className="absolute inset-0 border-4 border-orange-400 rounded-full"
            />
          ))}
        </motion.div>

        {/* Main heading with complex text animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-block bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              Discover
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block"
            >
              <span className="text-gray-900 relative">
                Amazing
                <motion.div
                  animate={{
                    scaleX: [0, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.8,
                  }}
                  className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-50 rounded-full"
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block text-gray-900"
            >
              Restaurants
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, -20, -40],
                    x: i * 10,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.6 + i * 0.2,
                  }}
                  className="inline-block ml-2 text-4xl"
                >
                  ✨
                </motion.span>
              ))}
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle with typing effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative"
        >
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Find the perfect dining experience with{" "}
            <motion.span
              animate={{
                color: ["#f97316", "#ec4899", "#8b5cf6", "#f97316"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="font-bold"
            >
              real-time wait times
            </motion.span>
            {" "}and{" "}
            <motion.span
              animate={{
                color: ["#8b5cf6", "#ec4899", "#f97316", "#8b5cf6"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="font-bold"
            >
              verified ratings
            </motion.span>
          </p>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { icon: "⚡", text: "Instant Booking" },
            { icon: "🎯", text: "Best Matches" },
            { icon: "⭐", text: "Top Rated" },
            { icon: "🎁", text: "Special Offers" },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border-2 border-gray-100 flex items-center gap-2 cursor-pointer"
            >
              <motion.span
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="text-2xl"
              >
                {badge.icon}
              </motion.span>
              <span className="font-semibold text-gray-800">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "500+", label: "Restaurants" },
            { value: "50K+", label: "Happy Diners" },
            { value: "4.9", label: "Avg Rating" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6 + i * 0.1, type: "spring" }}
                className="text-4xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
