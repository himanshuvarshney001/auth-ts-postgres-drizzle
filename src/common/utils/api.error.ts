class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.name = "apiError";
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message: string = "badrequst") {
        return new ApiError(400, message);
    }
    static unauthorized(message: string = "unathorized") {
        return new ApiError(401, message);
    }
    static conflict(message: string = "conflict") {
        return new ApiError(409, message);
    }
    static forbidden(message: string = "forbidden") {
        return new ApiError(403, message);
    }
    static notFound(message: string = "not found") {
        return new ApiError(404, message);
    }
    static internal(message: string = "internal server error") {
        return new ApiError(500, message);
    }

}

export default ApiError;