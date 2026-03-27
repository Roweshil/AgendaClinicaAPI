import z from 'zod'

const citaSchema = z.object({
    paciente: z.string().min(2).max(100),
    telefono: z.string({
        invalid_type_error: 'telefono debe ser en formato string',
        required_error: 'telefono es requerido'
    }).min(10).max(20),
    fecha: z.string({
        invalid_type_error: 'fecha debe ser en formato string',
        required_error: 'fecha es requerida'
    }),
    hora: z.string({
        invalid_type_error: 'la hora es necesaria',
        required_error: 'hora es requerida',
    }),
    motivo: z.string({
        invalid_type_error: 'el motivo es necesario',
        required_error: 'el motivo es requerido',
    }).min(2).max(255),
    estado: z.string({
        invalid_type_error: 'el estado es necesario',
        required_error: 'el estado es requerido'
    }).min(2).max(50)
})

const IdParamSchema = z.object({
    id: z.string({
        invalid_type_error: 'id debe ser un string',
        required_error: 'id es requerido'
    })
})


export function validateCita(input) {
    return citaSchema.safeParse(input)
}

export function validatePartialCita(input) {
    return citaSchema.partial().safeParse(input)
}

export function validateIdParam (input) {
    return IdParamSchema.safeParse(input)
}






        