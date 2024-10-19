import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  role: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Akses ditolak, token tidak ditemukan!" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = user as JwtPayload;
    next();
  });
};

export const roleCheck =
  (roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req?.user?.role as string)) {
      res.status(403).json({ message: "Dilarang: Hak akses tidak diizinkan" });
      return;
    }
    next();
  };
