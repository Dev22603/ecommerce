import React, { useState } from "react";

const ProductTable = ({ products, onEdit, onDelete }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const closeModal = () => {
        setSelectedProduct(null);
        setCurrentImageIndex(0); // Reset carousel index
    };

    const handleNextImage = () => {
        if (selectedProduct?.images) {
            setCurrentImageIndex(
                (prevIndex) => (prevIndex + 1) % selectedProduct.images.length
            );
        }
    };

    const handlePrevImage = () => {
        if (selectedProduct?.images) {
            setCurrentImageIndex(
                (prevIndex) =>
                    (prevIndex - 1 + selectedProduct.images.length) %
                    selectedProduct.images.length
            );
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">
                            Name
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                            WS Code
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                            Price
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                            Stock
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <td className="border border-gray-300 px-4 py-2">
                                {product.id}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {product.product_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {product.ws_code}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {product.sales_price}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {product.stock}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(product);
                                    }}
                                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(product.id);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>

                        <div className="p-6">
                            {/* Carousel */}
                            <div className="relative flex justify-center items-center mb-6">
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 bg-gray-800 text-white rounded-full p-2 focus:outline-none hover:bg-gray-700"
                                >
                                    &#8249;
                                </button>
                                {selectedProduct.images &&
                                    selectedProduct.images.length > 0 && (
                                        <img
                                            src={`http://localhost:5000/api${selectedProduct.images[currentImageIndex]}`}
                                            alt={`Product ${
                                                currentImageIndex + 1
                                            }`}
                                            className="w-96 h-96 object-contain border rounded-lg shadow"
                                        />
                                    )}
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-2 bg-gray-800 text-white rounded-full p-2 focus:outline-none hover:bg-gray-700"
                                >
                                    &#8250;
                                </button>
                            </div>

                            {/* Product Details */}
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold mb-2">
                                    {selectedProduct.product_name}
                                </h2>
                                <p className="text-gray-700">
                                    <strong>WS Code:</strong>{" "}
                                    {selectedProduct.ws_code}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Price:</strong> $
                                    {selectedProduct.sales_price}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Stock:</strong>{" "}
                                    {selectedProduct.stock}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;

// // Frontend/src/components/ProductTable.jsx
// import React from "react";

// const ProductTable = ({ products, onEdit, onDelete }) => {
//     return (
//         <div className="overflow-x-auto">
//             <table className="table-auto w-full border-collapse border border-gray-300">
//                 <thead>
//                     <tr className="bg-gray-200">
//                         <th className="border border-gray-300 px-4 py-2">ID</th>
//                         <th className="border border-gray-300 px-4 py-2">
//                             Name
//                         </th>
//                         <th className="border border-gray-300 px-4 py-2">
//                             WS Code
//                         </th>
//                         <th className="border border-gray-300 px-4 py-2">
//                             Price
//                         </th>
//                         <th className="border border-gray-300 px-4 py-2">
//                             Stock
//                         </th>
//                         <th className="border border-gray-300 px-4 py-2">
//                             Actions
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map((product) => (
//                         <tr key={product.id}>
//                             <td className="border border-gray-300 px-4 py-2">
//                                 {product.id}
//                             </td>
//                             <td className="border border-gray-300 px-4 py-2">
//                                 {product.product_name}
//                             </td>
//                             <td className="border border-gray-300 px-4 py-2">
//                                 {product.ws_code}
//                             </td>
//                             <td className="border border-gray-300 px-4 py-2">
//                                 {product.sales_price}
//                             </td>
//                             <td className="border border-gray-300 px-4 py-2">
//                                 {product.stock}
//                             </td>
//                             <td className="border border-gray-300 px-4 py-2">
//                                 <button
//                                     onClick={() => onEdit(product)}
//                                     className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => onDelete(product.id)}
//                                     className="px-4 py-2 bg-red-500 text-white rounded"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ProductTable;
