import { Router } from "express"
import { AuthController } from "../../controladores/auth.controlador.js"
import { loginLimiter } from "../../middlewares/rateLimiter.js"
import authMiddleware from "../../middlewares/authMiddleware.js"

const authRouter = Router()


// Rutas Publicas

authRouter.get('/me', authMiddleware, AuthController.validarToken)

authRouter.post('/login', loginLimiter, AuthController.login)

authRouter.post('/logout', AuthController.logout)

export default authRouter





// (Deshabilitadas temporalmente para pruebas)

 //authRouter.post('/register', AuthController.register)
