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
			initialValues: initialValues,
			validationSchema: signUpSchema,
			onSubmit: async (values, action) => {
				try {
					const { name, email, password, role } = values;
					// Call the signup API using authService
					await authService.signup({ name, email, password, role });

					// Reset form and states
					action.resetForm();
					setShowPassword(false);
					setShowCPassword(false);

					toast.success("Successfully registered!", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						onClose: () => {
							navigate("/"); // Redirect to login page
						},
					});
				} catch (error) {
					console.error("Signup error:", error);
					toast.error(
						error.response?.data?.error ||
							"Failed to register. Please try again.",
						{
							position: "top-center",
							autoClose: 3000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						}
					);
				}
			},
		});

	const togglePasswordVisibility = () => setShowPassword(!showPassword);
	const toggleCPasswordVisibility = () => setShowCPassword(!showCPassword);

	return (
		<div>
			<section className="bg-gray-50 dark:bg-gray-900">
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
					<Link
						to="#"
						className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
					>
						<img
							className="w-[200px] mr-2 pt-5"
							src={logo}
							alt="logo"
						/>
					</Link>
					<div className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
								Create an account
							</h1>
							<form
								className="space-y-4 md:space-y-6"
								onSubmit={handleSubmit}
							>
								{/* Name Input */}
								<div>
									<label
										htmlFor="name"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Full Name
									</label>
									<input
										type="text"
										name="name"
										id="name"
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="John Doe"
										required
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<p className="text-red-600 font text-xs pl-3 pt-1">
										{touched.name && errors.name
											? errors.name
											: "\u00A0"}
									</p>
								</div>
								{/* Email Input */}
								<div>
									<label
										htmlFor="email"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Your email
									</label>
									<input
										type="email"
										name="email"
										id="email"
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="name@company.com"
										required
										value={values.email}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<p className="text-red-600 font text-xs pl-3 pt-1">
										{touched.email && errors.email
											? errors.email
											: "\u00A0"}
									</p>
								</div>
								{/* Password Input */}
								<div>
									<label
										htmlFor="password"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Password
									</label>
									<div className="flex relative">
										<input
											type={
												showPassword
													? "text"
													: "password"
											}
											name="password"
											id="password"
											className="pr-[54px] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder="••••••••"
											required
											value={values.password}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 px-3 flex items-center"
											onClick={togglePasswordVisibility}
										>
											<img
												src={
													showPassword
														? showSvg
														: hideSvg
												}
												className="h-7"
												alt="Toggle Password"
											/>
										</button>
									</div>
									<p className="text-red-600 font text-xs pl-3 pt-1">
										{touched.password && errors.password
											? errors.password
											: "\u00A0"}
									</p>
								</div>
								{/* Confirm Password Input */}
								<div>
									<label
										htmlFor="confirm_password"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Confirm Password
									</label>
									<div className="flex relative">
										<input
											type={
												showCPassword
													? "text"
													: "password"
											}
											name="confirm_password"
											id="confirm_password"
											className="pr-[54px] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder="••••••••"
											required
											value={values.confirm_password}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 px-3 flex items-center"
											onClick={toggleCPasswordVisibility}
										>
											<img
												src={
													showCPassword
														? showSvg
														: hideSvg
												}
												className="h-7"
												alt="Toggle Password"
											/>
										</button>
									</div>
									<p className="text-red-600 font text-xs pl-3 pt-1">
										{touched.confirm_password &&
										errors.confirm_password
											? errors.confirm_password
											: "\u00A0"}
									</p>
								</div>
								{/* Role Selection */}
								<div>
									<label
										htmlFor="role"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Select Role
									</label>
									<select
										id="role"
										name="role"
										value={values.role}
										onChange={handleChange}
										onBlur={handleBlur}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									>
										<option value="customer">
											Customer
										</option>
										<option value="admin">Admin</option>
									</select>
								</div>
								{/* Terms and Conditions */}
								<div className="flex items-start">
									<div className="flex items-center h-5">
										<input
											id="terms_and_conditions"
											name="terms_and_conditions"
											type="checkbox"
											className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
											required
											checked={
												values.terms_and_conditions
											}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									</div>
									<label
										htmlFor="terms_and_conditions"
										className="ml-2 text-sm font-light text-gray-500 dark:text-gray-300"
									>
										I accept the{" "}
										<Link
											className="font-medium text-primary-600 hover:underline dark:text-primary-500"
											to="#"
										>
											Terms and Conditions
										</Link>
									</label>
								</div>
								<button
									type="submit"
									className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
								>
									Create an account
								</button>
								<p className="text-sm font-light text-gray-500 dark:text-gray-400">
									Already have an account?{" "}
									<Link
										to="/login"
										className="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>
										Login here
									</Link>
								</p>
							</form>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Signup;

// Method 1 using formik to check if email exists
// const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
// 	useFormik({
// 		initialValues: initialValues,
// 		validationSchema: signUpSchema,
// 		onSubmit: (values, { setFieldError, resetForm }) => {
// 			// Check if email is already registered
// 			if (isEmailRegistered(values.email)) {
// 				setFieldError("email", "This email is already registered");
// 			} else {
// 				// Proceed with registration
// 				localStorage.setItem(values.email, JSON.stringify(values));
// 				resetForm();
// 				toast.success("Successfully registered!", {
// 					position: "top-right",
// 					autoClose: 3000,
// 					hideProgressBar: false,
// 					closeOnClick: true,
// 					pauseOnHover: true,
// 					draggable: true,
// 					progress: undefined,
// 					onClose: () => {
// 						console.log("Redirecting to login page...");
// 						navigate("/");
// 					},
// 				});
// 			}
// 		},
// 	});
//
//
//
//
//
//
// const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
// 	useFormik({
// 		initialValues: initialValues,
// 		validationSchema: signUpSchema,
// 		onSubmit: (values, action) => {
// 			console.log("🚀 ~ Signup ~ values:", values);
// 			localStorage.setItem(values.email, JSON.stringify(values));
// 			action.resetForm();
// 			toast.success("Successfully registered!", {
// 				position: "top-right",
// 				autoClose: 3000,
// 				hideProgressBar: false,
// 				closeOnClick: true,
// 				pauseOnHover: true,
// 				draggable: true,
// 				progress: undefined,
// 				onClose: () => {
// 					console.log("Redirecting to login page...");
// 					navigate("/");
// 				},
// 			});
// 		},
// 	});
//
//
//
//
//
