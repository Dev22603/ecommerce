import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Topdeals from "../Components/Topdeals";
export function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getProductData = async () => {
            try {
                const response = await axios.get(
                    "https://fakestoreapi.com/products"
                );
                console.log(response.data);
                setProducts(response.data);
                const uniqueCategories = [
                    ...new Set(response.data.map((object) => object.category)),
                ];
                console.log(uniqueCategories);
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching data: ", error);
                toast.error("Failed to fetch product data");
            }
        };

        getProductData();
    }, []);
    useEffect(() => {
        if (localStorage.getItem("login") !== "true") {
            navigate("/");
            // navigate(`/user/${localStorage.getItem("login_user")}`);
        }
    }, []);

    return (
        <>
            {products.length > 0 && (
                <Topdeals
                    product_list={[
                        products[0],
                        products[4],
                        products[9],
                        products[15],
                    ]}
                />
            )}
        </>
    );
}

export default Home;
