import express from "express";
import { authMiddleware } from "@/middlewares/auth";
import { connect } from "./connect";

const router = express.Router();

router.post("/connect", authMiddleware, connect);

export default router;
