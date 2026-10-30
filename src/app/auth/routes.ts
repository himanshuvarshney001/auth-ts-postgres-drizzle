import express from "express";
import { Router } from "express";
import ApiResponse from "../../common/utils/api.response.js";
import AuthenticationController from "./controller.js";
export const authRouter: Router = Router();
const authcontroller = new AuthenticationController();
authRouter.post('/signup',authcontroller.handleSignup.bind(authcontroller));
authRouter.post('/signin', authcontroller.handleSignIn.bind(authcontroller));