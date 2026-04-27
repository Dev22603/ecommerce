import { addressRepository } from "../repositories/address.repositories";
import { validateAddress } from "../schemas/address.schemas";
import { ApiError } from "../utils/api_error";

export const addressService = {
	async createAddress(userId: number, data: unknown) {
		const parsed = validateAddress(data);
		const address = await addressRepository.create(userId, parsed);
		return { success: true, address };
	},

	async getAddressesByUser(userId: number) {
		const addresses = await addressRepository.findByUser(userId);
		return { success: true, addresses };
	},

	async updateAddress(id: number, data: unknown) {
		const parsed = validateAddress(data);
		const address = await addressRepository.update(id, parsed);
		if (!address) throw new ApiError(404, "Address not found or already deleted");
		return { success: true, address };
	},

	async deleteAddress(userId: number, addressId: number) {
		const addresses = await addressRepository.findByUser(userId);
		const validAddress = addresses.find((address) => address.id === addressId);
		if (!validAddress) throw new ApiError(404, "Address not found for this user");

		const isUsed = await addressRepository.isUsedInOrders(addressId);
		if (isUsed) {
			await addressRepository.softDelete(addressId);
			return { success: true, message: "Address soft deleted (in use)" };
		}

		await addressRepository.hardDelete(addressId);
		return { success: true, message: "Address permanently deleted" };
	},

	async setDefaultAddress(userId: number, addressId: number) {
		const addresses = await addressRepository.findByUser(userId);
		const validAddress = addresses.find((address) => address.id === addressId);
		if (!validAddress) throw new ApiError(404, "Address not found for this user");
		await addressRepository.setDefault(userId, addressId);
		return { success: true, message: "Default address updated successfully" };
	},
};
