import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  const isRS256 = env.JWT_ACCESS_SECRET.includes('-----BEGIN PRIVATE KEY-----');
  const algorithm = isRS256 ? 'RS256' : 'HS256';
  
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    algorithm: algorithm as any,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const isRS256 = env.JWT_ACCESS_SECRET.includes('-----BEGIN PRIVATE KEY-----') || env.JWT_ACCESS_SECRET.includes('-----BEGIN PUBLIC KEY-----');
  const algorithm = isRS256 ? 'RS256' : 'HS256';
  
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: [algorithm as any],
  }) as TokenPayload;
};

export const signRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};
export default {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
};
