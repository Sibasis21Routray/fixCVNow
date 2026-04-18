'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { COLORS } from '@/lib/colors'
import {
  Users, TrendingUp, LogOut, Search,
  ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react'
import { DocumentIcon, ResumeOptimizeIcon, QuickTemplatesIcon } from '@/components/asset-icons'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function useAdminFetch() {
  const router = useRouter()

  const apiFetch = useCallback(async (path) => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.replace('/admin/login'); return null }

    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) { router.replace('/admin/login'); return null }
    return res.json()
  }, [router])

  return apiFetch
}

// ── Stat Card ──────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub, iconSize = 120 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
      <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18` }}>
        <Icon size={iconSize} style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold mt-0.5" style={{ color: COLORS.blue }}>{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Mini bar chart ─────────────────────────────────────
function DailyChart({ dailyUsage }) {
  if (!dailyUsage?.length) return (
    <p className="text-slate-400 text-sm text-center py-8">No data yet</p>
  )

  // Merge by date
  const byDate = {}
  for (const row of dailyUsage) {
    const d = row._id.date
    if (!byDate[d]) byDate[d] = { extract: 0, optimize: 0 }
    byDate[d][row._id.operation] = row.totalTokens
  }

  const dates = Object.keys(byDate).sort()
  const maxVal = Math.max(...dates.map(d => byDate[d].extract + byDate[d].optimize), 1)

  return (
    <div className="flex items-end gap-1 h-28 pt-2">
      {dates.map((date) => {
        const total = byDate[date].extract + byDate[date].optimize
        const h = Math.round((total / maxVal) * 100)
        const extractH = Math.round((byDate[date].extract / maxVal) * 100)
        const label = date.slice(5) // MM-DD
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1" title={`${date}: ${total.toLocaleString()} tokens`}>
            <div className="w-full flex flex-col justify-end" style={{ height: 80 }}>
              <div className="w-full rounded-sm" style={{ height: `${h}%`, backgroundColor: COLORS.green, opacity: 0.85 }} />
            </div>
            <span className="text-[9px] text-slate-400 rotate-45 origin-left whitespace-nowrap">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Pagination Bar (shared) ────────────────────────────
function PaginationBar({ page, pages, total, limit, onPage, onLimit }) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)
  return (
    <div className="flex items-center justify-between mt-3 text-xs text-slate-500 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={limit}
          onChange={e => onLimit(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
        >
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="ml-1">{from}–{to} of {total}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(1)} disabled={page === 1}
          className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all font-medium">«</button>
        <button onClick={() => onPage(page - 1)} disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all">
          <ChevronLeft size={14} />
        </button>
        <span className="px-2">Page {page} / {Math.max(pages, 1)}</span>
        <button onClick={() => onPage(page + 1)} disabled={page >= pages}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all">
          <ChevronRight size={14} />
        </button>
        <button onClick={() => onPage(pages)} disabled={page >= pages}
          className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all font-medium">»</button>
      </div>
    </div>
  )
}

// ── Token Usage Table ──────────────────────────────────
function TokenTable({ apiFetch }) {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [opFilter, setOpFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const qs = `?page=${page}&limit=${limit}${opFilter ? `&operation=${opFilter}` : ''}`
    const res = await apiFetch(`/admin/token-usage${qs}`)
    if (res) setData(res)
    setLoading(false)
  }, [apiFetch, page, limit, opFilter])

  useEffect(() => { load() }, [load])

  const handleLimit = (n) => { setLimit(n); setPage(1) }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="font-bold text-slate-800">Token Usage Log</h2>
        <div className="flex gap-2">
          {['', 'extract', 'optimize'].map((op) => (
            <button key={op}
              onClick={() => { setOpFilter(op); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${opFilter === op ? 'text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              style={opFilter === op ? { backgroundColor: COLORS.blue } : {}}
            >
              {op === '' ? 'All' : op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}
          <button onClick={load} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Operation</th>
              <th className="px-4 py-3 text-right">Input</th>
              <th className="px-4 py-3 text-right">Output</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Duration</th>
              <th className="px-4 py-3 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!data?.records?.length ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                {loading ? 'Loading...' : 'No records yet'}
              </td></tr>
            ) : data.records.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${r.operation === 'extract' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {r.operation === 'extract' ? <DocumentIcon size={30} /> : <ResumeOptimizeIcon size={30} />}
                    {r.operation}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{r.inputTokens?.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-600">{r.outputTokens?.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-semibold" style={{ color: COLORS.blue }}>{r.totalTokens?.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-400">{r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(r.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page} pages={data?.pages ?? 1} total={data?.total ?? 0}
        limit={limit} onPage={setPage} onLimit={handleLimit}
      />
    </div>
  )
}

// ── Leads Table ────────────────────────────────────────
function LeadsTable({ apiFetch }) {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const qs = `?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`
    const res = await apiFetch(`/admin/leads${qs}`)
    if (res) setData(res)
    setLoading(false)
  }, [apiFetch, page, limit, search])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleLimit = (n) => { setLimit(n); setPage(1) }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="font-bold text-slate-800">Leads <span className="text-slate-400 font-normal text-sm">({data?.total ?? 0})</span></h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Name, email or phone..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-400 w-52"
            />
          </div>
          <button type="submit"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.blue }}>
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Extracted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!data?.leads?.length ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                {loading ? 'Loading...' : search ? 'No results found' : 'No leads yet'}
              </td></tr>
            ) : data.leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{lead.name || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{lead.email || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{lead.phone || '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(lead.extractedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page} pages={data?.pages ?? 1} total={data?.total ?? 0}
        limit={limit} onPage={setPage} onLimit={handleLimit}
      />
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const apiFetch = useAdminFetch()
  const [stats, setStats] = useState(null)
  const [username, setUsername] = useState('')
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin/login')
      return
    }
    setUsername(localStorage.getItem('admin_username') || 'admin')
    setAuthed(true)
  }, [router])

  useEffect(() => {
    if (!authed) return
    apiFetch('/admin/stats').then(data => { if (data) setStats(data) })
  }, [apiFetch, authed])

  // Don't render anything until auth is confirmed
  if (!authed) return null

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    router.replace('/admin/login')
  }

  const extractStats = stats?.byOperation?.extract
  const optimizeStats = stats?.byOperation?.optimize

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="FixCVNow" className="h-8 object-contain" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 border-l border-slate-200 pl-3">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Signed in as <span className="font-semibold text-slate-600">{username}</span></span>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}      label="Total Leads"       value={stats?.totalLeads?.toLocaleString()}                    color={COLORS.blue} iconSize={20} />
          <StatCard icon={DocumentIcon}   label="Extractions"       value={stats?.totalExtracts?.toLocaleString()}                 color="#3B82F6"
            sub={extractStats  ? `${extractStats.totalTokens.toLocaleString()} tokens` : undefined} />
          <StatCard icon={ResumeOptimizeIcon}   label="Optimizations"     value={stats?.totalOptimizes?.toLocaleString()}                color={COLORS.green}
            sub={optimizeStats ? `${optimizeStats.totalTokens.toLocaleString()} tokens` : undefined} />
          <StatCard icon={QuickTemplatesIcon}        label="Total Tokens Used"  value={stats?.totalTokens?.toLocaleString()}                   color="#F59E0B" />
        </div>

        {/* Daily chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Token Usage — Last 14 Days</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS.green }} />
                Tokens
              </span>
            </div>
          </div>
          <DailyChart dailyUsage={stats?.dailyUsage} />
        </div>

        {/* Token usage table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <TokenTable apiFetch={apiFetch} />
        </div>

        {/* Per-section extract breakdown note */}
        {extractStats && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
            <strong>Extract breakdown:</strong> avg {Math.round(extractStats.totalTokens / Math.max(extractStats.count, 1)).toLocaleString()} tokens/extraction
            &nbsp;·&nbsp; input {extractStats.inputTokens.toLocaleString()} &nbsp;·&nbsp; output {extractStats.outputTokens.toLocaleString()}
          </div>
        )}

        {/* Leads table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <LeadsTable apiFetch={apiFetch} />
        </div>

      </div>
    </div>
  )
}
