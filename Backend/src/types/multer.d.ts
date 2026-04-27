declare module "multer" {
	type Callback = (error: Error | null, acceptFile?: boolean) => void;

	const multer: any;
	namespace multer {
		type Options = {
			fileFilter?: (req: any, file: any, cb: Callback) => void;
		};
		function diskStorage(options: {
			destination: (req: any, file: any, cb: (error: Error | null, destination: string) => void) => void;
			filename: (req: any, file: any, cb: (error: Error | null, filename: string) => void) => void;
		}): any;
	}

	export = multer;
}
