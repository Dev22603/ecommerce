import { addressRepository } from "../repositories/address.repositories";
import { validateAddress } from "../schemas/address.schemas";
import { ApiError } from "../utils/api_error";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

export const addressService = {
	async createAddress(userId: number, data: unknown) {
		try {
			const parsed = validateAddress(data);
			const address = await addressRepository.create(userId, parsed);
			logger.info("Address created", { userId, addressId: address.id });
			return { success: true, address };
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Create address failed", { code: error.code, message: error.message, userId });
				throw error;
			}
			logger.error("Create address failed", { userId, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async getAddressesByUser(userId: number) {
		try {
			const addresses = await addressRepository.findByUser(userId);
			return { success: true, addresses };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Get addresses by user failed", { userId, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async updateAddress(id: number, data: unknown) {
		try {
			const parsed = validateAddress(data);
			const address = await addressRepository.update(id, parsed);
			if (!address) throw new ApiError(404, "Address not found or already deleted");
			logger.info("Address updated", { addressId: id });
			return { success: true, address };
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Update address failed", { code: error.code, message: error.message, id });
				throw error;
			}
			logger.error("Update address failed", { id, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async deleteAddress(userId: number, addressId: number) {
		try {
			const addresses = await addressRepository.findByUser(userId);
			const validAddress = addresses.find((address) => address.id === addressId);
			if (!validAddress) throw new ApiError(404, "Address not found for this user");

			const isUsed = await addressRepository.isUsedInOrders(addressId);
			if (isUsed) {
				await addressRepository.softDelete(addressId);
				logger.info("Address soft deleted", { userId, addressId });
				return { success: true, message: "Address soft deleted (in use)" };
			}

			await addressRepository.hardDelete(addressId);
			logger.info("Address deleted", { userId, addressId });
			return { success: true, message: "Address permanently deleted" };
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Delete address failed", { code: error.code, message: error.message, userId, addressId });
				throw error;
			}
			logger.error("Delete address failed", { userId, addressId, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async setDefaultAddress(userId: number, addressId: number) {
		try {
			const addresses = await addressRepository.findByUser(userId);
			const validAddress = addresses.find((address) => address.id === addressId);
			if (!validAddress) throw new ApiError(404, "Address not found for this user");
			await addressRepository.setDefault(userId, addressId);
			logger.info("Default address set", { userId, addressId });
			return { success: true, message: "Default address updated successfully" };
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Set default address failed", { code: error.code, message: error.message, userId, addressId });
				throw error;
			}
			logger.error("Set default address failed", { userId, addressId, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},
};
