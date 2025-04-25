import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { ForgotPasswordDto, LoginUserDto, ResetPasswordDto, VerifyEmailDto, SignUpDto, ReqWithRefreshToken } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/auth/signup', ValidationMiddleware(SignUpDto), this.auth.signUp);
    this.router.post('/auth/login', ValidationMiddleware(LoginUserDto), this.auth.logIn);
    this.router.post('/auth/logout', AuthMiddleware(), ValidationMiddleware(ReqWithRefreshToken), this.auth.logOut);
    this.router.post('/auth/refresh', AuthMiddleware(), ValidationMiddleware(ReqWithRefreshToken), this.auth.refreshAuth);
    this.router.post('/auth/reset-password', ValidationMiddleware(ResetPasswordDto), this.auth.resetPassword);
    this.router.post('/auth/verify-email', ValidationMiddleware(VerifyEmailDto), this.auth.verifyEmail);
    this.router.post('/auth/forgot-password', ValidationMiddleware(ForgotPasswordDto), this.auth.forgotPassword);
    this.router.post('/auth/send-email-verification', ValidationMiddleware(ForgotPasswordDto), this.auth.sendEmailVerification);
  }
}
