import * as authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerCustomer(req.body);
    res.status(201).json({
      status: "success",
      message: "Registrasi pembeli berhasil",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};