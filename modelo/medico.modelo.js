import { db } from "../DB/turso.js"
import crypto from "node:crypto"
import {mapDatabaseError, NotFoundError } from "../utils/app.error.js"

export class ModeloMedico {

   static async crearCita({ medico_Id, input }) {
    const { 
        paciente,
        telefono,
        fecha, 
        hora,
        motivo,
        estado
    } = input

    const google_event_id = crypto.randomUUID()

    const uuid = crypto.randomUUID()

    try {
      const resultado = await db.execute(
        `INSERT INTO citas (uuid, medico_id, paciente, telefono, fecha, hora, motivo, estado, google_event_id ) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuid, medico_Id, paciente, telefono, fecha, hora, motivo, estado, google_event_id]
      )
    
      return { uuid, paciente, telefono, fecha, hora, motivo, estado, creacion: Date.now() }
    
    } catch (error) {
      throw mapDatabaseError(error)
    }
  }
    
  static async obtenerCitaPorId({medicoId, citaId}) {
    
    try {

      const resultado = await db.execute('SELECT * FROM citas WHERE uuid = ? AND medico_id = ?', [citaId, medicoId])

      return resultado.rows[0]; 

    } catch (error) {
      throw mapDatabaseError(error)
    }
  }

  static async obtenerCitasPorMedico({medicoId}) {

    try {
      const resultado = await db.execute('SELECT * FROM citas WHERE medico_id = ?', [medicoId])

      return resultado.rows
      
    } catch (error) {
      throw new NotFoundError('No se encontraron citas para este médico')
    }  
  }

  static async eliminarCita({medicoId, citaId}) {
    

    try {
      const resultado = await db.execute(
        `DELETE FROM citas WHERE uuid = ? AND medico_id = ?`,
        [citaId, medicoId]
      )

      return resultado.rowsAffected

    } catch (error) {
      throw mapDatabaseError(error)
    }
  }

  static async actualizarCita({ citaId, medicoId, input }) {

    const columnasPermitidas = [
      'paciente',
      'telefono',
      'email', 
      'fecha', 
      'hora',
      'motivo',
      'estado'
    ]

    const fields = []
    const values = []


    for (const [key, value] of Object.entries(input)) {

      if (!columnasPermitidas.includes(key)) continue

      fields.push(`${key} = ?`)
      values.push(value)
      
    }

    if (fields.length === 0) return 0

    const sql = `
      UPDATE citas
      SET ${fields.join(', ')}
      WHERE uuid = ? AND medico_id = ?
    `

    values.push(citaId, medicoId)

    try {

      const result = await db.execute(sql, values)

      console.log('Cita actualizada:', result)
      return result

    } catch (error) {
        throw mapDatabaseError(error)
      }
  }
  
}
