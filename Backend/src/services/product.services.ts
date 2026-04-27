import { categoryRepository } from "../repositories/category.repositories";
import { productRepository } from "../repositories/product.repositories";
import { validateProduct, validateProductUpdate } from "../schemas/product.schemas";
import { ApiError } from "../utils/api_error";
import { PRODUCT_FEEDBACK_MESSAGES, PRODUCT_VALIDATION_ERRORS } from "../constants/app.messages";
import { UploadedFile } from "../types/upload";

export const productService = {
	async createProduct(body: unknown, files: UploadedFile[] = []) {
		const parsedBody = validateProduct(body);
		const categoryExists = await categoryRepository.existsById(parsedBody.category_id);
		if (!categoryExists) throw new ApiError(400, PRODUCT_VALIDATION_ERRORS.CATEGORY_NOT_FOUND);

		const imageURLs = files.map((file) => `/uploads/${file.filename}`);
		if (imageURLs.length === 0) throw new ApiError(400, PRODUCT_VALIDATION_ERRORS.IMAGE_REQUIRED);

		const product = await productRepository.create({ ...parsedBody, images: imageURLs });
		return { message: PRODUCT_FEEDBACK_MESSAGES.PRODUCT_ADDED_SUCCESS, data: product };
	},

	async createCategory(categoryName: unknown) {
		const category_name = String(categoryName ?? "").trim().toLowerCase();
		if (!category_name) throw new ApiError(400, "Category name is required");
		const categoryExists = await categoryRepository.existsByName(category_name);
		if (categoryExists) return { message: "Category already exists" };
		return await categoryRepository.create(category_name);
	},

	async getCategories() {
		return await categoryRepository.findAll();
	},

	async getAllProducts(page: number, limit: number, offset: number) {
		const { products, totalCount } = await productRepository.findPaginated(limit, offset);
		return {
			products,
			totalCount,
			page,
			limit,
			totalPages: Math.ceil(totalCount / limit),
			...(totalCount === 0 && { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCTS_FOUND }),
		};
	},

	async searchProductsByName(productName: string, page: number, limit: number, offset: number) {
		const { products, totalCount } = await productRepository.searchByName(productName, limit, offset);
		return {
			products,
			totalCount,
			page,
			limit,
			totalPages: Math.ceil(totalCount / limit),
			...(totalCount === 0 && { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCTS_FOUND }),
		};
	},

	async getProductsByCategory(categoryId: number, page: number, limit: number, offset: number) {
		const { products, totalCount } = await productRepository.findByCategory(categoryId, limit, offset);
		return {
			products,
			totalCount,
			page,
			limit,
			totalPages: Math.ceil(totalCount / limit),
			...(totalCount === 0 && { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCTS_FOUND }),
		};
	},

	async getProductById(id: number) {
		const product = await productRepository.findById(id);
		if (!product) throw new ApiError(404, PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCT_FOUND_BY_ID);
		return product;
	},

	async deleteProduct(id: number) {
		const product = await productRepository.delete(id);
		if (!product) return { message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCT_FOUND_BY_ID };
		return { message: "Product deleted" };
	},

	async updateProduct(id: number, body: unknown, files: UploadedFile[] = []) {
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
	},
};
