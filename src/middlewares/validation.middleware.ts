import { HttpException } from '@/utils/httpException';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
  type: any,
  location: 'body' | 'params' | 'query' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req[location]);

    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted, forbidUnknownValues: true })
      .then(() => {
        Object.assign(req[location], dto); // Assign the validated DTO back to the request object
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');

        next(new HttpException(httpStatus.BAD_REQUEST, message));
      });
  };
};
