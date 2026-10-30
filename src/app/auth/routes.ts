import express from "express";
import { Router } from "express";
import ApiResponse from "../../common/utils/api.response.js";

export const authRouter: Router = Router();
authRouter.get("/", (req, res) => {
    ApiResponse.ok(res, "this is request handled by auth servise");
}
)

