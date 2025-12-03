import type { Response } from "express";
import { connect as connectService } from "@/services/tink/connect"
import { AuthJwtPayload, AuthRequest } from "@/types/auth";

export const connect = async (req: AuthRequest, res: Response) => {
    const tinkLink = await connectService({ username: (req.user as AuthJwtPayload).username });

    return res.json(tinkLink);
};