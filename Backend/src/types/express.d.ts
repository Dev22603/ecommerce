import { ROLES } from "../constants/app.constants";

declare global {
	namespace Express {
		interface Request {
			user: {
				id: number;
				role: ROLES;
				name: string;
			};
			files?: Array<{
				filename: string;
				originalname: string;
				mimetype: string;
			}>;
		}
	}
}

export {};
