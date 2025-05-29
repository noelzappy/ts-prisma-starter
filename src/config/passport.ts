import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { SECRET_KEY } from '@/config';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { TokenType } from '@/generated/prisma-client';
import prisma from '@/database';
import { Passport } from 'passport';

export const passport = new Passport();

const jwtOptions = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const jwtVerify = async (payload: DataStoredInToken, done) => {
  try {
    if (payload.type !== TokenType.access) {
      throw new Error('Invalid token type');
    }
    const token = await prisma.token.findUnique({
      where: {
        uid: payload.cuid,
        userId: payload.sub,
        expiresAt: new Date(payload.exp),
        type: payload.type,
      },
      include: {
        user: true,
      },
    });

    const user = token?.user;

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
