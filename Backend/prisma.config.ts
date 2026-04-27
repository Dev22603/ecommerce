import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
	process.env.DATABASE_URL ??
	`postgresql://${process.env.DB_USER ?? "postgres"}:${process.env.DB_PASSWORD ?? "root"}@${process.env.DB_HOST ?? "localhost"}:${process.env.DB_PORT ?? "5432"}/${process.env.DB_NAME ?? "ecommerce"}`;

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		seed: "tsx ./prisma/seed.ts",
	},
	datasource: {
		url: databaseUrl,
	},
});
