import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas/signupSchema";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hideSvg from "../assets/hide-password.svg";
import showSvg from "../assets/show-password-3.svg";
import logo from "../assets/logo.png";
import { authService } from "../services/authService";

const initialValues = {
	name: "",
	email: "",
	password: "",
	confirm_password: "",
	role: "customer", // Default role
	terms_and_conditions: false,
};

function Signup() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showCPassword, setShowCPassword] = useState(false);

	const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
		useFormik({
			initialValues,
			validationSchema: signUpSchema,
			onSubmit: async (values, action) => {
				try {
					const { name, email, password, role } = values;
					await authService.signup({ name, email, password, role });
					action.resetForm();
					setShowPassword(false);
					setShowCPassword(false);

					toast.success("Successfully registered!", {
						position: "top-right",
						autoClose: 3000,
						onClose: () => navigate("/"),
					});
				} catch (error) {
					toast.error(
						error.response?.data?.error ||
							"Failed to register. Please try again.",
						{ position: "top-center", autoClose: 3000 }
					);
				}
			},
		});

	const togglePasswordVisibility = () => setShowPassword(!showPassword);
	const toggleCPasswordVisibility = () => setShowCPassword(!showCPassword);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
				<div className="text-center">
					<img
						className="w-40 mx-auto mb-4"
						src={logo}
						alt="Logo"
					/>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Create an Account
					</h1>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name Input */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-900 dark:text-white"
						>
							Full Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							placeholder="John Doe"
							value={values.name}
							onChange={handleChange}
							onBlur={handleBlur}
							required
						/>
						{touched.name && errors.name && (
							<p className="text-red-500 text-xs mt-1">
								{errors.name}
							</p>
						)}
					</div>
					{/* Email Input */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-900 dark:text-white"
						>
							Your Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							placeholder="name@company.com"
							value={values.email}
							onChange={handleChange}
							onBlur={handleBlur}
							required
						/>
						{touched.email && errors.email && (
							<p className="text-red-500 text-xs mt-1">
								{errors.email}
							</p>
						)}
					</div>
					{/* Password Input */}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-900 dark:text-white"
						>
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								id="password"
								className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
								placeholder="••••••••"
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								required
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 px-3"
								onClick={togglePasswordVisibility}
							>
								<img
									src={showPassword ? showSvg : hideSvg}
									alt="Toggle Password"
								/>
							</button>
						</div>
					</div>
					{/* Confirm Password */}
					<div>
						<label
							htmlFor="confirm_password"
							className="block text-sm font-medium text-gray-900 dark:text-white"
						>
							Confirm Password
						</label>
						<div className="relative">
							<input
								type={showCPassword ? "text" : "password"}
								name="confirm_password"
								id="confirm_password"
								className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
								placeholder="••••••••"
								value={values.confirm_password}
								onChange={handleChange}
								onBlur={handleBlur}
								required
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 px-3"
								onClick={toggleCPasswordVisibility}
							>
								<img
									src={showCPassword ? showSvg : hideSvg}
									alt="Toggle Password"
								/>
							</button>
						</div>
					</div>
					{/* Submit Button */}
					<button
						type="submit"
						className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 focus:outline-none"
					>
						Sign Up
					</button>
					<p className="text-sm text-center text-gray-500">
						Already have an account?{" "}
						<Link
							to="/"
							className="text-primary-600 hover:underline"
						>
							Login here
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

export default Signup;
