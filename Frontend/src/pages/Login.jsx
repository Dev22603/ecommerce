import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import React Icons
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
	const { login, user } = useContext(AuthContext); // Get the user from context
	const navigate = useNavigate();

	// Redirect if user is already logged in
	useEffect(() => {
		if (user) {
			// User is logged in, redirect based on their role
			if (user.role === "admin") {
				navigate("/admin-dashboard");
			} else if (user.role === "customer") {
				navigate("/");
			}
		}
	}, [user, navigate]); // This runs whenever 'user' changes

	const handleLogin = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!email || !password) {
			setError("All fields are required.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Call the API
			const userData = await authService.login({ email, password });
			console.log(userData);
			

			// Update global authentication state (set user data in AuthContext)
      
			// Show toast notification
			toast.success("Login successful!", {
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

			// Delay for 1 second, then navigate based on role
			// setTimeout(() => {
			// 	if (userData.role === "admin") {
			// 		navigate("/admin-dashboard");
			// 	} else if (userData.role === "customer") {
			// 		navigate("/");
			// 	}
			// }, 1000);
		} catch (err) {
			setError(
				err.response?.data?.message || "Invalid email or password."
			);
			toast.error("Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
					Login
				</h2>

				{error && (
					<div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-6">
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
								type={passwordVisible ? "text" : "password"}
								id="password"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
								onClick={() =>
									setPasswordVisible(!passwordVisible)
								}
								aria-label="Toggle password visibility"
							>
								{passwordVisible ? (
									<FaEyeSlash size={18} />
								) : (
									<FaEye size={18} />
								)}
							</button>
						</div>
					</div>

					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<div className="text-sm text-center mt-6">
					Don&apos;t have an account?{" "}
					<a
						href="/signup"
						className="text-blue-600 font-medium hover:underline"
					>
						Sign up
					</a>
				</div>
			</div>
		</div>
	);
};

export default Login;
