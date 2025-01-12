import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import icons
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("customer"); // Default role
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false); // State for password visibility
	const navigate = useNavigate();

	const handleSignup = async (e) => {
		e.preventDefault();

		// Basic Validation
		if (!email || !password || !role) {
			toast.error("All fields are required.", {
				position: "top-right",
				autoClose: 3000, // Toast will close after 3 seconds
			});
			return;
		}

		if (role !== "admin" && role !== "customer") {
			toast.error("Invalid role selected.", {
				position: "top-right",
				autoClose: 3000, // Toast will close after 3 seconds
			});
			return;
		}

		try {
			setLoading(true);

			// Call the API
			await authService.signup({ email, password, role });

			toast.success("Signup successful! Redirecting to login...", {
				position: "top-right",
				autoClose: 3000, // Toast will stay visible for 3 seconds before auto-closing
				onClose: () => {
					navigate("/login"); // Redirect only after the toast closes
				},
			});
		} catch (err) {
			// Handle specific backend error messages
			const errorMessage =
				err.response?.data?.error ||
				"An unexpected error occurred. Please try again.";
			toast.error(errorMessage, {
				position: "top-right",
				autoClose: 3000, // Toast will close after 3 seconds
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<ToastContainer /> {/* Add ToastContainer for displaying toasts */}
			<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
					Create an Account
				</h2>

				<form onSubmit={handleSignup} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
								id="password"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600 hover:text-blue-600"
								onClick={() => setShowPassword(!showPassword)} // Toggle visibility
							>
								{showPassword ? (
									<AiFillEyeInvisible size={20} /> // Eye Invisible Icon
								) : (
									<AiFillEye size={20} /> // Eye Icon
								)}
							</button>
						</div>
					</div>

					<div>
						<label
							htmlFor="role"
							className="block text-sm font-medium text-gray-700"
						>
							Role
						</label>
						<select
							id="role"
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							required
						>
							<option value="customer">Customer</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
						disabled={loading}
					>
						{loading ? "Creating Account..." : "Sign Up"}
					</button>
				</form>

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
