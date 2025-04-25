import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import { User } from '@/generated/prisma-client';
import { HttpException } from '@/utils/httpException';
import { passport } from '@/config/passport';

const AUTH_ERR_MSG = 'Please authenticate';

const verifyCallback = (req: RequestWithUser, resolve, reject) => async (err, user: User, info) => {
  if (err || info || !user) {
    return reject(new HttpException(httpStatus.UNAUTHORIZED, AUTH_ERR_MSG));
  }

  req.user = user;

  resolve();
};

/**
 * Middleware function to handle authentication using Passport.js with the 'jwt' strategy.
 * This middleware ensures that incoming requests are authenticated based on a JSON Web Token (JWT).
 *
 * @returns An asynchronous middleware function that processes the request, authenticates the user,
 * and calls the next middleware in the chain if authentication is successful.
 *
 * @throws Passes any authentication errors to the next middleware via `next(err)`.
 *
 * @example
 * // Usage in an Express route
 * app.use(AuthMiddleware());
 */
export const AuthMiddleware = () => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};
