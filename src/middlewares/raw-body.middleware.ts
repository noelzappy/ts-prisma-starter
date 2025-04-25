import { Response, NextFunction } from 'express';
import { Stream } from 'stream';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

/**
 * Middleware to add a `rawBody` property to the request object.
 *
 * This middleware listens to the incoming request stream, collects all chunks of data,
 * and concatenates them into a single `Buffer`. The resulting buffer is then assigned
 * to a `rawBody` property on the request object, allowing access to the raw request body
 * for further processing.
 *
 * @returns A middleware function that processes the request stream and adds the `rawBody` property.
 *
 * @example
 * // Usage in an Express application
 * import express from 'express';
 * import { addRawBody } from './middlewares/misc.middleware';
 *
 * const app = express();
 * app.use(addRawBody());
 *
 * @remarks
 * - Ensure that this middleware is used before any body-parsing middleware (e.g., `express.json()`),
 *   as it operates on the raw request stream.
 * - The `req` object is expected to be a `Stream`, and the resulting `rawBody` is added
 *   as a custom property.
 */
export const addRawBody = () => (req: Stream, _: Response, next: NextFunction) => {
  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    // (req as unknown as RequestWithRawBody).rawBody = Buffer.concat(chunks);
    Object.defineProperty(req, 'rawBody', {
      value: Buffer.concat(chunks),
      writable: false,
      enumerable: true,
      configurable: false,
    });
    next();
  });
};
