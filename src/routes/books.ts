import { Router } from "express";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { authenticateToken, roleCheck } from "../middleware/auth.js";

const router = Router();

router.get("/", getBooks);

router.post("/", authenticateToken, roleCheck(["user", "admin"]), addBook);

router.put("/:id", authenticateToken, roleCheck(["user", "admin"]), updateBook);

router.delete("/:id", authenticateToken, roleCheck(["admin"]), deleteBook);

export default router;
