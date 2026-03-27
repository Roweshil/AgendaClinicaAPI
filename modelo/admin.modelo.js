import { db } from "../DB/turso.js"
import crypto from "node:crypto"
import bcrypt from 'bcrypt'
import { ConflictError } from "../utils/app.error.js"
import {mapDatabaseError, NotFoundError } from "../utils/app.error.js"


export class ModeloAdmin {

   static async crearMedico({ input }) {

    const { 
      nombre, 
      apellido,
      telefono,
      email, 
      password,
      roles = 'medico'
    } = input

    try {

      const existing = await db.execute({
        sql: "SELECT uuid FROM medicos WHERE email = ?",
        args: [email],
      })

      if (existing.rows.length > 0) throw new ConflictError("Usuario ya registrado")

      const uuid = crypto.randomUUID()

      const googletoken = uuid

      const saltRounds = Number(process.env.SALT_ROUNDS)
      
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const resultado = await db.execute(
        `INSERT INTO medicos (uuid, nombre, apellido, telefono, email, hashedPassword, googletoken, roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuid, nombre, apellido, telefono, email, hashedPassword, googletoken, roles]
      )

      return { uuid, nombre, apellido, telefono, email }
      
    } catch (error) {
        throw mapDatabaseError(error)
    }
  }

  static async obtenerTodos() {

    try {
      const resultado = await db.execute('SELECT uuid, nombre, apellido, telefono, email FROM medicos')

      return resultado.rows
    } catch (error) {
      throw mapDatabaseError(error)
    }
  }  

  static async obtenerPorId({ medicoId }) {

    try {
      const resultado = await db.execute(
        'SELECT uuid, nombre, email, roles FROM medicos WHERE uuid = ?', 
        [medicoId]
    )

      return resultado.rows[0]


    } catch (error) {
      throw mapDatabaseError(error)
    }
  }

 

  static async actualizarContraseña ({ input }) {

    const { uuid, password } = input

    const saltRounds = Number(process.env.SALT_ROUNDS)
    
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    try {
        const resultado = await db.execute(
          `UPDATE medicos SET hashedPassword = ? WHERE uuid = ?`,
          [hashedPassword, uuid]
        )

        return uuid
    
    } catch (error) {
        throw mapDatabaseError(error)
    }
  
  }


  static async eliminarMedico({ medicoId }) {

    try {
      const resultado = await db.execute(
        `DELETE FROM medicos WHERE uuid = ?`,
        [medicoId]
      )

      return resultado.rowsAffected


    } catch (error) {
      throw mapDatabaseError(error)
    }
  }

  static async actualizarMedico({ medicoId, input }) {

    const columnasPermitidas = [
    'nombre',
    'apellido',
    'telefono',
    'email',
    ]

    const fields = []
    const values = []


    for (const [key, value] of Object.entries(input)) {
      if (!columnasPermitidas.includes(key)) continue

      fields.push(`${key} = ?`)
      values.push(value)
    }

    console.log(input)

    if (fields.length === 0) return 0

    const sql = `
      UPDATE medicos
      SET ${fields.join(', ')}
      WHERE uuid = ?
    `

    values.push(medicoId)

    try {

      const result = await db.execute(sql, values)
      return medicoId

    } catch (error) {
        throw mapDatabaseError(error)
    }
  }

}

