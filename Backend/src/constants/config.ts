import dotenv from "dotenv";
dotenv.config();

const databaseUrl =
	process.env.DATABASE_URL ??
	`postgresql://${process.env.DB_USER ?? "postgres"}:${process.env.DB_PASSWORD ?? "root"}@${process.env.DB_HOST ?? "localhost"}:${process.env.DB_PORT ?? "5432"}/${process.env.DB_NAME ?? "ecommerce"}`;

export const config = {
	PORT: process.env.PORT || 5000,
	NODE_ENV: process.env.NODE_ENV || "development",
	API_URL: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`,
	DB_USER: process.env.DB_USER || "postgres",
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_NAME: process.env.DB_NAME || "ecommerce",
	DB_PASSWORD: process.env.DB_PASSWORD || "root",
	DB_PORT: Number(process.env.DB_PORT || 5432),
	DATABASE_URL: databaseUrl,
	JWT_SECRET: process.env.JWT_SECRET || "secret",
	FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
