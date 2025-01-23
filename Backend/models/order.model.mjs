// Backend\models\order.mjs
import { DataTypes } from 'sequelize';  // Ensure DataTypes is imported from sequelize

export const defineOrderModel = (sequelize, User, OrderItem) => {
    const Order = sequelize.define("Order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.ENUM(
                "Pending",
                "Shipped",
                "Completed",
                "Cancelled"
            ),
            defaultValue: "Pending",
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    // Define relationships directly
    Order.belongsTo(User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
    });

    // Order.hasMany(OrderItem, {
    //     foreignKey: "order_id",
    //     onDelete: "CASCADE",
    // });

    return Order;
};

// // Backend\models\order.mjs
// export default (sequelize, DataTypes) => {
// 	const Order = sequelize.define("Order", {
// 		id: {
// 			type: DataTypes.INTEGER,
// 			primaryKey: true,
// 			autoIncrement: true,
// 		},
// 		status: {
// 			type: DataTypes.ENUM(
// 				"Pending",
// 				"Shipped",
// 				"Completed",
// 				"Cancelled"
// 			),
// 			defaultValue: "Pending",
// 		},
// 		total_amount: {
// 			type: DataTypes.DECIMAL(10, 2),
// 		},
// 		created_at: {
// 			type: DataTypes.DATE,
// 			defaultValue: DataTypes.NOW,
// 		},
// 	});

// 	Order.associate = (models) => {
// 		Order.belongsTo(models.User, {
// 			foreignKey: "user_id",
// 			onDelete: "CASCADE",
// 		});
// 		Order.hasMany(models.OrderItem, {
// 			foreignKey: "order_id",
// 			onDelete: "CASCADE",
// 		});
// 	};

// 	return Order;
// };
