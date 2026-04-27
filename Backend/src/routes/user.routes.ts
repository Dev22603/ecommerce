import express from "express";
import { getAllUsers } from "../controllers/user.controllers";
import { authenticate, authorize } from "../middlewares/auth";
import { ROLES } from "../constants/app.constants";

const router = express.Router();

router.get("/", authenticate, authorize([ROLES.ADMIN]), getAllUsers);

export default router;
