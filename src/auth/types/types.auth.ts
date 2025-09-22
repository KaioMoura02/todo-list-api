import { User } from 'generated/prisma';

export type LoginResult = Pick<User, keyof { name: 1; email: 1 }> & {
  accessToken: string;
};
