import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type Login = z.infer<typeof LoginSchema>

export const SignUpSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type SignUp = z.infer<typeof SignUpSchema>
