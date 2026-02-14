import express from "express";
import { authMiddleware } from "@/middlewares/auth";
import { callback } from "./callback";
import { connect } from "./connect";
import { disconnectController } from "./disconnect";

const router = express.Router();

router.post("/connect", authMiddleware, connect);
router.post("/callback", authMiddleware, callback);
router.delete("/connect", authMiddleware, disconnectController);

export default router;
