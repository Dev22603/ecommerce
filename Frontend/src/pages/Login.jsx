import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
} from "react-icons/hi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "customer") {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userData = await authService.login({ email, password });

      toast.success("Welcome back!", {
        autoClose: 1000,
        onClose: () => {
          login(userData);
          if (userData.role === "admin") {
            navigate("/admin-dashboard");
          } else if (userData.role === "customer") {
            navigate("/");
          }
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-900 via-nexus-850 to-nexus-800" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 168, 83, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 168, 83, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center border border-accent/30">
              <span className="font-heading font-black text-accent text-xl">
                DT
              </span>
            </div>
            <div>
              <span className="font-heading font-bold text-2xl text-nexus-50 block">
                DEV TRADERS
              </span>
              <span className="text-xs text-accent font-medium tracking-widest">
                WHOLESALE ONLY
              </span>
            </div>
          </Link>

          {/* Headlines */}
          <h1 className="font-heading text-5xl font-black text-nexus-50 leading-tight mb-6">
            Welcome to
            <br />
            <span className="text-gradient">Dev Traders</span>
          </h1>

          <p className="text-xl text-nexus-200 max-w-md mb-12">
            Your trusted wholesale partner for party supplies, accessories, and celebration items since 1995.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              "Wholesale prices for retailers",
              "Wide range of party supplies",
              "Trusted since 1995 in Tankshal",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-nexus-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-nexus-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center border border-accent/30">
                <span className="font-heading font-black text-accent text-sm">
                  DT
                </span>
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-nexus-50 block">
                  DEV TRADERS
                </span>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-10">
            <h2 className="font-heading text-3xl font-bold text-nexus-50 mb-2">
              Sign in to your account
            </h2>
            <p className="text-nexus-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-accent hover:text-accent-light transition-colors font-medium"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-status-error/10 border border-status-error/30 rounded-xl animate-fade-in">
              <p className="text-sm text-status-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "email" ? "scale-[1.02]" : ""
                }`}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-400">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  className={`input pl-12 ${error && !email ? "input-error" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@business.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "password" ? "scale-[1.02]" : ""
                }`}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-400">
                  <HiOutlineLockClosed className="w-5 h-5" />
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  className={`input pl-12 pr-12 ${error && !password ? "input-error" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-400 hover:text-nexus-200 transition-colors"
                >
                  {passwordVisible ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg group relative overflow-hidden"
            >
              <span
                className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading ? "opacity-0" : ""
                }`}
              >
                Sign In
                <HiOutlineArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-nexus-900 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-nexus-700" />
            <span className="text-sm text-nexus-400">or continue with</span>
            <div className="flex-1 h-px bg-nexus-700" />
          </div>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@example.com");
                setPassword("Admin@123");
              }}
              className="btn-secondary w-full justify-center"
            >
              Use Demo Admin Account
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("customer@example.com");
                setPassword("Customer@123");
              }}
              className="btn-ghost w-full justify-center"
            >
              Use Demo Customer Account
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-nexus-400 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
