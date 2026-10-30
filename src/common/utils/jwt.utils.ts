import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { SignOptions } from "jsonwebtoken";
export interface TokenPayload{
    id:string
}

const generateAccessToken=(payload: TokenPayload):string=>{
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as SignOptions['expiresIn']
    })
}

const verifyAccessToken = (token:string) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
}

const generateRefreshToken=(payload: TokenPayload):string=>{
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"]
    });
}

const verifyRefreshToken=(refreshToken: string)=>{
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
}

const generateResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hashedToken };
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateResetToken,
}