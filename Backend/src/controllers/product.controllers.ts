import { Request, Response } from "express";
import { productService } from "../services/product.services";
import { validatePagination } from "../utils/common_functions";
import { ApiError } from "../utils/api_error";
import { GLOBAL_ERROR_MESSAGES } from "../constants/app.messages";
import { getLogger } from "../lib/logger";
import { UploadedFile } from "../types/upload";

const logger = getLogger("product.controller");

const handleError = (res: Response, error: unknown) => {
	if (error instanceof ApiError) {
		return res.status(error.code).json(error.errors.length ? { message: error.message, errors: error.errors } : { message: error.message, error: error.message });
	}
	logger.error("Product unexpected error", { error: (error as Error).message });
	return res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR, error });
};

const uploadedFiles = (req: Request) => (Array.isArray(req.files) ? req.files : []) as UploadedFile[];

const createProduct = async (req: Request, res: Response) => {
	try {
		const result = await productService.createProduct(req.body, uploadedFiles(req));
		return res.status(201).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const searchProductsByName = async (req: Request, res: Response) => {
	try {
		const { page, limit, offset } = validatePagination(req);
		const result = await productService.searchProductsByName(String(req.params.product_name), page, limit, offset);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const getProductsByCategory = async (req: Request, res: Response) => {
	try {
		const { page, limit, offset } = validatePagination(req);
		const result = await productService.getProductsByCategory(Number(req.params.category_id), page, limit, offset);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const createCategory = async (req: Request, res: Response) => {
	try {
		const result = await productService.createCategory(req.body.category_name);
		return res.status("message" in result ? 200 : 201).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const getAllProducts = async (req: Request, res: Response) => {
	try {
		const { page, limit, offset } = validatePagination(req);
		const result = await productService.getAllProducts(page, limit, offset);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const getProductById = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) return res.status(400).json({ error: "id is an integer" });
		const product = await productService.getProductById(id);
		return res.status(200).json(product);
	} catch (error) {
		return handleError(res, error);
	}
};

const getCategories = async (_req: Request, res: Response) => {
	try {
		const categories = await productService.getCategories();
		return res.status(200).json(categories);
	} catch (error) {
		return handleError(res, error);
	}
};

const deleteProduct = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) return res.status(400).json({ error: "id is an integer" });
		const result = await productService.deleteProduct(id);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const updateProduct = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) return res.status(400).json({ error: "id is an integer" });
		const result = await productService.updateProduct(id, req.body, uploadedFiles(req));
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

export {
	createProduct,
	searchProductsByName,
	getProductsByCategory,
	createCategory,
	getAllProducts,
	getProductById,
	deleteProduct,
	getCategories,
	updateProduct,
};
