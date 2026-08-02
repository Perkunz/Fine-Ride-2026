const prisma = require('../db');
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

async function createUser({ email, password, name, role = 'USER' }) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name, role } });
  return user;
}

async function authenticateUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  // persist refresh token
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) } });

  return { user, accessToken, refreshToken };
}

async function refreshTokens({ token }) {
  try {
    const payload = verifyRefreshToken(token);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored) throw new Error('Invalid refresh token');

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new Error('User not found');

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

    // replace stored token
    await prisma.refreshToken.delete({ where: { token } });
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) } });

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
}

module.exports = { createUser, authenticateUser, refreshTokens };
