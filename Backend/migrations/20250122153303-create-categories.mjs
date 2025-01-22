import { DataTypes } from "sequelize";

export default {
	async up(queryInterface) {
		await queryInterface.createTable("Categories", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			category_name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable("Categories");
	},
};
