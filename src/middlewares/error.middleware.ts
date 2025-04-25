import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { HttpException } from '@/utils/httpException';

/**
 * Middleware to handle errors in the application.
 *
 * @param error - The error object, typically an instance of `HttpException`.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * @remarks
 * This middleware captures errors thrown during request processing and sends
 * an appropriate HTTP response to the client. If the error does not have a
 * status code, it defaults to 500 (Internal Server Error). The error message
 * is logged, and a generic message is sent to the client for 500 errors.
 *
 * @example
 * ```typescript
 * app.use(ErrorMiddleware);
 * ```
 */
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = status === 500 ? 'Something went wrong' : error.message || 'Something went wrong';
    console.log(JSON.stringify(error.stack, null, 2));

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
