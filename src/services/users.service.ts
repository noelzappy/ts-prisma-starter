import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { UpdateUserDto } from '@dtos/users.dto';
import prisma from '@/database';
import { Prisma, User } from '@/generated/prisma-client';
import { HttpException } from '@/utils/httpException';
import httpStatus from 'http-status';
import _ from 'lodash';
import paginate, { PaginateOptions } from '@/utils/paginate';

@Service()
export class UserService {
  public async findUserById(userId: string) {
    const findUser: User = await prisma.user.findUnique({ where: { id: userId } });
    return findUser;
  }

  public async updateUser(userId: string, userData: UpdateUserDto) {
    const findUser: User = await prisma.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(httpStatus.NOT_FOUND, "User doesn't exist");

    if (userData.email) {
      const findUserByEmail: User = await prisma.user.findUnique({ where: { email: userData.email } });
      if (findUserByEmail && findUserByEmail.id !== userId) {
        throw new HttpException(httpStatus.CONFLICT, `This email ${userData.email} already exists`);
      }
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    const updateUserData = await prisma.user.update({
      where: { id: userId },
      data: {
        ...userData,
        fullName: userData.firstName || findUser.firstName + ' ' + userData.lastName || findUser.lastName,
        isEmailVerified: userData.email && userData.email.toLowerCase() !== findUser.email.toLowerCase() ? false : findUser.isEmailVerified,
      },
    });
    return updateUserData;
  }

  public async queryUsers(query: Prisma.UserFindManyArgs, options: PaginateOptions) {
    return paginate('User', query, options);
  }
}
