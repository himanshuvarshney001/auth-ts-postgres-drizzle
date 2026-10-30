import express from "express";
import type { Express } from "express";
import ApiResponse from "../common/utils/api.response.js";
import { authRouter } from "./auth/routes.js";
import cookieParser from "cookie-parser";
import ApiError from "../common/utils/api.error.js";
import type { Request, Response, NextFunction } from "express";


export function createApplication(): Express {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    // middleware

    // route
    app.use("/api/auth", authRouter);
    app.use((req, res, next) => {         // 3. 404
        next(ApiError.notFound(`Route ${req.originalUrl} not found`));
    });
    app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof ApiError && err.isOperational) {
            res.status(err.statusCode).json({ success: false, message: err.message })
            return;
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    });
    return app;
}