// utils/responseHelper.js

export const successRes = (
  res,
  data = {},
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorRes = (
  res,
  errorMessage = "Something went wrong",
  status = 500
) => {
  return res.status(status).json({
    success: false,
    message: errorMessage,
  });
};
