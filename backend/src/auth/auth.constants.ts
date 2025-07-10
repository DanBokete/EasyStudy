const accessTokenMaxAge = 1000 * 60 * 15; // 15 minutes
const refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
  accessToken: 'DO NOT USE THIS VALUE',
  refreshToken: 'I am stupid for not editing this if you see this',
  refreshTokenExpiresIn: '7d',
  refreshTokenExpiresAtDate: () =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  accessTokenExpiresIn: '15m',
  accessTokenMaxAge: accessTokenMaxAge,
  refreshTokenMaxAge: refreshTokenMaxAge,
  accessTokenOptions: {
    httpOnly: true,
    maxAge: accessTokenMaxAge,
    sameSite: 'none' as const,
    secure: process.env.NODE_ENV === 'production',
    partitioned: true,
  },
  refreshTokenOptions: {
    httpOnly: true,
    maxAge: refreshTokenMaxAge,
    sameSite: 'none' as const,
    secure: process.env.NODE_ENV === 'production',
    partitioned: true,
  },
};
