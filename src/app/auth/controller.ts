import ApiError from "../../common/utils/api.error.js";
import ApiResponse from "../../common/utils/api.response.js";
import { Request, Response } from "express";
import { signInPayloadModel, signPayloadModel } from "./models.js";
import { userTable } from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import * as tokens from "../../common/utils/jwt.utils.js";
import crypto from "node:crypto";

const hashToken = (rawToken:string) => {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
}
class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        const validationResult = await signPayloadModel.safeParseAsync(req.body);
        if (validationResult.error) {
            return res.status(400).json({
                message: 'body validation failed', error: validationResult.error.issues
            });
        }
        const { firstName, lastName, email, password } = validationResult.data;
        const userEmailResult = await db.select().from(userTable).where(eq(userTable.email, email));
        if (userEmailResult.length > 0)
            return res.status(400).json({ error: 'duplicate entry', message: `user with this email ${email} already exist` });

        const salt = randomBytes(32).toString("hex");
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        const [result] = await db.insert(userTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning({ id: userTable.id });
        return res.status(201).json({
            message: 'user has been created successfully', data: { id: result?.id }
        });
    }

    public async handleSignIn(req: Request, res: Response) {
        const validationResult = await signInPayloadModel.safeParseAsync(req.body);
        if (validationResult.error) {
            throw ApiError.badRequest("body validiation failed");
        }
        const { email, password } = validationResult.data;
        const [userSelect] = await db.select().from(userTable).where(eq(userTable.email, email));
        if (!userSelect || !userSelect.salt) {
            throw ApiError.unauthorized("Invalid email or passoword");
        }
        const salt = userSelect.salt
        const hash = createHmac('sha256', salt).update(password).digest('hex');
        if (userSelect.password !== hash)
            throw ApiError.unauthorized("Invalid email or password");

        const accessToken = tokens.generateAccessToken({ id: userSelect.id });
        const refreshToken = tokens.generateRefreshToken({ id: userSelect.id });
        const hashedToken = hashToken(refreshToken);

        await db.update(userTable).set({ refreshToken: hashedToken }).where(eq(userTable.id, userSelect.id));
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return ApiResponse.ok(res, "Login Successfully", { accessToken });
    }
}
export default AuthenticationController;