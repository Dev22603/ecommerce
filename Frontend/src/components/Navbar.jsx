import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import cartIcon from "../assets/cart.svg"; // Import your SVG cart icon
import { cartService } from "../services/cartService";
import { toast } from "react-toastify"; // Import toast for error notifications

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const token = user?.token;

    const [totalQuantity, setTotalQuantity] = useState(0);

    // Function to fetch and set the cart total from the API
    const fetchTotalQuantity = async () => {
        if (token) {
            try {
                const data = await cartService.getCartTotal(token);
                setTotalQuantity(data.totalQuantity); // Update the state with the total quantity from the API
            } catch (error) {
                console.error("Error fetching total quantity", error);
            }
        }
    };

    useEffect(() => {
        // Fetch total quantity when the component is mounted or the token changes
        fetchTotalQuantity();
    }, [token]); // Runs when the token changes (e.g., after login or logout)

    const handleViewOrders = () => {
        if (!user) {
            // Show toast if the user is not logged in
            toast.error("Please log in to view your orders.", {
                autoClose: 1000, // Toast duration
            });
        }
    };

    return (
        <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-6">
                {/* Brand Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-300"
                >
                    BrandName
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    {/* Conditional Links for Admin */}
                    {user && user.role === "admin" && (
                        <Link
                            to="/admin-dashboard"
                            className="text-lg text-gray-700 hover:text-blue-600 transition duration-300"
                        >
                            Admin Dashboard
                        </Link>
                    )}

                    {/* View Orders link (only visible if the user is not an admin) */}
                    {user && user.role !== "admin" ? (
                        <Link
                            to="/my-orders"
                            className="text-lg text-gray-700 hover:text-blue-600 transition duration-300"
                        >
                            View Orders
                        </Link>
                    ) : null}

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative group">
                        <img
                            src={cartIcon}
                            alt="cart-icon"
                            className="w-8 h-8"
                        />
                        {totalQuantity > 0 && (
                            <span className="absolute top-0 right-0 bg-orange-500 text-white text-sm font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>

                    {/* Conditional Links for Authentication */}
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <p className="text-lg text-gray-700">
                                Welcome, {user.name}
                            </p>
                            <button
                                onClick={logout}
                                className="text-lg text-red-600 hover:text-red-700 transition duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-lg text-gray-700 hover:text-blue-600 transition duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="text-lg text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
