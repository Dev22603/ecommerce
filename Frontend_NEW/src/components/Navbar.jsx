import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useCart } from "../context/CartContext";
import cartIcon from "../assets/cart.svg";
import logo from "../assets/logo.png";

console.log(localStorage.getItem("login"));
function Navbar() {
	const { cart } = useCart();
	const navigate = useNavigate();
	const handleLogout = () => {
		toast.success("Logged out successfully!", {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			onClose: () => {
				localStorage.setItem("login", "false");
				localStorage.removeItem("login_user");
				navigate("/");
			},
		});
	};

	return (
		<>
			<div className="relative w-full bg-white  py-1 flex justify-between border-b">
				<div className=" flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 lg:px-5 ">
					<div className="inline-flex items-center space-x-2 ">
						<Link
							to="/"
							className="hover:cursor-pointer hover:border-black hover:border-[1px] rounded-[3px]  p-1  border-transparent border-[1px]"
						>
							<img className="h-8 " src={logo} alt="logo" />
						</Link>
					</div>
				</div>
				<div className="flex max-w-7xl items-center justify-between  px-3 py-2 sm:px-4 lg:px-5 ">
					<div className="hidden grow items-start lg:flex justify-center">
						<ul className="ml-12 inline-flex space-x-8"></ul>
					</div>
				</div>
				<div className="flex max-w-7xl items-center justify-between  px-3 py-2 sm:px-4 lg:px-5">
					{localStorage.getItem("login") === null ||
					localStorage.getItem("login") === "false" ? (
						<div className="hidden space-x-2 lg:block">
							<Link to={"/Signup"}>
								<button
									type="button"
									className="rounded-md border border-black  bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
								>
									Sign Up
								</button>
							</Link>
							<Link to={"/login"}>
								<button
									type="button"
									className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black hover:bg-green-500"
								>
									Sign In
								</button>
							</Link>
						</div>
					) : (
						<div className="hidden space-x-2 lg:flex  lg:relative lg:items-center">
							<button
								type="button"
								onClick={() => navigate("/Cart")}
								className=" rounded-md border border-white  bg-transparent px-0.5 py-1 text-sm font-semibold text-black hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
							>
								<img src={cartIcon} alt="cart-icon" />
							</button>
							<button
								type="button"
								onClick={handleLogout}
								className="rounded-md border border-black  bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
							>
								Log Out
							</button>
							{cart.reduce((total, num) => {
								return total + num.quantity;
							}, 0) < 10 && (
								<p className="absolute left-4 top-0.5 text-sm text-orange-500">
									{cart.reduce((total, num) => {
										return total + num.quantity;
									}, 0)}
								</p>
							)}
							{cart.reduce((total, num) => {
								return total + num.quantity;
							}, 0) >= 10 &&
								cart.reduce((total, num) => {
									return total + num.quantity;
								}, 0) <= 99 && (
									<p className="absolute left-3.5 top-0.5 text-sm text-orange-500">
										{cart.reduce((total, num) => {
											return total + num.quantity;
										}, 0)}
									</p>
								)}
							{cart.reduce((total, num) => {
								return total + num.quantity;
							}, 0) > 99 && (
								<p className="absolute left-3.5 top-0.5 text-sm text-orange-500 ">
									99+
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default Navbar;
