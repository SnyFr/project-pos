export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Tampilkan semua field yang salah sekaligus, bukan berhenti di error pertama
      stripUnknown: true, // Hapus field liar yang tidak ada di skema Joi (keamanan ekstra!)
    });

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    req.body = value; // Ganti req.body dengan data yang sudah dibersihkan Joi (trim/lowercase)
    next();
  };
};