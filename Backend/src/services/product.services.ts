import { categoryRepository } from "../repositories/category.repositories";
import { productRepository } from "../repositories/product.repositories";
import { validateProduct, validateProductUpdate } from "../schemas/product.schemas";
import { ApiError } from "../utils/api_error";
import { PRODUCT_FEEDBACK_MESSAGES, PRODUCT_VALIDATION_ERRORS } from "../constants/app.messages";
import { UploadedFile } from "../types/upload";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

export const productService = {
	async createProduct(body: unknown, files: UploadedFile[] = []) {
		try {
			const parsedBody = validateProduct(body);
			const categoryExists = await categoryRepository.existsById(parsedBody.category_id);
			if (!categoryExists) throw new ApiError(400, PRODUCT_VALIDATION_ERRORS.CATEGORY_NOT_FOUND);

			const imageURLs = files.map((file) => `/uploads/${file.filename}`);
			if (imageURLs.length === 0) throw new ApiError(400, PRODUCT_VALIDATION_ERRORS.IMAGE_REQUIRED);

			const product = await productRepository.create({ ...parsedBody, images: imageURLs });
			return { message: PRODUCT_FEEDBACK_MESSAGES.PRODUCT_ADDED_SUCCESS, data: product };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Create product failed", { product: (body as any)?.product_name, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async createCategory(categoryName: unknown) {
		try {
			const category_name = String(categoryName ?? "").trim().toLowerCase();
			if (!category_name) throw new ApiError(400, "Category name is required");
			const categoryExists = await categoryRepository.existsByName(category_name);
			if (categoryExists) return { message: "Category already exists" };
			return await categoryRepository.create(category_name);
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Create category failed", { categoryName, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async getCategories() {
		try {
			return await categoryRepository.findAll();
		} catch (error) {
			logger.error("Get categories failed", { error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async getAllProducts(page: number, limit: number, offset: number) {
		try {
			const { products, totalCount } = await productRepository.findPaginated(limit, offset);
			return {
				products,
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
				...(totalCount === 0 && { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCTS_FOUND }),
			};
		} catch (error) {
			logger.error("Get all products failed", { page, limit, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async searchProductsByName(productName: string, page: number, limit: number, offset: number) {
		try {
			const { products, totalCount } = await productRepository.searchByName(productName, limit, offset);
			return {
				products,
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
				...(totalCount === 0 && { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCTS_FOUND }),
			};
		} catch (error) {
			logger.error("Search products failed", { productName, page, limit, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async getProductsByCategory(categoryId: number, page: number, limit: number, offset: number) {
		try {
			const { products, totalCount } = await productRepository.findByCategory(categoryId, limit, offset);
			return {
				products,
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
				...(totalCount === 0 && { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCTS_FOUND }),
			};
		} catch (error) {
			logger.error("Get products by category failed", { categoryId, page, limit, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async getProductById(id: number) {
		try {
			const product = await productRepository.findById(id);
			if (!product) throw new ApiError(404, PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCT_FOUND_BY_ID);
			return product;
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Get product by id failed", { id, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async deleteProduct(id: number) {
		try {
			const product = await productRepository.delete(id);
			if (!product) return { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCT_FOUND_BY_ID };
			return { message: "Product deleted" };
		} catch (error) {
			logger.error("Delete product failed", { id, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async updateProduct(id: number, body: unknown, files: UploadedFile[] = []) {
		try {
			const existing = await productRepository.findById(id);
			if (!existing) throw new ApiError(404, PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCT_FOUND_BY_ID);

			const parsedBody = validateProductUpdate(body);
			if (parsedBody.category_id) {
				const categoryExists = await categoryRepository.existsById(parsedBody.category_id);
				if (!categoryExists) throw new ApiError(400, PRODUCT_VALIDATION_ERRORS.CATEGORY_NOT_FOUND);
			}

			const imageURLs = files.map((file) => `/uploads/${file.filename}`);
			const product = await productRepository.update(id, {
				...parsedBody,
				images: imageURLs.length > 0 ? imageURLs : existing.images,
			});

			return { message: PRODUCT_FEEDBACK_MESSAGES.PRODUCT_UPDATED_SUCCESS, data: product };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Update product failed", { id, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},
};
