import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { UpdateUserDto } from '@/dtos/users.dto';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/users/me', AuthMiddleware(), this.user.getMe);
    this.router.patch('/users/me', AuthMiddleware(), ValidationMiddleware(UpdateUserDto), this.user.updateMe);
  }
}
