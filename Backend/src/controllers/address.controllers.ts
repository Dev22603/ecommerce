import { Request, Response } from "express";
import { addressService } from "../services/address.services";
import { ApiError } from "../utils/api_error";
import { GLOBAL_ERROR_MESSAGES } from "../constants/app.messages";

const handleError = (res: Response, error: unknown) => {
	if (error instanceof ApiError) {
		return res.status(error.code).json(error.errors.length ? { success: false, message: error.message, errors: error.errors } : { success: false, error: error.message });
	}
	return res.status(500).json({ success: false, message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR });
};

const createAddress = async (req: Request, res: Response) => {
	try {
		const result = await addressService.createAddress(req.user.id, req.body);
		return res.status(201).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const getAddressesByUser = async (req: Request, res: Response) => {
	try {
		const result = await addressService.getAddressesByUser(req.user.id);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const updateAddress = async (req: Request, res: Response) => {
	try {
		const result = await addressService.updateAddress(Number(req.params.id), req.body);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const deleteAddress = async (req: Request, res: Response) => {
	try {
		const result = await addressService.deleteAddress(req.user.id, Number(req.params.id));
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const setDefaultAddress = async (req: Request, res: Response) => {
	try {
		const result = await addressService.setDefaultAddress(req.user.id, Number(req.params.id));
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

export { getAddressesByUser, createAddress, updateAddress, deleteAddress, setDefaultAddress };
