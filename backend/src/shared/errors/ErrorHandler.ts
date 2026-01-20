import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err?.name === "ValidationError") {
    return res.status(400).json({
      error: err.name,
      message: err.message,
      fieldErrors: err.fieldErrors ?? {},
    });
  }

  if (typeof err?.statusCode === "number") {
    return res.status(err.statusCode).json({
      error: err.name ?? "Error",
      message: err.message ?? "Request failed",
    });
  }

  console.error("[ERROR] Unhandled error", err);

  return res.status(500).json({
    error: "InternalServerError",
    message: "Something went wrong",
  });
}
