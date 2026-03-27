import { ModeloAdmin } from "../modelo/admin.modelo.js"
import { validateMedico, validatePartialMedico, validatePasswordUpdate, validateIdParam } from "../schemas/medicos.schema.js"
import { BadRequestError, NotFoundError } from "../utils/app.error.js"

export class AdminController {
    
    static async crearMedico (req, res) {
        
        const result = validateMedico(req.body)

        if (!result.success) throw new BadRequestError('Verificar datos del médico')

        const newMedico = await ModeloAdmin.crearMedico({ input: result.data })

        res.status(201).json(newMedico)
    }

    static async obtenerTodos (req, res) {


        const medicos = await ModeloAdmin.obtenerTodos()
        if (!medicos || medicos.length === 0) throw new BadRequestError('No hay médicos registrados')

        const safeUsers = medicos.map(user => ({
            id: user.uuid,
            nombre: user.nombre,
            apellido: user.apellido,
            telefono: user.telefono,
            email: user.email
        }))

        res.json({
            ok: true,
            count: safeUsers.length,
            medicos: safeUsers
        })

    }

    static async obtenerPorId (req, res) {

        const result = validateIdParam(req.params)

        if (!result.success) throw new BadRequestError('ID inválido')

        const { id: medicoId } = result.data

        const medico = await ModeloAdmin.obtenerPorId({medicoId})  

        if (!medico) throw new NotFoundError('No hay médico registrado con ese ID')

        res.json(medico)

    }

    static async actualizarContraseña (req, res) {
 
        const result = validatePasswordUpdate(req.body)

        if (!result.success) throw new BadRequestError('Verificar la contraseña')

        const updatedMedico = await ModeloAdmin.actualizarContraseña({ input: result.data })

        res.status(201).json(updatedMedico)
    }

    static async eliminarMedico (req, res) {
        const { id: medicoId } = req.params
        
        const rowsAffected = await ModeloAdmin.eliminarMedico({medicoId})
        if (rowsAffected === 0) throw new NotFoundError('No hay médico registrado con ese ID')

        res.status(204)
        .json({
            ok: true,
            mensaje: `Médico y sus registros eliminados correctamente.`
        })
    }

    static async actualizarMedico (req, res) {

        const result = validatePartialMedico(req.body)

        if (!result.success) throw new BadRequestError('Verificar datos del médico')

        const { id: uuid } = req.params

        const updatedMedico = await ModeloAdmin.actualizarMedico({ uuid, input: result.data })
        res.status(201).json(updatedMedico)
    }

}