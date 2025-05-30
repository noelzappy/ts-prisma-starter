import { sign, verify } from 'jsonwebtoken';
import Container, { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import { UserService } from './users.service';
import { Prisma, TokenType } from '@/generated/prisma-client';
import prisma from '@/database';
import { HttpException } from '@/utils/httpException';
import crypto from 'crypto';

type GenerateTokenBody = {
  expires: number;
  userId: string;
  type: TokenType;
  cuid: string;
};

@Service()
export class TokenService {
  public _users = Container.get(UserService);

  generateToken = ({ expires, userId, type, cuid }: GenerateTokenBody) => {
    const dataStoredInToken: DataStoredInToken = {
      sub: userId,
      iat: Date.now(),
      exp: expires || Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      type,
      cuid: cuid || '',
    };

    return sign(dataStoredInToken, SECRET_KEY);
  };

  public async saveToken(tokenBody: Prisma.TokenCreateInput) {
    tokenBody.expiresAt = tokenBody.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return prisma.token.create({
      data: tokenBody,
    });
  }

  public async verifyToken(token: string, type: TokenType) {
    const payload = verify(token, SECRET_KEY) as unknown as DataStoredInToken;

    const tokenData = await prisma.token.findUnique({
      where: {
        token,
        type,
        userId: payload.sub,
        expiresAt: new Date(payload.exp),
      },
    });

    if (!tokenData) {
      throw new HttpException(httpStatus.UNAUTHORIZED, 'Token not found or expired');
    }

    return tokenData;
  }

  public async generateAuthTokens(userId: string) {
    const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const accessUUID = crypto.randomUUID();

    const accessToken = this.generateToken({
      userId,
      type: TokenType.access,
      expires: tokenExpires.getTime(),
      cuid: accessUUID,
    });

    const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const refreshUUID = crypto.randomUUID();
    const refreshToken = this.generateToken({
      userId,
      type: TokenType.refresh,
      expires: refreshTokenExpires.getTime(),
      cuid: refreshUUID,
    });

    await prisma.$transaction(async tx => {
      await tx.token.create({
        data: {
          token: accessToken,
          expiresAt: tokenExpires,
          type: TokenType.access,
          user: {
            connect: {
              id: userId,
            },
          },
          uid: accessUUID,
        },
      });

      await tx.token.create({
        data: {
          token: refreshToken,
          expiresAt: refreshTokenExpires,
          type: TokenType.refresh,
          user: {
            connect: {
              id: userId,
            },
          },
          uid: refreshUUID,
        },
      });
    });

    return {
      access: { token: accessToken, expires: tokenExpires },
      refresh: { token: refreshToken, expires: refreshTokenExpires },
    };
  }

  public async generateResetPasswordToken(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException(httpStatus.NOT_FOUND, 'User not found');
    }

    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const cuid = crypto.randomUUID();

    const token = this.generateToken({
      userId: user.id,
      type: TokenType.resetpassword,
      expires: expires.getTime(),
      cuid,
    });

    await this.saveToken({
      token,
      user: {
        connect: {
          id: user.id,
        },
      },
      expiresAt: expires,
      type: TokenType.resetpassword,
      uid: cuid,
    });

    return token;
  }

  public async generateVerifyEmailToken(userId: string) {
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const cuid = crypto.randomUUID();
    const token = this.generateToken({
      userId,
      type: TokenType.verifyemail,
      expires: expires.getTime(),
      cuid,
    });

    await this.saveToken({
      token,
      user: {
        connect: {
          id: userId,
        },
      },
      expiresAt: expires,
      type: TokenType.verifyemail,
      uid: cuid,
    });

    return token;
  }
}
