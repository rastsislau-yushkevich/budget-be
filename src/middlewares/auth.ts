import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import { AuthJwtPayload, AuthRequest } from "@/types/auth";
import { env } from "@/env";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AuthJwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}