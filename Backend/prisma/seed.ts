import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "../src/constants/config";
import { moduleLogger } from "../src/lib/logger";

const logger = moduleLogger();

const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
	"Electronics",
	"Clothing",
	"Home Appliances",
	"Books",
	"Toys",
	"Beauty & Personal Care",
	"Sports & Outdoors",
	"Furniture",
	"Automotive",
	"Food & Beverages",
];

const products = [
	["Smartphone", 500, 600, ["image1.jpg", "image2.jpg", "image3.jpg"], 1, 50],
	["Laptop", 1000, 1200, ["image4.jpg", "image5.jpg"], 1, 30],
	["Headphones", 100, 150, ["image6.jpg"], 1, 100],
	["Smartwatch", 150, 200, ["image7.jpg", "image8.jpg", "image9.jpg"], 1, 70],
	["Camera", 400, 500, ["image10.jpg", "image11.jpg"], 1, 40],
	["T-shirt", 20, 30, ["image12.jpg", "image13.jpg"], 2, 150],
	["Jeans", 40, 50, ["image14.jpg"], 2, 80],
	["Jacket", 60, 80, ["image15.jpg", "image16.jpg"], 2, 60],
	["Sweater", 30, 40, ["image17.jpg"], 2, 100],
	["Shorts", 25, 35, ["image18.jpg", "image19.jpg"], 2, 120],
	["Blender", 50, 70, ["image20.jpg"], 3, 60],
	["Microwave", 150, 200, ["image21.jpg", "image22.jpg"], 3, 40],
	["Vacuum Cleaner", 100, 150, ["image23.jpg"], 3, 50],
	["Refrigerator", 500, 600, ["image24.jpg", "image25.jpg"], 3, 30],
	["Washing Machine", 300, 400, ["image26.jpg", "image27.jpg"], 3, 20],
	["Fiction Book", 10, 15, ["image28.jpg"], 4, 100],
	["Science Book", 20, 30, ["image29.jpg", "image30.jpg"], 4, 80],
	["Cookbook", 15, 25, ["image31.jpg"], 4, 120],
	["Biography", 25, 35, ["image32.jpg"], 4, 60],
	["Children Book", 8, 12, ["image33.jpg", "image34.jpg", "image35.jpg"], 4, 150],
	["Lego Set", 30, 40, ["image36.jpg", "image37.jpg"], 5, 100],
	["Doll", 15, 20, ["image38.jpg", "image39.jpg"], 5, 120],
	["Action Figure", 20, 25, ["image40.jpg"], 5, 80],
	["Toy Car", 10, 15, ["image41.jpg"], 5, 150],
	["Puzzle", 12, 18, ["image42.jpg", "image43.jpg"], 5, 130],
	["Shampoo", 10, 15, ["image44.jpg"], 6, 200],
	["Lipstick", 5, 10, ["image45.jpg", "image46.jpg"], 6, 150],
	["Face Cream", 20, 25, ["image47.jpg"], 6, 100],
	["Perfume", 30, 40, ["image48.jpg"], 6, 80],
	["Nail Polish", 7, 12, ["image49.jpg", "image50.jpg"], 6, 180],
	["Tennis Racket", 50, 60, ["image51.jpg", "image52.jpg"], 7, 40],
	["Football", 20, 25, ["image53.jpg"], 7, 100],
	["Yoga Mat", 15, 20, ["image54.jpg"], 7, 120],
	["Basketball", 25, 30, ["image55.jpg"], 7, 60],
	["Golf Club", 100, 150, ["image56.jpg", "image57.jpg"], 7, 30],
	["Sofa", 300, 350, ["image58.jpg", "image59.jpg"], 8, 20],
	["Dining Table", 200, 250, ["image60.jpg"], 8, 15],
	["Chair Set", 100, 130, ["image61.jpg", "image62.jpg"], 8, 40],
	["Bed Frame", 250, 300, ["image63.jpg", "image64.jpg"], 8, 10],
	["Bookshelf", 120, 160, ["image65.jpg"], 8, 25],
] as const;

async function main() {
	logger.info("Database seed started");
	for (const categoryName of categories) {
		await prisma.category.upsert({
			where: { id: categories.indexOf(categoryName) + 1 },
			update: { categoryName },
			create: { categoryName },
		});
	}

	for (const [productName, salesPrice, mrp, images, categoryId, stock] of products) {
		const existing = await prisma.product.findFirst({ where: { productName } });
		if (existing) {
			await prisma.product.update({ where: { id: existing.id }, data: { salesPrice, mrp, images: [...images], categoryId, stock } });
		} else {
			await prisma.product.create({ data: { productName, salesPrice, mrp, images: [...images], categoryId, stock } });
		}
	}
	logger.info("Database seed completed", { categories: categories.length, products: products.length });
}

main()
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	})
	.catch(async (error) => {
		logger.error("Database seed failed", { error: (error as Error).message, stack: (error as Error).stack });
		process.exit(1);
	});
