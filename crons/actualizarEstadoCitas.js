import cron from "node-cron"
import { db } from "../DB/turso.js"

export const actualizarEstados = async () => {
  try {
    console.log("Actualizando estados de citas...")
    await db.execute(`
        UPDATE citas 
        SET estado = 'vencida'
        WHERE datetime(fecha || ' ' || hora) < datetime('now', '-6 hours')
        AND estado = 'confirmada'
    `)
  } catch (error) {
    console.error("Error actualizando estados:", error)
  }
}

// Ejecuta al arrancar
actualizarEstados()

// Ejecuta cada 5 minutos
cron.schedule("*/5 * * * *", actualizarEstados)