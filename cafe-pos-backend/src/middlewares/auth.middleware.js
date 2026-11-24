import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

// 1. Verifikasi apakah user sudah login (membawa Bearer Token valid)
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Akses ditolak. Token autentikasi tidak ditemukan.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tempelkan data payload JWT ({ id, role, email }) ke objek req
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new AppError("Token tidak valid atau sudah kedaluwarsa.", 401));
    }
    next(err);
  }
};

// 2. Role-Based Access Control (RBAC): Batasi endpoint hanya untuk role tertentu
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Akses dilarang. Fitur ini hanya untuk role: ${allowedRoles.join(", ")}`,
          403
        )
      );
    }
    next();
  };
};