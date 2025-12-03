import express from "express";
import { connect } from "./connect";
import { authMiddleware } from "@/middlewares/auth";

const router = express.Router();

router.post("/connect", authMiddleware, connect);

export default router;
