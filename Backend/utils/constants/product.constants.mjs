// constants/product.constants.mjs

const PRODUCT_VALIDATION_ERRORS = {
	NAME_REQUIRED: "Product name is required.",
	SALES_PRICE_REQUIRED: "Sales Price is required.",
	SALES_PRICE_INVALID: "Sales price must be a valid number",
	SALES_PRICE_MIN: "Sales price must be greater than 0",

	MRP_REQUIRED: "MRP is required.",
	MRP_INVALID: "MRP must be a valid number",
	MRP_MIN: "MRP must be greater than 0",

	CATEGORY_ID_REQUIRED: "Category ID is required.",
	CATEGORY_ID_INVALID: "Category ID must be a valid number",
	CATEGORY_ID_MIN: "Category ID must be greater than 0",
	CATEGORY_NOT_FOUND: "Category does not exist.",

	STOCK_REQUIRED: "Stock is required.",
	STOCK_INVALID: "Stock must be a valid number",
	STOCK_MIN: "Stock cannot be less than 0",

	IMAGE_REQUIRED: "At least one image is required.",
};

const PRODUCT_FEEDBACK_MESSAGES = {
	NO_PRODUCTS_FOUND: "No products found.",
	PRODUCT_ADDED_SUCCESS: "Product added successfully",
};

const GLOBAL_ERROR_MESSAGES = {
	SERVER_ERROR: "Internal Server Error. Please try again later.",
};

export {
	PRODUCT_VALIDATION_ERRORS,
	PRODUCT_FEEDBACK_MESSAGES,
	GLOBAL_ERROR_MESSAGES,
};
