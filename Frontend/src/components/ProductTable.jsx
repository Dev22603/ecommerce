// Frontend/src/components/ProductTable.jsx
import React from "react";

const ProductTable = ({ products, onEdit, onDelete }) => {
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
                        <tr key={product.id}>
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
                                    onClick={() => onEdit(product)}
                                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
