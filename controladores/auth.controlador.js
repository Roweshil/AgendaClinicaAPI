import { AuthService } from "../Services/authService.js";
import { validateAuth } from "../schemas/auth.schema.js";
import { BadRequestError } from "../utils/app.error.js";


export class AuthController {
   static async login(req, res) {
        const cookieOptions = {
            httpOnly: true, // solo se puede acceder en el servidor
            secure: true,//process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
            sameSite: 'none',  //la cookie solo se puede acceder en el mismo dominio
        }

        const result = validateAuth(req.body)

        if (!result.success) throw new BadRequestError('Verificar datos de autenticación')


        const { token, response } = await AuthService.login({ input: result.data })   
            
        res
        .cookie('access_token', token, {
            ...cookieOptions,
            maxAge: 1800000 // validez durante 15 minutos
        })
        .json({ response })

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