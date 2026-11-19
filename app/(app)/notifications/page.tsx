'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft, Bell, ChevronRight,
  Car, MapPin, Users, CheckCircle2, XCircle, Clock, Navigation, UserCheck, AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PickupIcon } from '@/components/route-icons'
import { formatDate, formatTime } from '@/lib/format'
import type { Booking, BookingStatus } from '@/lib/types'

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface StatusMeta {
  label: string
  Icon: React.ElementType
  iconColor: string
  bgColor: string
}

const STATUS_META: Record<BookingStatus, StatusMeta> = {
  pending:              { label: 'Awaiting confirmation', Icon: Clock,        iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  accepted:             { label: 'Job confirmed',         Icon: UserCheck,    iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  confirmed:            { label: 'Job confirmed',         Icon: UserCheck,    iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  Dispatched:           { label: 'Job dispatched',        Icon: Navigation,   iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  en_route:             { label: 'Journey started',       Icon: Car,          iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  'En Route':           { label: 'Journey started',       Icon: Car,          iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  arrived:              { label: 'Arrived at pickup',     Icon: MapPin,       iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  Arrived:              { label: 'Arrived at pickup',     Icon: MapPin,       iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  active:               { label: 'Passenger on board',   Icon: Users,        iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  Active:               { label: 'Passenger on board',   Icon: Users,        iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  'Passenger On Board': { label: 'Passenger on board',   Icon: Users,        iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  completed:            { label: 'Job completed',         Icon: CheckCircle2, iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  Completed:            { label: 'Job completed',         Icon: CheckCircle2, iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  rejected:             { label: 'Job rejected',          Icon: XCircle,      iconColor: '#B91C1C', bgColor: 'rgba(185,28,28,0.08)' },
  cancelled:            { label: 'Job cancelled',         Icon: XCircle,      iconColor: '#B91C1C', bgColor: 'rgba(185,28,28,0.08)' },
  Cancelled:            { label: 'Job cancelled',         Icon: XCircle,      iconColor: '#B91C1C', bgColor: 'rgba(185,28,28,0.08)' },
  'No Show':            { label: 'No show',               Icon: AlertCircle,  iconColor: '#A07D32', bgColor: 'rgba(160,125,50,0.10)' },
  CRITICAL_UNALLOCATED: { label: 'Needs driver — urgent', Icon: AlertCircle,  iconColor: '#B91C1C', bgColor: 'rgba(185,28,28,0.08)' },
}

export default function NotificationsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  // "Clear" hides everything up to now on this phone; new activity still shows.
  const [clearedAt, setClearedAt] = useState<string | null>(null)
  const [clearKey, setClearKey] = useState<string | null>(null)

  const supabase = createClient()

  const loadActivity = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const key = `evexec_activity_cleared_${user.id}`
    setClearKey(key)
    try { setClearedAt(localStorage.getItem(key)) } catch { /* storage unavailable */ }

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('assigned_driver_id', user.id)
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(30)

    setBookings(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadActivity() }, [loadActivity])

  const visible = clearedAt
    ? bookings.filter(b => b.updated_at && b.updated_at > clearedAt)
    : bookings

  const clearActivity = () => {
    const now = new Date().toISOString()
    setClearedAt(now)
    try { if (clearKey) localStorage.setItem(clearKey, now) } catch { /* storage unavailable */ }
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] px-4 pt-12 pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[#535B68] active:text-[#262C35]">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-[#060C1A] font-bold text-xl flex-1">Activity</h1>
        {!loading && visible.length > 0 && (
          <button
            onClick={clearActivity}
            className="text-[#535B68] text-sm font-medium px-3 py-1.5 rounded-lg active:bg-[#EEF0F3]"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 rounded-full border-2 border-[#d5a538] border-t-transparent animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-[#E2E5EA] rounded-2xl p-12 text-center">
          <Bell size={32} className="mx-auto mb-3 text-[#A07D32]" />
          <p className="text-[#535B68] text-sm">{bookings.length ? 'All caught up' : 'No activity yet'}</p>
          <p className="text-[#646C78] text-xs mt-1">{bookings.length ? 'New job activity will appear here' : 'Your job history will appear here'}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {visible.map((booking) => {
            const meta = STATUS_META[booking.status]
            if (!meta) return null
            const { label, Icon, iconColor, bgColor } = meta
            const pickup = booking.pickup_location ?? booking.airport ?? 'See job details'
            return (
              <Link key={booking.id} href={`/jobs/${booking.id}`}>
                <div className="bg-white border border-[#E2E5EA] rounded-2xl p-4 active:opacity-80 transition-opacity">
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                      style={{ background: bgColor }}
                    >
                      <Icon size={16} style={{ color: iconColor }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[#060C1A] font-semibold text-sm leading-tight">{booking.customer_name}</p>
                          <p className="text-[#535B68] text-[11px] mt-0.5">{label}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[#535B68] text-[10px]">{timeAgo(booking.updated_at)}</span>
                          <ChevronRight size={13} className="text-[#A07D32]" />
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <PickupIcon booking={booking} size={11} />
                        <p className="text-[#3A414C] text-xs truncate">{pickup}</p>
                      </div>

                      {/* Date/time */}
                      {booking.travel_date && (
                        <p className="text-[#646C78] text-[10px] mt-1">
                          {formatDate(booking.travel_date)}{booking.travel_time ? ` · ${formatTime(booking.travel_time)}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
