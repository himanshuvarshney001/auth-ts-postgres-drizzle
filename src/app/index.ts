import express from "express";
import type { Express } from "express";
export function createApplication():Express {
    const app = express();
    
    // middleware

    // route
    app.use("/", (req, res) => {
        res.json(res.json({
            success: true,
            message: "hello himanshu"
        }));
    });

    return app;
}