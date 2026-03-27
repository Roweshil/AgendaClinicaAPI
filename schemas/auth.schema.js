import z from 'zod'

const authSchema = z.object({
    email: z.string().min(5).max(100),
    password: z.string().min(8).max(50)
})

export function validateAuth (input) {
    return authSchema.safeParse(input)
}