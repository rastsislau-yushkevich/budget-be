import express from "express";
import { SignInDto, SignUpDto } from "@/lib/dto/auth";
import { validateDto } from "@/middlewares/validate";
import { refresh } from "./refresh";
import { signIn } from "./sign-in";
import { signUp } from "./sign-up";
import { connect } from "../tink/connect";
import { authMiddleware } from "@/middlewares/auth";

const router = express.Router();

router.post("/sign-in", validateDto(SignInDto), signIn);
router.post("/sign-up", validateDto(SignUpDto), signUp);
router.post("/refresh", refresh);

export default router;
