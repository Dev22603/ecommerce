
import { Product, Cart } from "../db/db.mjs";

// Add to Cart
const addItemToCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        // Check if the product already exists in the user's cart
        const existingItem = await Cart.findOne({
            where: { user_id, product_id },
            attributes: ["id", "quantity"],
        });

        if (existingItem) {
            // If product already exists, update the quantity (increment by 1)
            existingItem.quantity += 1;
            await existingItem.save();

            // Fetch the product name
            const product = await Product.findByPk(product_id);

            res.status(200).json({
                id: existingItem.id,
                product_id: existingItem.product_id,
                quantity: existingItem.quantity,
                product_name: product.product_name,
            });
        } else {
            // If product doesn't exist, insert as a new item with quantity = 1
            const newCartItem = await Cart.create({
                user_id,
                product_id,
                quantity: 1,
            });

            // Fetch the product name
            const product = await Product.findByPk(product_id);

            res.status(201).json({
                id: newCartItem.id,
                product_id: newCartItem.product_id,
                quantity: newCartItem.quantity,
                product_name: product.product_name,
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding item to cart", error });
    }
};

// Get user's cart
const getCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    attributes: ["id", "product_name", "images"],
                },
            ],
        });

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
};

// Update cart item
const updateCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    try {
        const cartItem = await Cart.findOne({
            where: { user_id, product_id },
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        const product = await Product.findByPk(product_id);

        res.status(200).json({
            id: cartItem.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            product_name: product.product_name,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating cart item", error });
    }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;

    try {
        const cartItem = await Cart.findOne({
            where: { user_id, product_id },
        });

        if (!cartItem) {
            return res
                .status(404)
                .json({ message: "Product not found in the cart" });
        }

        await cartItem.destroy();

        const product = await Product.findByPk(product_id);

        res.status(200).json({
            message: `${product.product_name} has been removed from your cart.`,
            product_id: parseInt(product_id, 10),
        });
    } catch (error) {
        res.status(500).json({
            message: "Error removing item from cart",
            error,
        });
    }
};

// Increment quantity of a product in the cart
const incrementQuantity = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        const cartItem = await Cart.findOne({
            where: { user_id, product_id },
        });

        if (!cartItem) {
            return res
                .status(404)
                .json({ message: "Product not found in the cart" });
        }

        cartItem.quantity += 1;
        await cartItem.save();

        const product = await Product.findByPk(product_id);

        res.status(200).json({
            message: `${product.product_name} quantity has been incremented.`,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error incrementing cart item quantity",
            error,
        });
    }
};

// Decrement quantity of a product in the cart
const decrementQuantity = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        const cartItem = await Cart.findOne({
            where: { user_id, product_id },
        });

        if (!cartItem) {
            return res
                .status(404)
                .json({ message: "Product not found in the cart" });
        }

        // Ensure quantity doesn't go below 1
        cartItem.quantity = cartItem.quantity > 1 ? cartItem.quantity - 1 : 1;
        await cartItem.save();

        const product = await Product.findByPk(product_id);

        res.status(200).json({
            message: `${product.product_name} quantity has been decremented.`,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error decrementing cart item quantity",
            error,
        });
    }
};

// Clear all items from the user's cart
const clearCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        await Cart.destroy({
            where: { user_id },
        });
        res.status(200).json({ message: "Cart has been cleared." });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
};

// Get the total cost of the items in the user's cart
const getCartTotal = async (req, res) => {
    const user_id = req.user.id;

    try {
        const result = await Cart.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    attributes: ["sales_price"],
                },
            ],
        });

        const totalAmount = result.reduce(
            (acc, item) => acc + item.quantity * item.Product.sales_price,
            0
        );
        const totalQuantity = result.reduce(
            (acc, item) => acc + item.quantity,
            0
        );

        res.status(200).json({
            total_amount: totalAmount,
            total_quantity: totalQuantity,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart total", error });
    }
};

// Check if a specific product is in the user's cart
const checkCartItemQuantity = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        const cartItem = await Cart.findOne({
            where: { user_id, product_id },
            include: [
                {
                    model: Product,
                    attributes: ["product_name"],
                },
            ],
        });

        if (cartItem) {
            res.status(200).json({
                message: `${cartItem.Product.product_name} is in your cart.`,
                product_id: product_id,
                quantity: cartItem.quantity,
            });
        } else {
            res.status(404).json({
                message: "Product not found in your cart.",
                product_id: product_id,
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

// Get product recommendations based on cart items
const getProductRecommendations = async (req, res) => {
    const user_id = req.user.id;

    try {
        const cartProducts = await Cart.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    attributes: ["category_id"],
                },
            ],
        });

        if (cartProducts.length === 0) {
            return res.status(404).json({
                message: "No products found in your cart for recommendations.",
            });
        }

        const category_ids = cartProducts.map(
            (item) => item.Product.category_id
        );

        const recommendedProducts = await Product.findAll({
            where: {
                category_id: { [Sequelize.Op.in]: category_ids },
                id: {
                    [Sequelize.Op.notIn]: cartProducts.map(
                        (item) => item.product_id
                    ),
                },
            },
            limit: 5,
            attributes: ["id", "product_name", "sales_price"],
        });

        res.status(200).json({
            message:
                "Here are some recommended products based on your cart items:",
            recommendations: recommendedProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching product recommendations.",
            error,
        });
    }
};

export {
    addItemToCart,
    getCart,
    updateCart,
    removeItemFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getCartTotal,
    checkCartItemQuantity,
    getProductRecommendations,
};
