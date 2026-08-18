// Rutas para gestión de citas médicas
// Rutas protegidas con middleware de autenticación y autorización

import { Router } from "express"

import { MedicoController } from "../../controladores/medico.controlador.js"
import { writterLimiter, readLimiter } from "../../middlewares/rateLimiter.js"

const medicoRouter = Router()

medicoRouter.get('/citas/mis-citas/', readLimiter, MedicoController.obtenerCitasPorMedico)

medicoRouter.get('/citas/consulta/:id', readLimiter, MedicoController.obtenerCitaPorId)

medicoRouter.post('/citas/crear', writterLimiter, MedicoController.crearCita)

medicoRouter.delete('/citas/eliminar/:id', writterLimiter, MedicoController.eliminarCita)

medicoRouter.patch('/citas/actualizar/:id', writterLimiter, MedicoController.actualizarCita)

export default medicoRouter
