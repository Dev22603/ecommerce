import { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineChevronDown,
} from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Derive total quantity from cartItems
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group
        ${isActive(to) ? "text-accent" : "text-nexus-100 hover:text-accent"}
        ${className}`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-4 right-4 h-0.5 bg-accent transform origin-left transition-transform duration-300
          ${isActive(to) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
      />
    </Link>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${
            isScrolled
              ? "bg-nexus-900/95 backdrop-blur-lg border-b border-nexus-700/50 shadow-lg"
              : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105 shadow-lg border border-accent/30">
                  <span className="font-heading font-black text-accent text-lg">
                    DT
                  </span>
                </div>
                <div className="absolute -inset-1 bg-accent/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg text-nexus-50 tracking-tight leading-tight block">
                  DEV TRADERS
                </span>
                <span className="text-[10px] text-accent font-medium tracking-widest">
                  WHOLESALE ONLY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/">Products</NavLink>

              {user && user.role === "admin" && (
                <>
                  <NavLink to="/admin-dashboard">Dashboard</NavLink>
                  <NavLink to="/all-orders">Orders</NavLink>
                </>
              )}

              {user && user.role !== "admin" && (
                <NavLink to="/my-orders">My Orders</NavLink>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-xl transition-all duration-300
                  ${
                    isActive("/cart")
                      ? "bg-accent/10 text-accent"
                      : "text-nexus-100 hover:bg-nexus-700/50 hover:text-accent"
                  }`}
              >
                <HiOutlineShoppingCart className="w-6 h-6" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-nexus-900 text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </span>
                )}
              </Link>

              {/* User Menu / Auth Buttons */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
                      ${
                        isUserMenuOpen
                          ? "bg-nexus-700 text-accent"
                          : "bg-nexus-800/50 text-nexus-100 hover:bg-nexus-700/50"
                      }`}
                  >
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <HiOutlineUser className="w-4 h-4 text-accent" />
                    </div>
                    <span className="hidden md:block text-sm font-medium max-w-24 truncate">
                      {user.name}
                    </span>
                    <HiOutlineChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-nexus-800 border border-nexus-600 rounded-xl shadow-2xl py-2 animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-nexus-600">
                        <p className="text-sm font-medium text-nexus-50">
                          {user.name}
                        </p>
                        <p className="text-xs text-nexus-300 capitalize">
                          {user.role}
                        </p>
                      </div>

                      {user.role === "admin" ? (
                        <>
                          <Link
                            to="/admin-dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-nexus-100 hover:bg-nexus-700/50 hover:text-accent transition-colors"
                          >
                            <HiOutlineViewGrid className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            to="/all-orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-nexus-100 hover:bg-nexus-700/50 hover:text-accent transition-colors"
                          >
                            <HiOutlineClipboardList className="w-4 h-4" />
                            All Orders
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/my-orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-nexus-100 hover:bg-nexus-700/50 hover:text-accent transition-colors"
                        >
                          <HiOutlineClipboardList className="w-4 h-4" />
                          My Orders
                        </Link>
                      )}

                      <div className="border-t border-nexus-600 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-status-error hover:bg-status-error/10 transition-colors"
                        >
                          <HiOutlineLogout className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost btn-sm">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-nexus-100 hover:bg-nexus-700/50 hover:text-accent transition-colors"
              >
                {isMobileMenuOpen ? (
                  <HiOutlineX className="w-6 h-6" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out
            ${isMobileMenuOpen ? "max-h-96 border-t border-nexus-700/50" : "max-h-0"}`}
        >
          <div className="bg-nexus-900/98 backdrop-blur-lg px-4 py-4 space-y-1">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${
                  isActive("/")
                    ? "bg-accent/10 text-accent"
                    : "text-nexus-100 hover:bg-nexus-700/50"
                }`}
            >
              Products
            </Link>

            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin-dashboard"
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${
                      isActive("/admin-dashboard")
                        ? "bg-accent/10 text-accent"
                        : "text-nexus-100 hover:bg-nexus-700/50"
                    }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/all-orders"
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${
                      isActive("/all-orders")
                        ? "bg-accent/10 text-accent"
                        : "text-nexus-100 hover:bg-nexus-700/50"
                    }`}
                >
                  All Orders
                </Link>
              </>
            )}

            {user && user.role !== "admin" && (
              <Link
                to="/my-orders"
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                  ${
                    isActive("/my-orders")
                      ? "bg-accent/10 text-accent"
                      : "text-nexus-100 hover:bg-nexus-700/50"
                  }`}
              >
                My Orders
              </Link>
            )}

            {!user && (
              <div className="flex gap-2 pt-4 border-t border-nexus-700/50 mt-4">
                <Link to="/login" className="btn-secondary flex-1 text-center">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary flex-1 text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;
