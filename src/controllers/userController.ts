import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendVerificationEmail } from "../utils/email.js";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({
      message: "Pengguna berhasil didaftarkan. Silakan verifikasi email Anda.",
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal registrasi", error });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    const user = await User.findByPk(decoded.id);
    if (user) {
      user.isVerified = true;
      await user.save();
      res.json({ message: "Email berhasil diverifikasi" });
    } else {
      res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Token tidak valid atau telah kadaluarsa" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Email atau kata sandi salah" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: "Silakan verifikasi email Anda" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal login" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Pengguna tidak ditemukan" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Kata sandi berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: "Gagal mereset kata sandi" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      res.json({ message: "Pengguna berhasil dihapus" });
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus pengguna" });
  }
};
