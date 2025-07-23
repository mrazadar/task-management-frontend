'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import axios from 'axios'

const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

async function signupFetcher(
  url: string,
  { arg }: { arg: z.infer<typeof SignUpSchema> },
) {
  return axios.post(url, arg, { withCredentials: true }).then((res) => res.data)
}

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/signup`,
    signupFetcher,
  )

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    try {
      await trigger(data)
      router.push('/auth/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <main className="container mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isMutating}>
            {isMutating ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </main>
  )
}

/**
 * @description Client component for sign-up with SWR mutation and HTTP-only cookie persistence.
 * @reference https://swr.vercel.app/docs/mutation
 * @reference https://ui.shadcn.com/docs/components/form
 * @reference https://nextjs.org/docs/app/building-your-application/routing
 * @linting ESLint with Airbnb TypeScript rules ensures code consistency.
 */
