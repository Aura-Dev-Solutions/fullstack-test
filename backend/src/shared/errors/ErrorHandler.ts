import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "./HttpError";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const isProd = process.env.NODE_ENV === "production";

  // Zod error is 400
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Invalid request data",
      fieldErrors: err.flatten().fieldErrors ?? {},
    });
  }

  // Custom HttpError
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.expose ? err.message : "Request failed",
      fieldErrors: err.fieldErrors ?? {},
    });
  }

  // Compatibility with errors that have a statusCode property
  if (typeof err?.statusCode === "number") {
    return res.status(err.statusCode).json({
      error: err.name ?? "Error",
      message: err.message ?? "Request failed",
    });
  }

  // unexpected errors (throw new Error) 
  if (err instanceof Error) {
    // full stack trace 
    console.error("[ERROR] Unhandled error:", err);

    return res.status(500).json({
      error: "InternalServerError",
      message: isProd ? "Something went wrong" : err.message,
    });
  }

  // non-error thrown
  console.error("[ERROR] Non-error thrown:", err);

  return res.status(500).json({
    error: "InternalServerError",
    message: "Something went wrong",
  });
}
