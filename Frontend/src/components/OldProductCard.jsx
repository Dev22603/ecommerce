import React, { useContext } from "react";
import CartContext from "../context/CartContext";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function OldProductCard({ item }) {
    const { cart, Decrement, Increment, removeFromCart, addToCart } =
        useContext(CartContext);

    return (
        <div className="h-[500px] w-1/4 border rounded-md shadow-md m-1 flex flex-col items-center text-center justify-around ">
            <img
                src={item.image}
                alt=""
                className="object-contain h-[70%] pt-4 px-6 "
            />
            <div className="w-full p-2">
                <p className="text-sm text-gray-700 font-light truncate">
                    {item.title}
                </p>
                <p className="text-md  font-light ">₹ {item.price}</p>
            </div>
            {cart.find((product) => product.id === item.id) ? (
                <div className="flex items-center">
                    <button
                        type="button"
                        id="decrement-button"
                        onClick={() => Decrement(item)}
                        data-input-counter-decrement="counter-input"
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                    >
                        <svg
                            className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                            />
                        </svg>
                    </button>
                    <p className="w-10 bg-slate-200 rounded-lg mx-1 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white">
                        {
                            cart.find((product) => product.id === item.id)
                                .quantity
                        }
                    </p>
                    <button
                        type="button"
                        id="increment-button"
                        onClick={() => Increment(item)}
                        data-input-counter-increment="counter-input"
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                    >
                        <svg
                            className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                            />
                        </svg>
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        if (localStorage.getItem("login") !== "true") {
                            toast.success("User not Logged in", {
                                position: "top-right",
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                onClose: () => {
                                    navigate("/");
                                },
                            });
                        } else {
                            addToCart(item);
                        }
                    }}
                    className=" inline-flex w-5/6 mb-1 items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    <svg
                        className="-ms-2 me-2 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                    </svg>
                    Add to cart
                </button>
            )}
        </div>
    );
}

export default OldProductCard;
