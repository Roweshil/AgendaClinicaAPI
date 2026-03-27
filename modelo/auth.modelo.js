import { db } from "../DB/turso.js"

export class ModeloAuth {

    static async buscarPorAdmin (email) {
        try {
            const result = await db.execute(
            'SELECT uuid, nombre, apellido, email, hashedPassword, roles FROM admin WHERE email = ?',
            [email]
            )

            if (!result.rows.length) return null
            return result.rows[0]

        } catch (error) {
            throw mapDatabaseError(error)
        }
        
    }

    static async buscarPorEmail (email) {
        try {
            const result = await db.execute(
            'SELECT uuid, nombre, apellido, email, hashedPassword, roles FROM medicos WHERE email = ?',
            [email]
            )

            if (!result.rows.length) return null
            return result.rows[0]

        } catch (error) {
            throw mapDatabaseError(error)
        }
        
    } 
}
