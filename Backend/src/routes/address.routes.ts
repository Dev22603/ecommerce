import express from "express";
import { createAddress, deleteAddress, getAddressesByUser, setDefaultAddress, updateAddress } from "../controllers/address.controllers";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/", authenticate, createAddress);
router.get("/", authenticate, getAddressesByUser);
router.put("/:id", authenticate, updateAddress);
router.delete("/:id", authenticate, deleteAddress);
router.put("/:id/default", authenticate, setDefaultAddress);

export default router;
