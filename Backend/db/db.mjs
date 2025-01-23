// db\db.mjs
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { defineUserModel } from "../models/user.models.mjs";
import { defineCategoryModel } from "../models/category.model.mjs";
import { defineProductModel } from "../models/product.models.mjs";
import { defineCartModel } from "../models/cart.model.mjs";
import { defineOrderModel } from "../models/order.model.mjs";
import { defineOrderItemModel } from "../models/orderItem.model.mjs";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
    }
);

const User = defineUserModel(sequelize);
const Category = defineCategoryModel(sequelize);
const Product = defineProductModel(sequelize, Category);
const Cart = defineCartModel(sequelize, User, Product);
const Order = defineOrderModel(sequelize, User);
const OrderItem = defineOrderItemModel(sequelize, Order, Product);
const db = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");

        await sequelize.sync();
    } catch (error) {
        console.log("Connection failed", error);
    }
};

export { sequelize, db, User, Category, Product, Cart, Order, OrderItem };
