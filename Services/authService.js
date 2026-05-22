import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Unauthorized } from '../utils/app.error.js'

import { ModeloAuth } from '../modelo/auth.modelo.js'

export class AuthService {

  static async login({ input }) {

    const { email, password } = input

    const user =
      (await ModeloAuth.buscarPorAdmin(email)) ??
      (await ModeloAuth.buscarPorEmail(email))
      
    if (!user) throw new Unauthorized('Sin autorizacion')


    const passwordValido = await bcrypt.compare(password, user.hashedPassword)

    if (!passwordValido) throw new Unauthorized('Sin autorizacion')

      //uuid, nombre, apellido, email, roles
    const token = jwt.sign(
      { id: user.uuid, 
        nombre: user.nombre, 
        apellido: user.apellido, 
        email: user.email, 
        rol: user.roles 
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    return {
      token,
      response: {
        ok: "Autenticación exitosa"
      }
    }
  }

}