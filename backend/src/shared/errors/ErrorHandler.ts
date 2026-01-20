import type { Request, Response, NextFunction } from "express";

type ValidationError = {
  name: "ValidationError";
  statusCode: number;
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
};

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1) Validation errors from validateRequest
  if (err?.name === "ValidationError") {
    const v = err as ValidationError;
    return res.status(400).json({
      error: v.name,
      message: v.message ?? "Validation failed",
      fieldErrors: v.fieldErrors ?? {},
    });
  }

  // 2) Known errors with statusCode
  if (typeof err?.statusCode === "number") {
    return res.status(err.statusCode).json({
      error: err.name ?? "Error",
      message: err.message ?? "Request failed",
    });
  }

  // 3) Fallback
  console.error("[ERROR] Unhandled error", err);

  return res.status(500).json({
    error: "InternalServerError",
    message: "Something went wrong",
  });
}
