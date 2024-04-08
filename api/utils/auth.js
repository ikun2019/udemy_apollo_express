const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const JWT_SECRET = 'secret';

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
    const token = jwt.sign(user.username, JWT_SECRET);
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
};