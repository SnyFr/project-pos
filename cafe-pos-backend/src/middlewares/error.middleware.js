export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Error bawaan dari validasi Joi
  if (err.isJoi) {
    return res.status(400).json({
      status: "fail",
      message: "Validasi input gagal",
      errors: err.details.map((detail) => detail.message),
    });
  }

  // Error custom yang kita lempar manual dengan statusCode (misal: stok habis, unauthorized)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server";

  return res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
  });
};