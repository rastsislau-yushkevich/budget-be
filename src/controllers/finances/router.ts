import express from "express";
import { authMiddleware } from "@/middlewares/auth";
import { spending, transactions, sync } from "./index";

const router = express.Router();

router.get("/transactions", authMiddleware, transactions);
router.get("/spending", authMiddleware, spending);
router.post("/sync", authMiddleware, sync);

export default router;
