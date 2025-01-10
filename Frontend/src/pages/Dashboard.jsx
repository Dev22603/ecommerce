import  { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import CategoryForm from '../components/CategoryForm';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <ProductForm />
      <CategoryForm />
      <ProductList />
    </div>
  );
};

export default Dashboard;
