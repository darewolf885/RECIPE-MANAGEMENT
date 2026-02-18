import { motion } from "motion/react";

export function RestaurantCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden"
    >
      {/* Image skeleton */}
      <div className="relative h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 overflow-hidden">
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
        />
      </div>

      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 overflow-hidden relative">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.2,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
            />
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 overflow-hidden relative">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.3,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
            />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full overflow-hidden relative">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.4,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
            />
          </div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/5 overflow-hidden relative">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
            />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-20 overflow-hidden relative">
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.6 + i * 0.1,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
