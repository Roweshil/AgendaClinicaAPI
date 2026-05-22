export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    this.isOperational = true
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Crecenciales Invalidas') {
    super(message, 403)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400)
  }
}

export class Unauthorized extends AppError {
  constructor(message = 'Sin autorizacion') {
    super(message, 401)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto de datos en BD') {
    super(message, 409)
  }
}

export class BusyBD extends AppError {
  constructor(message = 'Servicio no disponible') {
    super(message, 503)
  }
}

export const mapDatabaseError = (error) => {
  const message = error.proto?.message || error.message || ''

  if (message.includes('SQLite error: UNIQUE constraint failed: citas.medico_id, citas.fecha, citas.hora')) {
    return new ConflictError('Horario ocupado')
  }

  if (message.includes('FOREIGN KEY constraint failed')) {
    return new BadRequestError('Referencia inválida')
  }

  if (message.includes('NOT NULL constraint failed')) {
    return new BadRequestError('Faltan campos obligatorios')
  }

  if (error.code === 'SQLITE_BUSY') {
    return new AppError('Base de datos ocupada')
  }

  return error
}