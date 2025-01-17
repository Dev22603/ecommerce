import axios from "axios";
import React from "react";
import HomePageProductCard from "./HomePageProductCard";

function capitalizeEachWord(str) {
	let words = str.split(" ");

	let capitalizedWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return capitalizedWords.join(" ");
}

// function Topdeals ( { product_list } )
// {
// 	return (
// 		<div className=" flex justify-start border p-10 m-10 rounded-md ">
// 			<h1 className="text-3xl font-bold mb-5">Top Deals</h1>
// 				{product_list.map((item, index) => (
// 					<Card1 key={index} item={item} />
// 				))}
// 		</div>
// 	);
// }



function Topdeals({ product_list}) {
	return (
		<div className="border p-10 m-10 rounded-md ">
			<h1 className="text-3xl font-bold mb-5">Top Deals</h1>
			<div className="flex justify-start ">
				{product_list.map((item, index) => (
					<HomePageProductCard key={index} item={item} />
				))}
			</div>
		</div>
	);
}

export default Topdeals;
