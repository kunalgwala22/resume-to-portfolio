import prisma from '../../config/database';
import { RegisterDTO } from './auth.dto';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { 
        email: email.toLowerCase(),
        deletedAt: null 
      }
    });
  }

  async findByUsername(username: string) {
    return prisma.user.findFirst({
      where: { 
        username: username.toLowerCase(),
        deletedAt: null 
      }
    });
  }

  async findById(id: string) {
    return prisma.user.findFirst({
      where: { 
        id,
        deletedAt: null 
      }
    });
  }

  async createUser(data: RegisterDTO & { passwordHash: string }) {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        isEmailVerified: false
      }
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });
  }
}

export const authRepository = new AuthRepository();
export default authRepository;
