import prisma from '@/database';
import { Prisma } from '@/generated/prisma-client';
import _ from 'lodash';

export type PaginateOptions = {
  page?: number;
  limit?: number;
};

export type PaginateQuery<T> = {
  where?: {
    [key: string]: any;
  };
  select?: {
    [key in keyof T]?: any;
  };
  include?: {
    [key in keyof T]?: any;
  };
  orderBy?: {
    [key in keyof T]?: 'asc' | 'desc';
  };
};

export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

const paginate = async <T, Q = any>(model: Prisma.ModelName, query: Q, options: PaginateOptions): Promise<PaginateResult<T>> => {
  const { page = 1, limit = 10 } = options;
  const pageInt = parseInt(String(page), 10);
  const limitInt = parseInt(String(limit), 10);

  const offset = (pageInt - 1) * limitInt;

  const modelName = _.camelCase(model);

  const data = await prisma[modelName].findMany({
    orderBy: {
      createdAt: 'desc',
    },
    ...query,
    skip: offset,
    take: limitInt,
  });

  const total = await prisma[modelName].count({
    where: (query as any).where || {},
  });

  const totalPages = Math.ceil(total / limitInt);
  const hasPrevPage = pageInt > 1;
  const hasNextPage = pageInt < totalPages;

  return {
    docs: data,
    totalDocs: total,
    limit: limitInt,
    totalPages,
    page: pageInt,
    pagingCounter: offset + 1,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? pageInt - 1 : null,
    nextPage: hasNextPage ? pageInt + 1 : null,
  };
};

export default paginate;
