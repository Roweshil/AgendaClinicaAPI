import { Router } from "express"
import { AuthController } from "../../controladores/auth.controlador.js"
import rateLimit from 'express-rate-limit'
import authMiddleware from "../../middlewares/authMiddleware.js"

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos, intenta más tarde' },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for']
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip
    console.log('IP rate limit:', ip) // verifica en los logs de Render
    return ip
  }
})

const authRouter = Router()


// Rutas Publicas

authRouter.get('/me', authMiddleware, AuthController.validarToken)

authRouter.post('/login', loginLimiter, AuthController.login)

authRouter.post('/logout', AuthController.logout)

export default authRouter





// (Deshabilitadas temporalmente para pruebas)

 //authRouter.post('/register', AuthController.register)
