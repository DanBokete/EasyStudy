export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
  accessToken: 'DO NOT USE THIS VALUE',
  refreshToken: 'I am stupid for not editing this if you see this',
  refreshTokenExpiresIn: '7d',
  refreshTokenExpiresAtDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  accessTokenExpiresIn: '15m',
  accessTokenMaxAge: 1000 * 60 * 15,
  refreshTokenMaxAge: 1000 * 60 * 60 * 24,
};
