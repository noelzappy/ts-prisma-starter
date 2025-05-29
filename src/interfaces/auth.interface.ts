import { TokenType, User } from '@/generated/prisma-client';
import { Request } from 'express';

export interface DataStoredInToken {
  sub: string;
  iat: number;
  exp: number;
  type: TokenType;
  cuid: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

export interface RequestWithUserAndFile extends RequestWithUser {
  file: any;
  files: any[];
}
