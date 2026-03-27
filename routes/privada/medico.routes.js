// Rutas para gestión de citas médicas
// Rutas protegidas con middleware de autenticación y autorización

import { Router } from "express"

import { MedicoController } from "../../controladores/medico.controlador.js"

const medicoRouter = Router()

medicoRouter.get('/citas/mis-citas/', MedicoController.obtenerCitasPorMedico)

medicoRouter.get('/citas/consulta/:id', MedicoController.obtenerCitaPorId)

medicoRouter.post('/citas/crear', MedicoController.crearCita)

medicoRouter.delete('/citas/eliminar/:id', MedicoController.eliminarCita)

medicoRouter.patch('/citas/actualizar/:id', MedicoController.actualizarCita)

export default medicoRouter