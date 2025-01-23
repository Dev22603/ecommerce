// models\category.model.mjs
import { DataTypes } from "sequelize";

export const defineCategoryModel = (sequelize) =>
    sequelize.define(
        "Category",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            category_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            tableName: "Categories",
            timestamps: false,
        }
    );
