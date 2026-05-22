import jwt from 'jsonwebtoken'
import {Unauthorized, ForbiddenError} from '../utils/app.error.js'

const authMiddleware = (req, res, next) => {
  const token = req.signedCookies.access_token
  

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