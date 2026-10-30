import express from "express";
import type { Express } from "express";
import ApiResponse from "../common/utils/api.response.js";
export function createApplication():Express {
    const app = express();
    
    // middleware

    // route
    app.use("/", (req, res) => {
        ApiResponse.ok(res,"Everthing fine");
    });

    return app;
}