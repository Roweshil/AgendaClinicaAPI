import { AuthService } from "../Services/authService.js"
import { validateAuth } from "../schemas/auth.schema.js"
import { BadRequestError } from "../utils/app.error.js"
import { AppError } from "../utils/app.error.js"

const cookieOptions = {
    httpOnly: true, // solo se puede acceder en el servidor
    signed: true, // firma criptografica siempre activa, se rompe si se modifica
    secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https en produccion
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  //la cookie solo se puede acceder en el mismo dominio
    maxAge: 900000 // validez durante 15 minutos
}


export class AuthController {

    
   static async login(req, res) {
        const result = validateAuth(req.body)

        if (!result.success) throw new BadRequestError()
        
        try {
            const { token, response } = await AuthService.login({ input: result.data })   
            
            console.log("entro el log")
            return res
            .status(200)
            .cookie('access_token', token, {
                ...cookieOptions,
            })
            .json(response)
        } catch (error) {
            if (error instanceof AppError) {
                return next(error);
            }

            return next(error)
        }

    }

    static logout(req, res) {
        res.clearCookie('access_token', cookieOptions)

        res.json({ message: 'Logout exitoso' })
    }

    static validarToken(req, res) {

        const { nombre, apellido, email, rol } = req.user

        res.json({
            user: { nombre, apellido, email, rol }
        })
    }
    
}