export class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}