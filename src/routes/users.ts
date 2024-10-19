import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  resetPassword,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateToken, roleCheck } from "../middleware/auth.js";

const router = Router();

// Registrasi pengguna
router.post("/register", register);

// Verifikasi email
router.get("/verify/:token", verifyEmail);

// Login pengguna
router.post("/login", login);

// Reset password
router.post("/reset-password", resetPassword);

// Mendapatkan semua pengguna (hanya untuk admin)
router.get("/", authenticateToken, roleCheck(["admin"]), getUsers);

// Menghapus pengguna (hanya untuk admin)
router.delete("/:id", authenticateToken, roleCheck(["admin"]), deleteUser);

export default router;
