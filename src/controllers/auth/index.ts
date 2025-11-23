import express from "express";
import { CreateUserDto } from "@/lib/dto/auth/CreateUserDto";
import { validateDto } from "@/middlewares/validate";
import { refresh } from "./refresh";
import { signIn } from "./sign-in";
import { signOut } from "./sign-out";
import { signUp } from "./sign-up";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", validateDto(CreateUserDto), signUp);
router.post("/sign-out", signOut);
router.post("/refresh", refresh);

export default router;
