import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          BrandName
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-lg text-gray-700 hover:text-blue-600 transition duration-300"
          >
            Home
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className="text-lg text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="text-lg text-red-600 hover:text-red-700 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-lg text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-lg text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
