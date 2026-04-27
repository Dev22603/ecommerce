import { prisma } from "../lib/prisma";
import { mapAddress } from "../utils/mappers";

export const addressRepository = {
	async create(userId: number, data: any) {
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
	},

	async findByUser(userId: number) {
		const addresses = await prisma.address.findMany({
			where: { userId, isDeleted: false },
			orderBy: { createdAt: "desc" },
		});
		return addresses.map(mapAddress);
	},

	async findRawById(id: number) {
		return await prisma.address.findUnique({ where: { id } });
	},

	async update(id: number, data: any) {
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
	},

	async isUsedInOrders(id: number) {
		return (await prisma.order.count({ where: { addressId: id } })) > 0;
	},

	async softDelete(id: number) {
		await prisma.address.update({ where: { id }, data: { isDeleted: true } });
	},

	async hardDelete(id: number) {
		await prisma.address.delete({ where: { id } });
	},

	async setDefault(userId: number, addressId: number) {
		await prisma.$transaction([
			prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
			prisma.address.update({ where: { id: addressId }, data: { isDefault: true } }),
		]);
	},
};
