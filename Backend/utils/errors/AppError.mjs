export class AppError extends Error {
	constructor(message, errorType) {
		super(message);
		this.name = this.constructor.name;
		this.errorType = errorType;
	}
}