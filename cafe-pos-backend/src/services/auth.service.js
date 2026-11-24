import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

// Helper untuk membuat JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

export const registerCustomer = async ({ name, email, password }) => {
  // 1. Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email sudah terdaftar. Silakan gunakan email lain atau login.", 409);
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Simpan user baru dengan role CUSTOMER
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken(newUser);

  return { user: newUser, token };
};

export const loginUser = async ({ email, password }) => {
  // 1. Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Email atau password salah.", 401);
  }

  // 2. Pastikan akun tidak dinonaktifkan oleh Admin
  if (!user.isActive) {
    throw new AppError("Akun Anda telah dinonaktifkan. Hubungi Admin cafe.", 403);
  }

  // 3. Bandingkan password input dengan hash bcrypt di database
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError("Email atau password salah.", 401);
  }

  // 4. Buat token JWT & buang field password sebelum dikirim ke client
  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User tidak ditemukan.", 404);
  }

  return user;
};