import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase, API_URL } from "../lib/supabase";
import { publicAnonKey } from "/utils/supabase/info";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accessToken: string, userName: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      // Now sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (signInData?.session?.access_token) {
        onSuccess(signInData.session.access_token, name);
        onClose();
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session?.access_token && data?.user?.user_metadata?.name) {
        onSuccess(data.session.access_token, data.user.user_metadata.name);
        onClose();
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          >
            {/* Animated background particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                  y: [0, -100],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
                className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
              />
            ))}
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Animated glow */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl blur-2xl"
              />

              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Animated gradient border */}
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 to-orange-500 opacity-10"
                  style={{ backgroundSize: "200% 200%" }}
                />

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>

                <div className="relative p-8">
                  {/* Header */}
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 text-center"
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
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-4 shadow-xl"
                    >
                      <UserIcon className="w-10 h-10 text-white" />
                      
                      {/* Orbiting sparkles */}
                      {[0, 120, 240].map((rotation, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            rotate: -360,
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.3,
                          }}
                          className="absolute inset-0"
                        >
                          <Sparkles 
                            className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 text-yellow-400"
                            style={{ rotate: `${rotation}deg`, transformOrigin: "50% 40px" }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.h2
                      className="text-3xl font-black mb-2"
                    >
                      <motion.span
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                        className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                        style={{ backgroundSize: "200% auto" }}
                      >
                        {isSignUp ? "Join FoodieFind" : "Welcome Back"}
                      </motion.span>
                    </motion.h2>
                    <p className="text-gray-600">
                      {isSignUp ? "Create your account to save favorites" : "Sign in to continue your journey"}
                    </p>
                  </motion.div>

                  {/* Form */}
                  <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {isSignUp && (
                        <motion.div
                          initial={{ opacity: 0, x: -20, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: "auto" }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            Name
                          </Label>
                          <div className="relative mt-1">
                            <Input
                              id="name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="pl-10 py-6 border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all"
                            />
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 py-6 border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 pr-12 py-6 border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.button>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            ⚠️
                          </motion.div>
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full py-6 text-lg font-bold text-white rounded-xl shadow-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <motion.div
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 to-orange-500"
                          style={{ backgroundSize: "200% 200%" }}
                        />
                        
                        {/* Shimmer effect */}
                        <motion.div
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 skew-x-12"
                        />

                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5" />
                              {isSignUp ? "Create Account" : "Sign In"}
                            </>
                          )}
                        </span>
                      </motion.button>
                    </motion.div>
                  </form>

                  {/* Toggle sign in/up */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                  >
                    <button
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                      {isSignUp
                        ? "Already have an account? "
                        : "Don't have an account? "}
                      <motion.span
                        whileHover={{ x: 3 }}
                        className="text-orange-600 font-bold inline-block"
                      >
                        {isSignUp ? "Sign in →" : "Sign up →"}
                      </motion.span>
                    </button>
                  </motion.div>

                  {/* Security badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500"
                  >
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secured by Supabase Authentication</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
