import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./pages/Cart";
import AllOrders from "./pages/AllOrders";
import MyOrders from "./pages/MyOrders";

// Layout component to handle navbar visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-nexus-900">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="!bg-nexus-800 !border !border-nexus-600 !rounded-xl"
        />
        <Layout>
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
        </Layout>
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
