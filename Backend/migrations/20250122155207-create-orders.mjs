import { DataTypes } from "sequelize";

export default {
	async up(queryInterface) {
		await queryInterface.createTable("Orders", {
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
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
				onDelete: "CASCADE",
			},
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable("Orders");
	},
};
