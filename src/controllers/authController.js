const { createUser, authenticateUser, refreshTokens } = require('../services/authService');

async function signup(req, res) {
  const { email, password, name, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const user = await createUser({ email, password, name, role });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const result = await authenticateUser({ email, password });
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    return res.json({ user: { id: result.user.id, email: result.user.email, role: result.user.role }, accessToken: result.accessToken, refreshToken: result.refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    const tokens = await refreshTokens({ token: refreshToken });
    return res.json(tokens);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}

module.exports = { signup, login, refresh };
