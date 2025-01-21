import React, { useState, useEffect } from "react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("name"); // 'name' or 'ws_code'
    const { cartItems } = useCart();
    const [isSearching, setIsSearching] = useState(false); // Track if we are in search mode

    const fetchProducts = async (page) => {
        try {
            const response = await productService.getProducts(page);
            const { products, totalPages } = response;
            setProducts(products);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const handleSearch = async (page = 1) => {
        if (!searchQuery.trim()) {
            setIsSearching(false);
            fetchProducts(page); // Reset to default fetch if search is empty
            return;
        }

        try {
            setIsSearching(true);
            let result;
            if (searchType === "name") {
                result = await productService.getProductsByName(
                    searchQuery,
                    page
                );
            } else {
                result = await productService.getProductsByWsCode(
                    searchQuery,
                    page
                );
            }
            const { products, totalPages } = result;
            setProducts(products);
            setTotalPages(totalPages);
            setPage(page); // Update current page
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    useEffect(() => {
        if (isSearching) {
            handleSearch(page);
        } else {
            fetchProducts(page);
        }
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
            <div className="mb-6 flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded-lg p-2 flex-grow"
                />
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="border rounded-lg p-2"
                >
                    <option value="name">Search by Name</option>
                    <option value="ws_code">Search by WS Code</option>
                </select>
                <button
                    onClick={() => handleSearch(1)} // Reset to page 1 on new search
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Search
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    // const cartItem = cartItems.find(
                    //     (item) => item.id === product.id
                    // );
                    return (
                        <ProductCard
                            key={product.id}
                            product={product}
                            // cartItem={cartItem}
                        />
                    );
                })}
            </div>
            {totalPages > 1 && (
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
            )}
        </div>
    );
};

export default Home;
