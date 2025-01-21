import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import icons for password visibility toggle
import { Formik, Field, Form, ErrorMessage } from "formik"; // Import Formik components
import * as Yup from "yup"; // Import Yup for validation
import { toast } from "react-toastify"; // Correctly import `toast` from react-toastify

const Signup = () => {
    const navigate = useNavigate();

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation schema using Yup
    const signUpSchema = Yup.object({
        name: Yup.string().min(2).max(100).required("Please enter your name"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Please enter your email"),
        password: Yup.string()
            .min(8)
            .required("Please enter your password")
            .matches(/[0-9]/, "At least one digit (0-9)")
            .matches(/[a-z]/, "At least one lowercase")
            .matches(/[A-Z]/, "At least one uppercase")
            .matches(
                /[!@#$%^&*]/,
                "At least one special character (!, @, #, $, %, ^, &, or *)"
            ),
        confirmPassword: Yup.string()
            .required("Please confirm your password")
            .oneOf([Yup.ref("password"), null], "Passwords must match"),
    });

    const handleSignup = async (values) => {
        try {
            // Call the API
            await authService.signup(values);

            // Show success toast
            toast.success("Signup successful!", {
                position: "top-right",
                autoClose: 1000, // Auto-close after 1 second
            });

            // Redirect to login after a short delay (to allow toast to show)
            setTimeout(() => {
                navigate("/login");
            }, 1000); // Wait for 1 second before navigating to login
        } catch (err) {
            // Handle errors from API response
            alert(
                "Error: " + err.response?.data?.error ||
                    "An unexpected error occurred"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Create an Account
                </h2>

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
                    }) => (
                        <Form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <Field
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Enter your full name"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email Address
                                </label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Enter your email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div className="flex-col justify-between items-center">
                                <div className="flex relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="pr-[54px] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-blue-600"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        } // Toggle visibility
                                    >
                                        {showPassword ? (
                                            <AiFillEyeInvisible size={20} /> // Eye Invisible Icon
                                        ) : (
                                            <AiFillEye size={20} /> // Eye Icon
                                        )}
                                    </button>
                                </div>
                                <p className="text-red-600 font text-xs pl-3 pt-1">
                                    {touched.password && errors.password
                                        ? errors.password
                                        : "\u00A0"}
                                </p>
                            </div>

                            <div className="flex-col justify-between items-center">
                                <div className="flex relative">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className="pr-[54px] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-blue-600"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        } // Toggle visibility
                                    >
                                        {showConfirmPassword ? (
                                            <AiFillEyeInvisible size={20} /> // Eye Invisible Icon
                                        ) : (
                                            <AiFillEye size={20} /> // Eye Icon
                                        )}
                                    </button>
                                </div>
                                <p className="text-red-600 font text-xs pl-3 pt-1">
                                    {touched.confirmPassword &&
                                    errors.confirmPassword
                                        ? errors.confirmPassword
                                        : "\u00A0"}
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Creating Account..."
                                    : "Sign Up"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="text-sm text-center mt-6">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Signup;
