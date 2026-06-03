import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { fetchAdminUsersRequest } from '@/stores/slices/admin.slice'
import type { AdminUser } from '@/types/event.types'
import { fmtDate } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/common/Pagination'

const LIMIT = 10

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-[oklch(0.2_0_0)] hover:bg-transparent">
          {Array.from({ length: 5 }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-[oklch(0.22_0_0)] rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function AdminUsersPage() {
  const dispatch = useAppDispatch()
  const { users, usersTotal, usersLoading, usersError } = useAppSelector((s) => s.admin)

  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchAdminUsersRequest({ offset: (page - 1) * LIMIT, limit: LIMIT }))
  }, [dispatch, page])

  const totalPages = Math.max(1, Math.ceil(usersTotal / LIMIT))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Users</h1>
          <p className="text-sm text-[oklch(0.5_0_0)] mt-0.5">{usersTotal} total users</p>
        </div>
      </div>

      {usersError && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {usersError}
        </div>
      )}

      <div className="rounded-xl border border-[oklch(0.2_0_0)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
              <TableHead className="text-[oklch(0.5_0_0)] font-medium w-10" />
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Name</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Email</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Role</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading ? (
              <TableSkeleton />
            ) : users.length === 0 ? (
              <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-12 text-[oklch(0.45_0_0)]">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: AdminUser) => (
                <TableRow
                  key={user.id}
                  className="border-[oklch(0.2_0_0)] hover:bg-[oklch(0.15_0_0)]"
                >
                  <TableCell>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ background: 'oklch(0.35 0.08 250)' }}
                    >
                      {user.firstName?.[0] ?? '?'}{user.lastName?.[0] ?? ''}
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)]">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className="text-white border-0 text-xs capitalize"
                      style={{
                        background:
                          user.role === 'admin'
                            ? 'oklch(0.6 0.2 250)'
                            : 'oklch(0.3 0 0)',
                      }}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {fmtDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
