export declare class ApplicationError extends Error {
    readonly httpCode: number;
    readonly statusCode: string;
    constructor(httpCode: number, statusCode: string, message: string);
}
export declare class NotFoundException extends ApplicationError {
    readonly message: string;
    constructor(message: string);
}
export declare class ConcurrencyException extends ApplicationError {
    readonly message: string;
    constructor(message: string);
}
export declare class DomainException extends ApplicationError {
    readonly message: string;
    constructor(message: string);
}
//# sourceMappingURL=Errors.d.ts.map