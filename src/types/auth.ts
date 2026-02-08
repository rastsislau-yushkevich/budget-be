import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export interface AuthJwtPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
}
