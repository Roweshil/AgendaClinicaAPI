import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import adminRouter from './routes/privada/admin.routes.js'
import medicoRouter from './routes/privada/medico.routes.js'
import authRouter from './routes/publica/auth.routes.js'
import authMiddleware from './middlewares/authMiddleware.js'
import rolesAutorizados  from './middlewares/roleMiddleware.js'
import sanitizeMiddleware from './utils/sanitizador.js'
import { corsMiddleware } from './middlewares/cors.js'
//import { actualizarEstados } from './crons/actualizarEstadoCitas.js'

dotenv.config()

const app = express()
app.set('trust proxy', 1) // para confiar en el proxy inmediato y usar la IP que brinda del usuario
app.use(helmet()) // para seguridad HTTP headers
app.use(corsMiddleware()) // para manejar CORS

app.use(cookieParser())

app.use(express.json({ limit: '10kb' })) // para parsear JSON con un límite de tamaño
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

app.use('/api', sanitizeMiddleware)
app.use('/api/auth', sanitizeMiddleware, authRouter)
app.use('/api/admin', sanitizeMiddleware, authMiddleware, rolesAutorizados('admin'), adminRouter)
app.use('/api/medico', sanitizeMiddleware, authMiddleware, rolesAutorizados('admin', 'medico'), medicoRouter)

app.use((err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  res.status(500).json({
    error: 'Error interno del servidor'
  })
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
