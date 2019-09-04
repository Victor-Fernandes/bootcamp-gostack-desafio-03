// Middleware de autenticação. Verifica se user está logado.
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // captura o token do user

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provide' });
  }

  // pegando apenas o token
  const [, token] = authHeader.split(' ');

  // Verifica se o token está correto.
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ error: 'Token Invalid' });
  }
  return next();
};
