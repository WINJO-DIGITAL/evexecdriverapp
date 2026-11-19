import type { BookingStatus } from '@/lib/types'

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config: Record<BookingStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-700 border-amber-500/25' },
    accepted: { label: 'Accepted', className: 'bg-blue-500/10 text-blue-700 border-blue-500/25' },
    confirmed: { label: 'Confirmed', className: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/25' },
    Dispatched: { label: 'Dispatched', className: 'bg-blue-500/10 text-blue-700 border-blue-500/25' },
    'En Route': { label: 'En Route', className: 'bg-purple-500/10 text-purple-700 border-purple-500/25' },
    en_route: { label: 'En Route', className: 'bg-purple-500/10 text-purple-700 border-purple-500/25' },
    Arrived: { label: 'Arrived', className: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/25' },
    arrived: { label: 'Arrived', className: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/25' },
    Active: { label: 'On Board', className: 'bg-green-500/10 text-green-700 border-green-500/25' },
    active: { label: 'On Board', className: 'bg-green-500/10 text-green-700 border-green-500/25' },
    'Passenger On Board': { label: 'On Board', className: 'bg-green-500/10 text-green-700 border-green-500/25' },
    completed: { label: 'Completed', className: 'bg-[#dce8f2] text-[#4a6a8a] border-[#c4d4e4]' },
    Completed: { label: 'Completed', className: 'bg-[#dce8f2] text-[#4a6a8a] border-[#c4d4e4]' },
    rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-700 border-red-500/25' },
    cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-700 border-red-500/25' },
    Cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-700 border-red-500/25' },
    'No Show': { label: 'No Show', className: 'bg-amber-500/10 text-amber-700 border-amber-500/25' },
    CRITICAL_UNALLOCATED: { label: 'Needs Driver', className: 'bg-red-600/20 text-red-700 border-red-600/40' },
  }
  const c = config[status]
  if (!c) return null
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${c.className}`}>
      {c.label}
    </span>
  )
}
