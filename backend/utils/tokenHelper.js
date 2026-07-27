import jwt from 'jsonwebtoken';

/**
 * Generate Access Token (short-lived)
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

/**
 * Generate Refresh Token (long-lived)
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Verify token helper
 */
export const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

/**
 * Set token cookie helper
 */
export const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE, 10)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);
  
  // Optional: Also set refresh token in cookie if desired, or return in payload
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    path: '/api/auth/refresh', // only sent to refresh endpoint
  });

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        timezone: user.timezone,
      },
      token,
      refreshToken,
    },
  });
};
