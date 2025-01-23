// models\user.models.mjs
import { DataTypes } from "sequelize";

export const defineUserModel = (sequelize) =>
     sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [2, 100],
                },
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [8, Infinity],
                },
            },
            role: {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: {
                    isIn: [["admin", "customer"]],
                },
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "Users",
            timestamps: false,
        }
    );
