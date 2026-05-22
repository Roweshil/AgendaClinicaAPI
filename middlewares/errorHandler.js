export const errorHandler = (err, req, res, next) => {

    // Si es un error personalizado nuestro, ya tiene su propio statusCode (404, 400, 503)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            ok: false,
            error: err.name,
            message: err.message
        })
    }

    // Si no es operacional (un bug de código como un crash de sintaxis), ocultamos los detalles
    console.error('ERROR NO CONTROLADO:', err)
    
    return res.status(500).json({
        ok: false,
        message: 'Algo salió mal en nuestros servidores.'
    })
}