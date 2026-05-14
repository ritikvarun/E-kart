import express from "express";
import { loginOrSingup } from "../controllers/user.js";

const router = express.Router();
router.post("/login", loginOrSingup);

export default router;
