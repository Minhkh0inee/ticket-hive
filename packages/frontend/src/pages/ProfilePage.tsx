import { useState } from 'react'
import { Pencil, Mail, User, Shield } from 'lucide-react'
import { useAppSelector } from '@/hooks/useAppSelector'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
  })

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'GU'

  function openEdit() {
    setForm({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' })
    setEditOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div
        className="h-48 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.6 0.2 250) 0%, oklch(0.5 0.22 270) 100%)',
        }}
      >
        {/* Decorative dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16 pt-4">
        {/* Avatar + name */}
        <div className="-mt-14 mb-8 flex items-end gap-5">
          <Avatar className="size-28 ring-4 ring-white shadow-xl flex-shrink-0">
            <AvatarFallback
              className="text-3xl font-bold text-white"
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.6 0.2 250), oklch(0.5 0.22 270))',
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email ?? ''}</p>
          </div>
        </div>

        {/* Info card */}
        <Card className="shadow-sm border-gray-100 overflow-hidden">
          <CardContent className="p-0">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Personal Information
              </h2>
              <Button
                size="sm"
                onClick={openEdit}
                className="gap-1.5 text-white text-xs h-8"
                style={{ background: 'oklch(0.6 0.2 250)' }}
              >
                <Pencil className="w-3 h-3" />
                Edit Profile
              </Button>
            </div>

            <div className="divide-y divide-gray-50 bg-white">
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="First Name"
                value={user?.firstName ?? '—'}
              />
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="Last Name"
                value={user?.lastName ?? '—'}
              />
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email Address"
                value={user?.email ?? '—'}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-firstName">First Name</Label>
              <Input
                id="edit-firstName"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                placeholder="First name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-lastName">Last Name</Label>
              <Input
                id="edit-lastName"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                placeholder="Last name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={user?.email ?? ''}
                disabled
                className="bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400">
                Email address cannot be changed.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setEditOpen(false)}
              className="text-white"
              style={{ background: 'oklch(0.6 0.2 250)' }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm text-gray-900 truncate ${
            mono ? 'font-mono text-xs text-gray-500' : 'font-medium'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
