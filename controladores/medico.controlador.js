import { ModeloMedico } from "../modelo/medico.modelo.js"
import { ModeloAdmin } from "../modelo/admin.modelo.js"
import { validateCita, validatePartialCita, validateIdParam  } from "../schemas/citas.schema.js"
import { BadRequestError, NotFoundError, BusyBD } from "../utils/app.error.js"
import { mapDatabaseError } from '../utils/app.error.js'

export class MedicoController {

    static async crearCita (req, res) {

        try {
            const result = validateCita(req.body)

            if (!result.success) throw new BadRequestError()

            const medicoId  = req.user.id

            const newCita = await ModeloMedico.crearCita({ medico_Id: medicoId, input: req.body })
            
            res.status(201).json(newCita)

        } catch (error){
            return next(error)
        }
    }

    static async obtenerCitasPorMedico (req, res, next) {

        const medicoId = req.user.id

        try {

            const medico = await ModeloAdmin.obtenerPorId({medicoId})

            if (!medico) throw new BadRequestError()
        
            const citas = await ModeloMedico.obtenerCitasPorMedico({medicoId})

            if (!citas || citas.length === 0) throw new NotFoundError('No hay citas registradas')

            const safeCitas = citas.map(cita => ({
                uuid: cita.uuid,
                telefono: cita.telefono,
                fecha: cita.fecha,
                hora: cita.hora,
                paciente: cita.paciente,
                motivo: cita.motivo,
                estado: cita.estado,
                creacion: new Date(cita.created_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
            }))

            res.json({
                ok: true,
                count: safeCitas.length,
                citas: safeCitas
            })
        } catch (error) {
            return next(error)
        }
    }

    static async obtenerCitaPorId(req, res, next) {

        try {

            const result = validateIdParam(req.params)

            if (!result.success) throw new BadRequestError('ID inválido')

            const { id: citaId } = result.data

            const medicoId  = req.user.id

            const cita = await ModeloMedico.obtenerCitaPorId({medicoId, citaId})

            const safeCitas = {
                id: cita.uuid,
                fecha: cita.fecha,
                hora: cita.hora,
                paciente: cita.paciente,
                motivo: cita.motivo,
                estado: cita.estado,
                creacion: new Date(cita.created_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
            }

            res.status(200).json({
                ok: true,
                count: safeCitas.length,
                citas: safeCitas
            })
        } catch (error) {
            return next(error)
        }
    }

    static async eliminarCita (req, res) {

        const result = validateIdParam(req.params)

        const medicoId  = req.user.id
        const { id: citaId } = req.params

        try {
            const rowsAffected = await ModeloMedico.eliminarCita({medicoId, citaId})

            if (rowsAffected === 0) throw new NotFoundError()
            
            res.status(204).send('Cita eliminada')

        } catch(error) {
            return next(error)
        }

    }

    static async actualizarCita (req, res) {

        try {

            const result = validatePartialCita(req.body)

            if (!result.success) throw new BadRequestError()
            
            const medicoId  = req.user.id

            const { id: citaId } = req.params

            const rowsAffected = await ModeloMedico.actualizarCita({ citaId, medicoId, input: result.data })

            if (rowsAffected === 0) throw new NotFoundError('No se actualizo la cita')
            
            res.status(200).json({
                ok: true,
                message: "Cita actualizada correctamente"
            })
        } catch (error) {
            return next(error)
        }
        
    }
}