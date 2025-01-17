import React, { useState, useEffect } from "react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const Home = () => {
    const [products, setProducts] = useState([]); // Changed products_ to products
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { cartItems } = useCart(); // Use cartItems from context

    // Fetch products from the API
    const fetchProducts = async (page) => {
        try {
            const response = await productService.getProducts(page);
            const { products, totalPages } = response; // Adjusted to match response structure
            setProducts(products);
            setTotalPages(totalPages);

            console.log(products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    const cartItem = cartItems.find(
                        (item) => item.id === product.id
                    );
                    return (
                        <ProductCard
                            key={product.id}
                            product={product}
                            cartItem={cartItem}
                        />
                    );
                })}
            </div>
            <div className="flex justify-center items-center mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="mx-4">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
