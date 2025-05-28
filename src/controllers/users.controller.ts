import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import catchAsync from '@/utils/catchAsync';
import httpStatus from 'http-status';
import _ from 'lodash';
import { UpdateUserDto } from '@/dtos/users.dto';

export class UserController {
  public user = Container.get(UserService);

  public getMe = catchAsync(async (req: RequestWithUser, res: Response) => {
    const user = await this.user.findUserById(req.user.id);
    delete user.password;
    res.status(httpStatus.OK).json(user);
  });

  public updateMe = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userData: UpdateUserDto = req.body;
    delete (userData as any).isEmailVerified;
    delete (userData as any).isPhoneVerified;

    const user = await this.user.updateUser(req.user.id, userData);
    delete user.password;
    res.status(httpStatus.OK).json(user);
  });
}
