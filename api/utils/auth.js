const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const JWT_SECRET = 'secret';

const getUserId = (req, authToken) => {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('認証されていません');
      };
      const userId = jwt.verify(token, JWT_SECRET);
      return userId;
    };
  } else if (authToken) {
    const userId = jwt.verify(token, JWT_SECRET);
    return userId;
  };
  throw new Error('認証されていません');
};

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: '認証されていません'
    });
  };

  const verifyToken = jwt.verify(token, JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { username: verifyToken.username }
  });

  if (!user) {
    return res.status(401).json({
      message: 'ユーザーが存在しません'
    });
  };

  req.auth = user;
  next();
};

async function handleLogin(req, res, next) {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username: username }
  });
  if (!user || user.password !== password) {
    res.status(401).json({
      message: '入力に誤りがあります'
    });
  } else {
    const token = jwt.sign(user.id, JWT_SECRET);
    res.status(200).json({
      token
    });
  };
};

async function handleSignup(req, res, next) {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username: username }
  });
  if (user) {
    res.status(401).json({
      message: 'すでにユーザーが存在します'
    });
  } else {
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password,
      }
    });
    const token = jwt.sign(newUser.id, JWT_SECRET);
    res.status(200).json({
      message: 'ユーザーが作成されました',
      newUser,
      token,
    });
  };
}

module.exports = {
  handleLogin,
  handleSignup,
  authMiddleware,
  getUserId,
};