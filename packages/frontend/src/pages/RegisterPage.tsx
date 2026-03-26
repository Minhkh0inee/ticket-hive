import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'

import { RegisterForm } from '@/components/auth/RegisterForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function RegisterPage() {
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
            <CardTitle className="text-xl font-semibold">Create an account</CardTitle>
            <CardDescription>Join TicketHive to book your next event</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <RegisterForm />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-brand font-medium hover:underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
