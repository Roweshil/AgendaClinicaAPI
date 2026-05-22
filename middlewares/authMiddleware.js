import jwt from 'jsonwebtoken'
import {Unauthorized, ForbiddenError} from '../utils/app.error.js'

const authMiddleware = (req, res, next) => {
  console.log("--- NUEVA PETICIÓN PROTEGIDA ---");
  console.log("Cookies normales (req.cookies):", req.cookies);
  console.log("Cookies firmadas (req.signedCookies):", req.signedCookies);
  console.log("Cabecera Cookie cruda:", req.headers.cookie);
  const token = req.signedCookies?.access_token
  

  if (!token) {
    throw new Unauthorized()
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (err) {
    throw new ForbiddenError()
  }
}

export default authMiddleware