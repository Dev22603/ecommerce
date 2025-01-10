import  { useState } from 'react';

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    sales_price: '',
    category_id: '',
    tags: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ product_name: '', sales_price: '', category_id: '', tags: '' });
  };

  return (
    <div className="p-6 bg-white rounded shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="product_name"
            placeholder="Product Name"
            value={formData.product_name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="sales_price"
            placeholder="Sales Price"
            value={formData.sales_price}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="category_id"
            placeholder="Category ID"
            value={formData.category_id}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
