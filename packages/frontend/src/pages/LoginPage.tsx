import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'

import { LoginForm } from '@/components/auth/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginPage() {
  return (
    <div className="dark min-h-dvh flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-[480px] rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="size-9 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center">
            <Ticket className="size-5 text-brand" />
          </div>
          <span className="text-xl font-semibold text-foreground tracking-tight">
            Ticket<span className="text-brand">Hive</span>
          </span>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <LoginForm />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-brand font-medium hover:underline underline-offset-4 transition-colors"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
