import { ModeloMedico } from "../modelo/medico.modelo.js"
import { ModeloAdmin } from "../modelo/admin.modelo.js"
import { validateCita, validatePartialCita, validateIdParam  } from "../schemas/citas.schema.js"
import { BadRequestError, NotFoundError } from "../utils/app.error.js"

export class MedicoController {

    static async crearCita (req, res) {

        const result = validateCita(req.body)

        if (!result.success) {
            console.log("errores zod:", JSON.stringify(result.error.errors, null, 2))
            throw new BadRequestError(result.error.errors)
        }

        const medicoId  = req.user.id
        console.log('USER:', req.user.id)


        const newCita = await ModeloMedico.crearCita({ medico_Id: medicoId, input: req.body })


        res.status(201).json(newCita)
    }

    static async obtenerCitasPorMedico (req, res) {
        const medicoId = req.user.id

        console.log('USER:', req.user.id)

        const medico = await ModeloAdmin.obtenerPorId({medicoId})
        if (!medico) throw new NotFoundError('Médico no válido')
            
        const citas = await ModeloMedico.obtenerCitasPorMedico({medicoId})

        if (!citas || citas.length === 0) throw new NotFoundError('Citas no encontradas')

        const safeCitas = citas.map(cita => ({
            uuid: cita.uuid,
            telefono: cita.telefono,
            fecha: cita.fecha,
            hora: cita.hora,
            paciente: cita.paciente,
            motivo: cita.motivo,
            estado: cita.estado,
            creacion: cita.created_at
        }))

        res.json({
            ok: true,
            count: safeCitas.length,
            citas: safeCitas
        })
    }

    static async obtenerCitaPorId(req, res) {

        const result = validateIdParam(req.params)
        if (!result.success) throw new BadRequestError('ID inválido')

        const { id: citaId } = result.data

        const medicoId  = req.user.id
    
        const cita = await ModeloMedico.obtenerCitaPorId({medicoId, citaId})
        
        if (!cita) throw new NotFoundError('No hay cita con ese ID para este médico')
        

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
            users: safeCitas
        })
    }

    static async eliminarCita (req, res) {

        const medicoId  = req.user.id
        const { id: citaId } = req.params

        const rowsAffected = await ModeloMedico.eliminarCita({medicoId, citaId})

        if (rowsAffected === 0) throw new NotFoundError('Cita no encontrada')

        res.status(204).send(console.log(rowsAffected))
    }

    static async actualizarCita (req, res) {
        
        const result = validatePartialCita(req.body)

        if (!result.success) {
            console.log("errores zod:", JSON.stringify(result.error.errors, null, 2))
            throw new BadRequestError(result.error.errors)
        }
        
        const medicoId  = req.user.id

        const { id: citaId } = req.params

        const validarMedicoCita = await ModeloMedico.obtenerCitaPorId({medicoId, citaId})
        if (!validarMedicoCita) throw new NotFoundError('No hay cita con ese ID para este médico')


        const rowsAffected = await ModeloMedico.actualizarCita({ citaId, medicoId, input: result.data })
        if (rowsAffected === 0) throw new NotFoundError('Error al actualizar la cita')
        
        res.status(200).json({
            ok: true,
            message: "Cita actualizada correctamente"
        })
    }
}