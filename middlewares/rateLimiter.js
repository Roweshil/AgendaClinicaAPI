import rateLimit from 'express-rate-limit'


export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Demasiados intentos de inicio de sesión. Bloqueado por 15 minutos.' },
})

export const writterLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: { error: "Estas realizando demasiadas acciones muy rapido."},
})

export const readLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: { error: "Estas realizando demasiadas acciones muy rapido."},
})