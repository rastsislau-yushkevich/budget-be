import { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

export interface AuthJwtPayload extends JwtPayload {
    email: string;
    username: string;
}