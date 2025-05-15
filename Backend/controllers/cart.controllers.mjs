// Backend\controllers\cart.controllers.mjs
import { pool } from "../db/db.mjs";
import {
  ADD_TO_CART,
  GET_CART_TOTAL_BY_USER,
  GET_USER_CART,
  UPDATE_CART_ITEM_BY_USER_AND_PRODUCT,
  DELETE_CART_ITEM_BY_USER_AND_PRODUCT,
  GET_PRODUCT_NAME,
} from "../queries/cart.queries.mjs";
import { GLOBAL_ERROR_MESSAGES } from "../utils/constants/constants.mjs";

// Add to Cart inspired by Amazon
const addItemToCart = async (req, res) => {
  const { product_id } = req.body; // Only product_id is provided in the request
  const user_id = req.user.id;
  console.log(user_id);

  try {
    const result = await pool.query(ADD_TO_CART);
  } catch (error) {
    res.status(500).json({
      message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR,
      error,
    });
  }
};

const getCart = async (req, res) => {
  const user_id = req.user.id; // assuming you have user info from JWT token

  try {
    const cart = await pool.query(GET_USER_CART, [user_id]);
    const grandTotal = await pool.query(GET_CART_TOTAL_BY_USER, [user_id]);
    res.status(200).json({
      items: cart.rows,
      total_amount: grandTotal.rows[0].total_amount,
      total_quantity: grandTotal.rows[0].total_quantity,
    });
  } catch (error) {
    res.status(500).json({
      message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR,
      error,
    });
  }
};

// Update cart item
const updateCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    if (quantity === 0) {
      try {
        const deleteResult = await pool.query(
          DELETE_CART_ITEM_BY_USER_AND_PRODUCT,
          [user_id, product_id]
        );

        if (deleteResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Product not found in the cart",
          });
        }

        const productResult = await pool.query(GET_PRODUCT_NAME, [product_id]);

        return res.status(200).json({
          success: true,
          message: `${productResult.rows[0].product_name} has been removed from your cart.`,
          product_id: parseInt(product_id, 10),
        });
      } catch (error) {
        console.error("Error removing item from cart:", error);
        return res.status(500).json({
          success: false,
          message: "Error removing item from cart",
          error: error.message,
        });
      }
    }

    const updateResult = await pool.query(
      UPDATE_CART_ITEM_BY_USER_AND_PRODUCT,
      [quantity, user_id, product_id]
    );

    // Check if the item exists in the cart
    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found. The product may not be in your cart.",
      });
    }

    // Get the updated cart item
    const updatedItem = updateResult.rows[0];

    // Fetch the product details
    const productResult = await pool.query(GET_PRODUCT_NAME, [product_id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Construct and return the response
    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: {
        id: updatedItem.id,
        product_id: updatedItem.product_id,
        quantity: updatedItem.quantity,
        product_name: productResult.rows[0].product_name,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the cart",
      error: error.message,
    });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  const { product_id } = req.params;
  const user_id = req.user.id;

  try {
    // Delete the product from the cart
    const deleteResult = await pool.query(
      DELETE_CART_ITEM_BY_USER_AND_PRODUCT,
      [user_id, product_id]
    );

    if (deleteResult.rows.length === 0) {
      // If no rows were deleted, the product wasn't in the cart
      return res.status(404).json({
        message: "Product not found in the cart",
      });
    }

    // Fetch the product name for the response
    const productResult = await pool.query(
      GET_PRODUCT_NAME,
      [product_id]
    );

    // Return a successful response with the product name
    res.status(200).json({
      message: `${productResult.rows[0].product_name} has been removed from your cart.`,
      product_id: parseInt(product_id, 10),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing item from cart",
      error,
    });
  }
};

// Clear all items from the user's cart
const clearCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    await pool.query(CLEAR_CART_BY_USER, [user_id]);
    res.status(200).json({ message: "Cart has been cleared." });
  } catch (error) {
    res
      .status(500)
      .json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR, error });
  }
};

// Check if a specific product is in the user's cart and return the quantity
const checkCartItemQuantity = async (req, res) => {
  const { product_id } = req.body; // Get product_id from request body
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      CHECK_CART_ITEM_QUANTITY_BY_USER_AND_PRODUCT,
      [user_id, product_id]
    );

    if (result.rows.length > 0) {
      const product = result.rows[0];
      res.status(200).json({
        message: "Product found in your cart.",
        product: product.product_name,
        quantity: product.quantity,
      });
    } else {
      res.status(201).json({
        message: "Product not found in your cart.",
        product: product.product_name,
        quantity: 0,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error checking cart item quantity.",
      err,
    });
  }
};

// Get product recommendations based on the items in the user's cart
const getProductRecommendations = async (req, res) => {
  const user_id = req.user.id;

  try {
    // Fetch the product categories of the user's cart items
    const cartProducts = await pool.query(
      GET_CART_PRODUCTS_CATEGORIES_BY_USER,
      [user_id]
    );

    if (cartProducts.rows.length === 0) {
      return res.status(404).json({
        message: "No products found in your cart for recommendations.",
      });
    }

    const category_ids = cartProducts.rows.map((row) => row.category_id);

    // Fetch recommended products based on the cart's categories
    const recommendedProducts = await pool.query(
      "SELECT id, product_name, category_id, sales_price FROM Products WHERE category_id = ANY($1::int[]) AND id NOT IN (SELECT product_id FROM Carts WHERE user_id = $2) LIMIT 5",
      [category_ids, user_id]
    );

    if (recommendedProducts.rows.length > 0) {
      res.status(200).json({
        message: "Here are some recommended products based on your cart items:",
        recommendations: recommendedProducts.rows.map((product) => ({
          product_id: product.id,
          product_name: product.product_name,
          category_id: product.category_id,
          sales_price: product.sales_price,
        })),
      });
    } else {
      res.status(404).json({
        message: "No recommendations found based on your cart items.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product recommendations.",
      error: error.message,
    });
  }
};

export {
  getCart,
  updateCart,
  removeItemFromCart,
  addItemToCart,
  clearCart,
  checkCartItemQuantity,
  getProductRecommendations,
};
