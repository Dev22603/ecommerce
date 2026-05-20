import { prisma } from "../lib/prisma";
import { mapAddress } from "../utils/mappers";
import { getLogger } from "../lib/logger";

const logger = getLogger("address.repository");

export const addressRepository = {
	async create(userId: number, data: any) {
		try {
			const address = await prisma.address.create({
				data: {
					userId,
					fullName: data.full_name,
					phone: data.phone,
					pincode: data.pincode,
					houseNumber: data.house_number,
					area: data.area,
					landmark: data.landmark || null,
					city: data.city,
					state: data.state,
					addressType: data.address_type,
				},
			});
			return mapAddress(address);
		} catch (error) {
			logger.error("DB error - createAddress", { userId, error: (error as Error).message });
			throw error;
		}
	},

	async findByUser(userId: number) {
		try {
			const addresses = await prisma.address.findMany({
				where: { userId, isDeleted: false },
				orderBy: { createdAt: "desc" },
			});
			return addresses.map(mapAddress);
		} catch (error) {
			logger.error("DB error - findAddressesByUser", { userId, error: (error as Error).message });
			throw error;
		}
	},

	async findRawById(id: number) {
		try {
			return await prisma.address.findUnique({ where: { id } });
		} catch (error) {
			logger.error("DB error - findRawAddressById", { id, error: (error as Error).message });
			throw error;
		}
	},

	async update(id: number, data: any) {
		try {
			const address = await prisma.address.update({
				where: { id },
				data: {
					fullName: data.full_name,
					phone: data.phone,
					pincode: data.pincode,
					houseNumber: data.house_number,
					area: data.area,
					landmark: data.landmark || null,
					city: data.city,
					state: data.state,
					addressType: data.address_type,
				},
			}).catch(() => null);
			return address && !address.isDeleted ? mapAddress(address) : null;
		} catch (error) {
			logger.error("DB error - updateAddress", { id, error: (error as Error).message });
			throw error;
		}
	},

	async isUsedInOrders(id: number) {
		try {
			return (await prisma.order.count({ where: { addressId: id } })) > 0;
		} catch (error) {
			logger.error("DB error - isAddressUsedInOrders", { id, error: (error as Error).message });
			throw error;
		}
	},

	async softDelete(id: number) {
		try {
			await prisma.address.update({ where: { id }, data: { isDeleted: true } });
		} catch (error) {
			logger.error("DB error - softDeleteAddress", { id, error: (error as Error).message });
			throw error;
		}
	},

	async hardDelete(id: number) {
		try {
			await prisma.address.delete({ where: { id } });
		} catch (error) {
			logger.error("DB error - hardDeleteAddress", { id, error: (error as Error).message });
			throw error;
		}
	},

	async setDefault(userId: number, addressId: number) {
		try {
			await prisma.$transaction([
				prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
				prisma.address.update({ where: { id: addressId }, data: { isDefault: true } }),
			]);
		} catch (error) {
			logger.error("DB error - setDefaultAddress", { userId, addressId, error: (error as Error).message });
			throw error;
		}
	},
};
