import { hash, compare } from 'bcrypt';
import Container, { Service } from 'typedi';
import httpStatus from 'http-status';
import { TokenService } from './token.service';
import { LoginUserDto, SignUpDto } from '@/dtos/users.dto';
import { TokenType } from '@/generated/prisma-client';
import prisma from '@/database';
import { HttpException } from '@/utils/httpException';
import EmailService from './email.service';

@Service()
export class AuthService {
  public token = Container.get(TokenService);
  public email = Container.get(EmailService);

  public async signup(userData: SignUpDto) {
    const email = userData.email?.toLowerCase();

    const emailUser = await prisma.user.findUnique({ where: { email } });

    if (emailUser) throw new HttpException(httpStatus.CONFLICT, 'Email already taken');

    const hashedPassword = await hash(userData.password, 10);

    delete (userData as any).role;

    const createdUser = await prisma.user.create({
      data: {
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`,
        email,
        password: hashedPassword,
      },
    });

    delete createdUser.password;

    const tokenData = await this.token.generateAuthTokens(createdUser.id);

    return { tokenData, user: createdUser };
  }

  public async login(userData: LoginUserDto) {
    const _user = await prisma.user.findUnique({ where: { email: userData?.email?.toLowerCase() } });

    if (!_user) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    const passwordMatched: boolean = await compare(userData.password, _user.password);

    if (!passwordMatched) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    const user = await prisma.user.update({ where: { id: _user.id }, data: { lastLoginAt: new Date() }, omit: { password: true } });

    const tokenData = await this.token.generateAuthTokens(user.id);

    return { tokenData, user };
  }

  public async logout(userId: string, refreshToken: string) {
    await prisma.$transaction([
      prisma.token.deleteMany({ where: { token: refreshToken, type: TokenType.refresh, userId } }),
      prisma.token.deleteMany({ where: { userId, type: TokenType.access } }),
    ]);
  }

  public async refreshAuth(refreshToken: string) {
    const verifiedToken = await this.token.verifyToken(refreshToken, TokenType.refresh);

    if (!verifiedToken) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const findUser = await prisma.user.findUnique({
      where: {
        id: verifiedToken.userId,
      },
    });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    await prisma.token.deleteMany({ where: { userId: findUser.id, type: TokenType.refresh, token: refreshToken } });

    const tokenData = await this.token.generateAuthTokens(findUser.id);

    return tokenData;
  }

  public async verifyEmail(token: string) {
    const verifiedToken = await this.token.verifyToken(token, TokenType.verifyemail);

    if (!verifiedToken) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const findUser = await prisma.user.findUnique({ where: { id: verifiedToken.userId } });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    await prisma.user.update({ where: { id: verifiedToken.userId }, data: { isEmailVerified: true } });
    await prisma.token.deleteMany({ where: { userId: findUser.id, type: TokenType.verifyemail } });

    return findUser;
  }

  public async resetPassword(token: string, password: string) {
    const verifiedToken = await this.token.verifyToken(token, TokenType.resetpassword);

    if (!verifiedToken) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const findUser = await prisma.user.findUnique({ where: { id: verifiedToken.userId } });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');
    const hashedPassword = await hash(password, 10);
    await prisma.user.update({ where: { id: verifiedToken.userId }, data: { password: hashedPassword } });

    return findUser;
  }

  public async forgotPassword(email: string) {
    const findUser = await prisma.user.findUnique({ where: { email } });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid email');

    const token = await this.token.generateResetPasswordToken(findUser.email);
    this.email.sendResetPasswordEmail(findUser.email, token);
  }

  public async resendVerificationEmail(email: string) {
    const findUser = await prisma.user.findUnique({ where: { email } });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid email');

    if (findUser.isEmailVerified) throw new HttpException(httpStatus.UNAUTHORIZED, 'Email already verified');

    const token = await this.token.generateVerifyEmailToken(findUser.id);
    await this.email.sendVerificationEmail(findUser.email, token);
  }

  public updatePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const hashedPassword = await hash(newPassword, 10);

    if (!user) throw new HttpException(httpStatus.NOT_FOUND, 'User not found');

    const isPasswordMatched = await compare(oldPassword, user.password);

    if (!isPasswordMatched) throw new HttpException(httpStatus.UNAUTHORIZED, 'Old password is incorrect');

    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  };
}
