// models\product.models.mjs

import { DataTypes } from 'sequelize';  // Ensure DataTypes is imported from sequelize

// Define the Product model as a function
const defineProductModel = (sequelize, Category) => {
    const Product = sequelize.define(
        "Product",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            product_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    len: [2, Infinity], // Product name must be at least 2 characters long
                },
            },
            ws_code: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                validate: {
                    min: 0, // ws_code must be a non-negative integer
                },
            },
            sales_price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1, // Sales price must be greater than 0
                },
            },
            mrp: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1, // MRP must be greater than 0
                    isGreaterThanSalesPrice(value) {
                        if (value < this.sales_price) {
                            throw new Error(
                                "MRP must be greater than or equal to the sales price"
                            );
                        }
                    },
                },
            },
            package_size: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1, // Package size must be greater than 0
                },
            },
            images: {
                type: DataTypes.ARRAY(DataTypes.TEXT), // Array of image URLs
                defaultValue: [],
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.TEXT), // Array of tags for the product
                defaultValue: [],
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0, // Stock must be non-negative
                },
            },
        },
        {
            tableName: "Products",
            timestamps: false, // If you don't have created_at/updated_at timestamps in the table
        }
    );

    // Set up the foreign key relationship with Category
    Product.belongsTo(Category, {
        foreignKey: "category_id",
        onDelete: "CASCADE",
    });

    return Product;
};

export { defineProductModel };
