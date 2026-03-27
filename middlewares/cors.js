import CORS from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3050',
  'http://localhost:1234',
  'http://localhost:5173',
  'https://my-fake-movie-app.com',
  'NGROK_URL'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => CORS({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true) // permitir requests desde Postman o curl
    }

    return callback(new Error('Origin not allowed'))
  },
  credentials: true
})