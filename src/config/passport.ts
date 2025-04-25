import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { SECRET_KEY } from '@/config';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { TokenType } from '@/generated/prisma-client';
import prisma from '@/database';
import { Passport } from 'passport';

export const passport = new Passport();
export const staffPassport = new Passport();

const jwtOptions = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const jwtVerify = async (payload: DataStoredInToken, done) => {
  try {
    if (payload.type !== TokenType.access) {
      throw new Error('Invalid token type');
    }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
