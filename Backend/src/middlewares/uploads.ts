import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { LIMITS, UPLOAD_CONFIG } from "../constants/app.constants";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req: any, _file: any, cb: (error: Error | null, destination: string) => void) => {
		cb(null, uploadDir);
	},
	filename: (_req: any, file: { originalname: string }, cb: (error: Error | null, filename: string) => void) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (_req: any, file: { originalname: string; mimetype: string }, cb: (error: Error | null, acceptFile?: boolean) => void) => {
	const extname = UPLOAD_CONFIG.ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase());
	const mimetype = UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(file.mimetype);

	if (mimetype && extname) {
		cb(null, true);
	} else {
		logger.warn("Invalid file upload rejected", { originalname: file.originalname, mimetype: file.mimetype });
		cb(new Error("Only .jpeg, .jpg, .png, and .webp files are allowed!"));
	}
};

const upload = multer({
	storage,
	limits: { fileSize: LIMITS.MAX_FILE_SIZE },
	fileFilter,
});

const uploadProductImages = upload.array("images", UPLOAD_CONFIG.MAX_FILES);

const handleProductImageUpload = (req: Request, res: Response, next: NextFunction) => {
	uploadProductImages(req, res, (err: unknown) => {
		if (err) {
			if (err instanceof Error && err.name === "MulterError") {
				const multerErr = err as Error & { code?: string };
				if (multerErr.code === "LIMIT_FILE_SIZE") {
					logger.warn("Multer upload error", { code: multerErr.code, message: multerErr.message, userId: req.user?.id });
				} else {
					logger.error("Multer upload error", { code: multerErr.code, message: multerErr.message, userId: req.user?.id });
				}
				return res.status(400).json({ message: multerErr.message });
			}
			const message = err instanceof Error ? err.message : String(err);
			logger.warn("Upload rejected", { message, userId: req.user?.id });
			return res.status(400).json({ message });
		}
		const files = Array.isArray(req.files) ? req.files : [];
		if (files.length > 0) {
			logger.info("Product images uploaded", { fileCount: files.length, userId: req.user?.id });
		}
		next();
	});
};

export { handleProductImageUpload };
