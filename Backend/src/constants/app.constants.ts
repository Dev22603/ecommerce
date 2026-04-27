const REGEX = {
	EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
	PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
	PHONE: /^[0-9]{10}$/,
	PINCODE: /^[1-9][0-9]{5}$/,
};

const LIMITS = {
	NAME_MIN: 2,
	NAME_MAX: 100,
	PASSWORD_MIN: 8,
	PAGE_DEFAULT: 1,
	LIMIT_DEFAULT: 10,
	MAX_FILE_SIZE: 10 * 1024 * 1024,
};

enum ROLES {
	ADMIN = "admin",
	CUSTOMER = "customer",
}

enum ORDER_STATUS {
	PENDING = "pending",
	DELIVERED = "delivered",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}

const ORDER_STATUS_VALUES = [
	ORDER_STATUS.PENDING,
	ORDER_STATUS.DELIVERED,
	ORDER_STATUS.COMPLETED,
	ORDER_STATUS.CANCELLED,
];

const UPLOAD_CONFIG = {
	ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
	ALLOWED_EXTENSIONS: /jpeg|jpg|png|webp/,
	MAX_FILES: 5,
};

export { REGEX, LIMITS, ROLES, ORDER_STATUS, ORDER_STATUS_VALUES, UPLOAD_CONFIG };
