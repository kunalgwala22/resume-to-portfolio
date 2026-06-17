import { authRepository } from './auth.repository';
import { RegisterDTO, LoginDTO, AuthResponse } from './auth.dto';
import { hashPassword, comparePassword } from '../../lib/bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt';
import { UserProfile } from '@portfolioverse/shared';

export class AuthService {
  private formatProfile(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      organizationId: user.organizationId,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingEmail = await authRepository.findByEmail(data.email);
    if (existingEmail) {
      throw { statusCode: 400, message: 'Email address already in use', code: 'EMAIL_EXISTS' };
    }

    const existingUsername = await authRepository.findByUsername(data.username);
    if (existingUsername) {
      throw { statusCode: 400, message: 'Username already in use', code: 'USERNAME_EXISTS' };
    }

    const passwordHash = await hashPassword(data.password);
    const user = await authRepository.createUser({ ...data, passwordHash });

    const accessToken = signAccessToken({ userId: user.id, email: user.email, username: user.username });
    const refreshToken = signRefreshToken(user.id);

    await authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: this.formatProfile(user),
      accessToken,
      refreshToken
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email address or password', code: 'INVALID_CREDENTIALS' };
    }

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      throw { statusCode: 401, message: 'Invalid email address or password', code: 'INVALID_CREDENTIALS' };
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email, username: user.username });
    const refreshToken = signRefreshToken(user.id);

    await authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: this.formatProfile(user),
      accessToken,
      refreshToken
    };
  }

  async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await authRepository.findById(decoded.userId);
      
      if (!user || user.refreshToken !== token) {
        throw { statusCode: 401, message: 'Invalid or revoked refresh token', code: 'INVALID_REFRESH' };
      }

      const accessToken = signAccessToken({ userId: user.id, email: user.email, username: user.username });
      const newRefreshToken = signRefreshToken(user.id);

      await authRepository.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error: any) {
      throw { 
        statusCode: 401, 
        message: error.message || 'Invalid refresh token session', 
        code: 'INVALID_REFRESH' 
      };
    }
  }

  async logout(userId: string): Promise<void> {
    await authRepository.updateRefreshToken(userId, null);
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User profile not found', code: 'USER_NOT_FOUND' };
    }
    return this.formatProfile(user);
  }
}

export const authService = new AuthService();
export default authService;
