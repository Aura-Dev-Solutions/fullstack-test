import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateRequest =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const flat = result.error.flatten();

      console.warn("[VALIDATION] Request validation failed", {
        path: req.path,
        method: req.method,
        fieldErrors: flat.fieldErrors,
      });

      return next({
        name: "ValidationError",
        statusCode: 400,
        message: "Validation failed",
        fieldErrors: flat.fieldErrors,
      });
    }

    next();
  };
