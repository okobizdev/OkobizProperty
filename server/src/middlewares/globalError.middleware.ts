import { NextFunction, Request, Response } from "express";

export const globalErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Error Middleware:", err);
  console.error("Request URL:", req);

  // Log the error details for debugging
  res.status(500).json({
    status: "error",
     message: err?.message || "Internal server error", // <-- use the error message if available
    errors: [
      err?.message || "The server failed to respond. Please try again later.",
      "The server may be experiencing temporary issues or may have become unresponsive.",
      "If the problem persists, it could indicate a more serious backend issue that requires attention.",
    ],
  });
  return;
};
