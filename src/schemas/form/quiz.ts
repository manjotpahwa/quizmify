import {z} from 'zod'

export const quizCreationSchema = z.object({
    topic: z.string().min(4, {message: 'Topics must be at least 4 chars'}).max(50, {message:'too much bro'}),
    type: z.enum(['mcq', 'open_ended']),
    amount: z.number().min(1).max(10),
})