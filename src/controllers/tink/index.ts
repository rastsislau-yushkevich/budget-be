import express from "express";
import { authMiddleware } from "@/middlewares/auth";
import { callback } from "./callback";
import { connect } from "./connect";

const router = express.Router();

router.post("/connect", authMiddleware, connect);
router.post("/callback", authMiddleware, callback);

export default router;
