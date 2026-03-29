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

dotenv.config()

const app = express()
app.set('trust proxy', 1)
app.use(helmet()) // para seguridad HTTP headers
app.use(corsMiddleware()) // para manejar CORS

app.use(cookieParser())

app.use(express.json({ limit: '10kb' })) // para parsear JSON con un límite de tamaño
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

app.use('/api', sanitizeMiddleware)
app.use('/api/auth', sanitizeMiddleware, authRouter)
app.use('/api/admin', sanitizeMiddleware, authMiddleware, rolesAutorizados('admin'), adminRouter)
app.use('/api/medico', sanitizeMiddleware, authMiddleware, rolesAutorizados('admin', 'medico'), medicoRouter)



// Manejo de rutas no encontradas
/*app.all('/{path}', (req, res) => { 
  res.status(404).sendFile(path.join(__dirname, 'vistas', '404.html')); 
               
})*/

app.use((err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  console.error(err)

  res.status(500).json({
    error: 'Error interno del servidor'
  })
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
