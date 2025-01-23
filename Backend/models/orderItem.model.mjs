// Backend\models\orderItem.mjs
import { DataTypes } from 'sequelize';  // Ensure DataTypes is imported from sequelize

export const defineOrderItemModel = (sequelize, Order, Product) => {
    const OrderItem = sequelize.define("OrderItem", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
        },
    });

    // Define relationships directly
    OrderItem.belongsTo(Order, {
        foreignKey: "order_id",
        onDelete: "CASCADE",
    });

    OrderItem.belongsTo(Product, {
        foreignKey: "product_id",
        onDelete: "CASCADE",
    });

    return OrderItem;
};

// // Backend\models\orderItem.mjs
// export default (sequelize, DataTypes) => {
// 	const OrderItem = sequelize.define("OrderItem", {
// 		id: {
// 			type: DataTypes.INTEGER,
// 			primaryKey: true,
// 			autoIncrement: true,
// 		},
// 		quantity: {
// 			type: DataTypes.INTEGER,
// 			allowNull: false,
// 			validate: {
// 				min: 1,
// 			},
// 		},
// 		price: {
// 			type: DataTypes.DECIMAL(10, 2),
// 		},
// 	});

// 	OrderItem.associate = (models) => {
// 		OrderItem.belongsTo(models.Order, {
// 			foreignKey: "order_id",
// 			onDelete: "CASCADE",
// 		});
// 		OrderItem.belongsTo(models.Product, {
// 			foreignKey: "product_id",
// 			onDelete: "CASCADE",
// 		});
// 	};

// 	return OrderItem;
// };
