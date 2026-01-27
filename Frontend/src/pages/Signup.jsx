import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineArrowRight,
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Validation schema using Yup
  const signUpSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .required("Please enter your name"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Please enter your email"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Please enter your password")
      .matches(/[0-9]/, "Must contain at least one digit")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[!@#$%^&*]/, "Must contain at least one special character"),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      await authService.signup(values);
      toast.success("Account created successfully!", {
        autoClose: 1500,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Signup failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Password strength indicators
  const getPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      digit: /[0-9]/.test(password),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    const passed = Object.values(checks).filter(Boolean).length;
    return { checks, passed, total: 5 };
  };

  const PasswordRequirement = ({ met, text }) => (
    <div
      className={`flex items-center gap-2 text-xs transition-colors ${
        met ? "text-status-success" : "text-nexus-400"
      }`}
    >
      {met ? (
        <HiOutlineCheck className="w-3.5 h-3.5" />
      ) : (
        <HiOutlineX className="w-3.5 h-3.5" />
      )}
      {text}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-900 via-nexus-850 to-nexus-800" />

        {/* Decorative Elements */}
        <div className="absolute top-40 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

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
            Start Your
            <br />
            <span className="text-gradient">Wholesale Journey</span>
          </h1>

          <p className="text-xl text-nexus-200 max-w-md mb-12">
            Register to access wholesale prices on party supplies, accessories, and celebration items from Tankshal Market, Ahmedabad.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "25+", label: "Years Experience" },
              { value: "1000+", label: "Products" },
              { value: "100%", label: "Genuine Products" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="font-heading text-2xl font-bold text-accent">
                  {stat.value}
                </p>
                <p className="text-sm text-nexus-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-nexus-900 overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-heading text-3xl font-bold text-nexus-50 mb-2">
              Create your account
            </h2>
            <p className="text-nexus-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent hover:text-accent-light transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signUpSchema}
            onSubmit={handleSignup}
          >
            {({
              values,
              handleChange,
              handleBlur,
              touched,
              errors,
              isSubmitting,
            }) => {
              const strength = getPasswordStrength(values.password);

              return (
                <Form className="space-y-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="input-label">
                      Full Name
                    </label>
                    <div
                      className={`relative transition-all duration-300 ${
                        focusedField === "name" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-400">
                        <HiOutlineUser className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`input pl-12 ${
                          touched.name && errors.name ? "input-error" : ""
                        }`}
                        value={values.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        placeholder="John Doe"
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p className="input-error-text">{errors.name}</p>
                    )}
                  </div>

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
                        name="email"
                        className={`input pl-12 ${
                          touched.email && errors.email ? "input-error" : ""
                        }`}
                        value={values.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        placeholder="you@business.com"
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p className="input-error-text">{errors.email}</p>
                    )}
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
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`input pl-12 pr-12 ${
                          touched.password && errors.password
                            ? "input-error"
                            : ""
                        }`}
                        value={values.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-400 hover:text-nexus-200 transition-colors"
                      >
                        {showPassword ? (
                          <HiOutlineEyeOff className="w-5 h-5" />
                        ) : (
                          <HiOutlineEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {values.password && (
                      <div className="space-y-3 mt-3 p-3 bg-nexus-800/50 rounded-lg">
                        {/* Strength Bar */}
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i < strength.passed
                                  ? strength.passed <= 2
                                    ? "bg-status-error"
                                    : strength.passed <= 4
                                      ? "bg-status-warning"
                                      : "bg-status-success"
                                  : "bg-nexus-600"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Requirements */}
                        <div className="grid grid-cols-2 gap-2">
                          <PasswordRequirement
                            met={strength.checks.length}
                            text="8+ characters"
                          />
                          <PasswordRequirement
                            met={strength.checks.digit}
                            text="One digit"
                          />
                          <PasswordRequirement
                            met={strength.checks.lowercase}
                            text="One lowercase"
                          />
                          <PasswordRequirement
                            met={strength.checks.uppercase}
                            text="One uppercase"
                          />
                          <PasswordRequirement
                            met={strength.checks.special}
                            text="One special (!@#$%^&*)"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="input-label">
                      Confirm Password
                    </label>
                    <div
                      className={`relative transition-all duration-300 ${
                        focusedField === "confirmPassword" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-400">
                        <HiOutlineLockClosed className="w-5 h-5" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`input pl-12 pr-12 ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "input-error"
                            : ""
                        }`}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-400 hover:text-nexus-200 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <HiOutlineEyeOff className="w-5 h-5" />
                        ) : (
                          <HiOutlineEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="input-error-text">{errors.confirmPassword}</p>
                    )}
                    {values.confirmPassword &&
                      values.password === values.confirmPassword && (
                        <p className="text-xs text-status-success flex items-center gap-1">
                          <HiOutlineCheck className="w-3.5 h-3.5" />
                          Passwords match
                        </p>
                      )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full btn-lg group relative overflow-hidden mt-6"
                  >
                    <span
                      className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                        isSubmitting ? "opacity-0" : ""
                      }`}
                    >
                      Create Account
                      <HiOutlineArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-nexus-900 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </Form>
              );
            }}
          </Formik>

          {/* Footer */}
          <p className="text-center text-xs text-nexus-400 mt-8">
            By creating an account, you agree to our{" "}
            <span className="text-nexus-200 hover:text-accent cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-nexus-200 hover:text-accent cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
