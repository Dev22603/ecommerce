import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product Management App</h1>
          <nav>
            <Link to="/login" className="text-white hover:underline px-3">
              Login
            </Link>
            <Link to="/signup" className="text-white hover:underline px-3">
              Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex flex-col items-center text-center py-12 px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Manage Your Products Seamlessly
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          A robust platform for admins and customers to explore, manage, and organize products efficiently.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded shadow hover:bg-blue-600 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-green-500 text-white text-lg font-medium rounded shadow hover:bg-green-600 transition duration-200"
          >
            Signup
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Product Management App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
