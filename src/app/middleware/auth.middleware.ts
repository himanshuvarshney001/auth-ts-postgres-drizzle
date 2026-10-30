import ApiError from "../../common/utils/api.error.js";
import { verifyAccessToken, type TokenPayload } from "../../common/utils/jwt.utils.js";
import { Request, Response, NextFunction } from "express";
import { db } from "../../db/index.js"
import { userTable } from "../../db/schema.js"
import { eq } from "drizzle-orm";

export function authenticateMiddleware() {
    return async function (req: Request, res: Response, next: NextFunction) {
        let token: string | undefined;
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            throw ApiError.unauthorized("Not authorized");
        }
        let decoded: TokenPayload;
        try {
            decoded = verifyAccessToken(token);
        } catch {
            throw ApiError.unauthorized("Invalid or expire token");
        }
        const [user] = await db
            .select({ id: userTable.id, email: userTable.email, firstName: userTable.firstName })
            .from(userTable)
            .where(eq(userTable.id, decoded.id));
        if (!user) {
            throw ApiError.unauthorized("User no longer exist");
        }
        req.user = user;
        next();
    }
}
