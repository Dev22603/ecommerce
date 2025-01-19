// Frontend\src\App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/Cart";
import AllOrders from "./pages/AllOrders"; // Import AllOrders page

import MyOrders from "./pages/MyOrders"; // Import the new page for my orders

const App = () => (
	<AuthProvider>
		<CartProvider>
			<ToastContainer />
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/my-orders"
						element={
							<ProtectedRoute>
								<MyOrders />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/cart"
						element={
							<ProtectedRoute>
								<Cart />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin-dashboard"
						element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/all-orders"
						element={
							<ProtectedRoute>
								<AllOrders />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</CartProvider>
	</AuthProvider>
);

export default App;
