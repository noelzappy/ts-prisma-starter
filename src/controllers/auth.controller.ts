import { Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import EmailService from '@/services/email.service';
import { TokenService } from '@/services/token.service';
import catchAsync from '@/utils/catchAsync';
import { ForgotPasswordDto, LoginUserDto, SignUpDto, ResetPasswordDto, VerifyEmailDto, ReqWithRefreshToken } from '@/dtos/users.dto';
import httpStatus from 'http-status';
import AuthWorker from '@/workers/auth.worker';

export class AuthController {
  public auth = Container.get(AuthService);
  public email = Container.get(EmailService);
  public token = Container.get(TokenService);

  public signUp = catchAsync(async (req: Request, res: Response) => {
    const userData: SignUpDto = req.body;

    const signupData = await this.auth.signup(userData);

    await AuthWorker.add({
      action: 'user-signup',
      data: {
        userId: signupData.user.id,
      },
    });

    res.status(httpStatus.CREATED).send(signupData);
  });

  public logIn = catchAsync(async (req: Request, res: Response) => {
    const userData: LoginUserDto = req.body;
    const loginData = await this.auth.login(userData);

    await AuthWorker.add({
      action: 'user-login',
      data: {
        userId: loginData.user.id,
      },
    });

    res.status(httpStatus.OK).send(loginData);
  });

  public logOut = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userData = req.user;
    const body: ReqWithRefreshToken = req.body;
    await this.auth.logout(userData.id as any, body.refreshToken);
    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public refreshAuth = catchAsync(async (req: Request, res: Response) => {
    const body: ReqWithRefreshToken = req.body;
    const tokenData = await this.auth.refreshAuth(body.refreshToken);
    res.status(httpStatus.OK).send(tokenData);
  });

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const body: ResetPasswordDto = req.body;
    const user = await this.auth.resetPassword(body.token, body.password);

    await AuthWorker.add({
      action: 'password-reset',
      data: {
        userId: user.id,
      },
    });

    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const body: VerifyEmailDto = req.body;
    const user = await this.auth.verifyEmail(body.token);

    await AuthWorker.add({
      action: 'user-email-verified',
      data: {
        userId: user.id,
      },
    });

    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const body: ForgotPasswordDto = req.body;

    await this.auth.forgotPassword(body.email);
    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public sendEmailVerification = catchAsync(async (req: Request, res: Response) => {
    const body: ForgotPasswordDto = req.body;
    await this.auth.resendVerificationEmail(body.email);
    res.sendStatus(httpStatus.NO_CONTENT);
  });
}
