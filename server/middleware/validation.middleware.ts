import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  };
};
