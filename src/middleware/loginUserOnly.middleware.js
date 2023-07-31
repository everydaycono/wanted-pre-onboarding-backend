import jwt from 'jsonwebtoken';

export const loginUserOnlyRoute = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authentication Invalid' });
  }

  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication Invalid' });
  }

  token = token.substring(7, token.length);

  //   JWT TOKEN VALID CHECK
  const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
  if (!isTokenValid) {
    return res.status(401).json({ message: 'Authentication Invalid' });
  }

  req.userInfo = isTokenValid;
  next();
};
