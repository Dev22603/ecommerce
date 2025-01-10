import { useState } from 'react';

const CategoryForm = ({ onSubmit }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category_name: categoryName });
    setCategoryName('');
  };

  return (
    <div className="p-6 bg-white rounded shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            name="category_name"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="p-2 border rounded flex-1"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
