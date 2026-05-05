"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/colors";
import {
  Users,
  TrendingUp,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Settings,
  X,
  Download,
  LayoutDashboard,
  Database,
  Zap,
  CreditCard,
  ReceiptText,
  FileText,
} from "lucide-react";
import {
  DocumentIcon,
  ResumeOptimizeIcon,
  QuickTemplatesIcon,
} from "@/components/asset-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function useAdminFetch() {
  const router = useRouter();

  const apiFetch = useCallback(
    async (path, options = {}) => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin/login");
        return null;
      }

      const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { Authorization: `Bearer ${token}`, ...options?.headers },
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return null;
      }
      return res.json();
    },
    [router],
  );

  return apiFetch;
}

// ── Export Modal ──────────────────────────────────────────
function ExportModal({ isOpen, onClose, router, type = "all" }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    const url = `${API_URL}/admin/export-data?month=${month}&year=${year}&type=${type}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const filename =
        month === "all"
          ? `Report-${type}-${year}.xlsx`
          : `Report-${type}-${year}-${month}.xlsx`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
    } catch (err) {
      alert("Failed to download report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "leads":
        return "Export Leads";
      case "tokens":
        return "Export Token Usage";
      case "invoices":
        return "Export Invoices";
      default:
        return "Export All Data";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-lg">{getTitle()}</h2>
            <p className="text-xs text-slate-400 font-medium">
              Select period for Excel report
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all appearance-none bg-slate-50 hover:bg-white"
              >
                <option value="all">Full Year (Total)</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all appearance-none bg-slate-50 hover:bg-white"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
              This report for <b>{type}</b> includes all records for the selected period in a multi-sheet Excel file.
            </p>
          </div> */}
        </div>

        <footer className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-200 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Download size={16} />
            )}
            {loading ? "Generating..." : "Download Excel"}
          </button>
        </footer>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub, iconSize = 24 }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-all group">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon size={iconSize} style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-black mt-1" style={{ color: COLORS.blue }}>
          {value ?? "—"}
        </p>
        {sub && (
          <p className="text-[11px] font-semibold text-slate-400 mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

// ── Mini bar chart ─────────────────────────────────────
function DailyChart({ dailyUsage }) {
  if (!dailyUsage?.length)
    return (
      <p className="text-slate-400 text-sm text-center py-12">
        No usage data found for the last 14 days
      </p>
    );

  const byDate = {};
  for (const row of dailyUsage) {
    const d = row._id.date;
    if (!byDate[d]) byDate[d] = { extract: 0, optimize: 0 };
    byDate[d][row._id.operation] = row.totalTokens;
  }

  const dates = Object.keys(byDate).sort();
  const maxVal = Math.max(
    ...dates.map((d) => byDate[d].extract + byDate[d].optimize),
    1,
  );

  return (
    <div className="flex items-end gap-2 h-72 pt-4">
      {dates.map((date) => {
        const total = byDate[date].extract + byDate[date].optimize;
        const h = Math.round((total / maxVal) * 100);
        const label = date.slice(5); // MM-DD
        return (
          <div
            key={date}
            className="flex-1 flex flex-col items-center gap-3 group relative"
            title={`${date}: ${total.toLocaleString()} tokens`}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
              {total.toLocaleString()}
            </div>
            <div
              className="w-full flex flex-col justify-end"
              style={{ height: 160 }}
            >
              <div
                className="w-full rounded-lg transition-all group-hover:brightness-110 hover:shadow-lg"
                style={{
                  height: `${h}%`,
                  backgroundColor: COLORS.green,
                  opacity: 0.8,
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 rotate-45 origin-left whitespace-nowrap">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Pagination Bar (shared) ────────────────────────────
function PaginationBar({ page, pages, total, limit, onPage, onLimit }) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between mt-6 text-xs text-slate-500 flex-wrap gap-4 px-2">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">
          Rows:
        </span>
        <select
          value={limit}
          onChange={(e) => onLimit(Number(e.target.value))}
          className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-400 bg-white"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="font-medium bg-slate-100 px-3 py-1.5 rounded-xl">
          {from}–{to} of {total}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-xl hover:bg-slate-200 disabled:opacity-40 transition-all font-bold"
        >
          «
        </button>
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-xl hover:bg-slate-200 disabled:opacity-40 transition-all border border-slate-200"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-4 font-bold text-slate-700">
          Page {page} / {Math.max(pages, 1)}
        </span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="p-2 rounded-xl hover:bg-slate-200 disabled:opacity-40 transition-all border border-slate-200"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => onPage(pages)}
          disabled={page >= pages}
          className="px-3 py-1.5 rounded-xl hover:bg-slate-200 disabled:opacity-40 transition-all font-bold"
        >
          »
        </button>
      </div>
    </div>
  );
}

// ── Token Usage Table ──────────────────────────────────
function TokenTable({ apiFetch, onExport }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [opFilter, setOpFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = `?page=${page}&limit=${limit}${opFilter ? `&operation=${opFilter}` : ""}`;
    const res = await apiFetch(`/admin/token-usage${qs}`);
    if (res) setData(res);
    setLoading(false);
  }, [apiFetch, page, limit, opFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLimit = (n) => {
    setLimit(n);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="font-black text-slate-800 text-xl">Token Logs</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Real-time resource allocation monitoring
          </p>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={onExport}
            title="Export Tokens to Excel"
            className="flex items-center gap-2 px-3 py-2 mr-2 rounded-xl 
             text-blue-600 bg-blue-50 
             hover:bg-blue-600 hover:text-white 
             transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Export Token Logs</span>
          </button>
          <div className="w-px h-6 bg-slate-200 self-center mr-2" />
          {["", "extract", "optimize"].map((op) => (
            <button
              key={op}
              onClick={() => {
                setOpFilter(op);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${opFilter === op ? "text-white bg-blue-600 shadow-lg shadow-blue-100" : "text-slate-500 hover:text-slate-700"}`}
            >
              {op === ""
                ? "Everything"
                : op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}
          <button
            onClick={load}
            className="p-2 ml-2 rounded-xl text-slate-500 hover:bg-white hover:text-blue-600 transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              <th className="px-6 py-4 text-left">Action</th>
              <th className="px-6 py-4 text-right">In</th>
              <th className="px-6 py-4 text-right">Out</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-right">Latency</th>
              <th className="px-6 py-4 text-left pl-10">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!data?.records?.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-slate-400 font-medium"
                >
                  {loading
                    ? "Synchronizing records..."
                    : "No usage history found"}
                </td>
              </tr>
            ) : (
              data.records.map((r) => (
                <tr
                  key={r._id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-bold ${r.operation === "extract" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
                    >
                      {r.operation === "extract" ? (
                        <DocumentIcon size={24} />
                      ) : (
                        <ResumeOptimizeIcon size={24} />
                      )}
                      {r.operation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 font-mono">
                    {r.inputTokens?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 font-mono">
                    {r.outputTokens?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-800 font-mono">
                    {r.totalTokens?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500">
                      {r.durationMs
                        ? `${(r.durationMs / 1000).toFixed(2)}s`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-[11px] font-semibold pl-10">
                    {new Date(r.timestamp).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
        onLimit={handleLimit}
      />
    </div>
  );
}

// ── Leads Table ────────────────────────────────────────
function LeadsTable({ apiFetch, onExport }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = `?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    const res = await apiFetch(`/admin/leads${qs}`);
    if (res) setData(res);
    setLoading(false);
  }, [apiFetch, page, limit, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleLimit = (n) => {
    setLimit(n);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-black text-slate-800 text-xl">User Leads</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Manage {data?.total ?? 0} prospective candidates
            </p>
          </div>
          <button
            onClick={onExport}
            title="Export Leads to Excel"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 
             hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export Leads</span>
          </button>
        </div>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email..."
              className="pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 w-64 bg-slate-50 transition-all focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
          >
            Filter
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setPage(1);
              }}
              className="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-100 transition-all"
            >
              <X size={18} />
            </button>
          )}
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              <th className="px-6 py-4 text-left">Candidate</th>
              <th className="px-6 py-4 text-left">Contact Information</th>
              <th className="px-6 py-4 text-left">Lead Status</th>
              <th className="px-6 py-4 text-left pl-10">Acquisition Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!data?.leads?.length ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-slate-400 font-medium"
                >
                  {loading
                    ? "Initializing candidate pool..."
                    : search
                      ? "No matching candidates found"
                      : "Candidate pipeline is empty"}
                </td>
              </tr>
            ) : (
              data.leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <span className="font-bold text-slate-800">
                        {lead.name || "Anonymous User"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-slate-600 font-semibold text-xs">
                        {lead.email || "—"}
                      </p>
                      <p className="text-slate-400 text-[11px] font-medium">
                        {lead.phone || "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                      Extracted
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-[11px] font-semibold pl-10">
                    {new Date(lead.extractedAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
        onLimit={handleLimit}
      />
    </div>
  );
}

// ── Invoices Table ──────────────────────────────────────
function InvoicesTable({ apiFetch, onExport }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = `?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    const res = await apiFetch(`/admin/invoices${qs}`);
    if (res) setData(res);
    setLoading(false);
  }, [apiFetch, page, limit, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleLimit = (n) => {
    setLimit(n);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-black text-slate-800 text-xl">Invoices</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Manage {data?.total ?? 0} transaction records
            </p>
          </div>
          <button
            onClick={onExport}
            title="Export Invoices to Excel"
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
             bg-emerald-50 text-emerald-600 
             hover:bg-emerald-600 hover:text-white 
             transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export Invoices</span>
          </button>
        </div>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 focus-within:text-blue-500 transition-colors"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Invoice # or Customer..."
              className="pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 w-64 bg-slate-50 transition-all focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white transition-all bg-blue-600 shadow-lg shadow-blue-100"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              <th className="px-6 py-4 text-left">Invoice #</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-left pl-10">Purpose</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!data?.invoices?.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-slate-400 font-medium"
                >
                  {loading ? "Fetching transactions..." : "No invoices found"}
                </td>
              </tr>
            ) : (
              data.invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-700">
                      {inv.customerName}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">
                      {inv.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-blue-600">
                    ₹{(inv.amount / 100).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 pl-10">
                    <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500 uppercase tracking-widest">
                      {inv.purpose}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-[11px] font-semibold">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
        onLimit={handleLimit}
      />
    </div>
  );
}

// ── Pricing Tab ─────────────────────────────────────────
function PricingTab({ apiFetch }) {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch("/admin/pricing");
    if (res) setPricing(res);
    setLoading(false);
  }, [apiFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      download: { ...pricing.download },
      optimize: { ...pricing.optimize },
    };
    const res = await apiFetch("/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res && res._id) {
      alert("Global Pricing Policies Synchronized!");
      setPricing(res);
    } else {
      alert("Synchronization Error: Please check database connection.");
    }
    setSaving(false);
  };

  const handleChange = (section, field, value) => {
    // If it's a number field and the value is 0 or empty, we handle it carefully
    // to avoid the persistent '0' UI issue.
    setPricing((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleClearOffer = (section) => {
    setPricing((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        offerDiscount: 0,
        offerDuration: null,
      },
    }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  if (loading || !pricing)
    return (
      <div className="py-32 text-center flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
          Accessing Pricing Ledger...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="font-black text-slate-800 text-2xl tracking-tight">
              Revenue Configuration
            </h2>
            <p className="text-slate-400 font-semibold text-sm mt-1.5 focus:outline-none">
              Define active monetization strategy and seasonal offers
            </p>
          </div>
          <button
            type="submit"
            form="pricing-form"
            disabled={saving}
            className="px-10 py-3.5 rounded-2xl text-sm font-black text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 disabled:opacity-50 ring-4 ring-white"
          >
            {saving ? "Syncing..." : "Deploy Changes"}
          </button>
        </header>

        <form id="pricing-form" onSubmit={handleSave} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Download Policy */}
            <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <DocumentIcon size={24} />
                  </div>
                  <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest">
                    Original Resume
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleClearOffer("download")}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-all"
                >
                  <X size={12} /> Clear Offer
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase">
                    Retail Price (Raw)
                  </label>
                  <input
                    type="number"
                    value={
                      pricing.download.price === 0 ? "" : pricing.download.price
                    }
                    onChange={(e) =>
                      handleChange(
                        "download",
                        "price",
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                    placeholder="Enter raw value..."
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white bg-white/50 transition-all shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase">
                      Offer Discount (%)
                    </label>
                    <input
                      type="number"
                      value={
                        pricing.download.offerDiscount === 0
                          ? ""
                          : pricing.download.offerDiscount
                      }
                      onChange={(e) =>
                        handleChange(
                          "download",
                          "offerDiscount",
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="0"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-50 bg-white/50"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2 ml-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase">
                        Offer Expiry
                      </label>
                      {isExpired(pricing.download.offerDuration) && (
                        <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                          Expired
                        </span>
                      )}
                    </div>
                    <input
                      type="datetime-local"
                      value={formatDateForInput(pricing.download.offerDuration)}
                      onChange={(e) =>
                        handleChange(
                          "download",
                          "offerDuration",
                          e.target.value,
                        )
                      }
                      className={`w-full px-5 py-3.5 rounded-2xl border text-[11px] font-bold bg-white/50 transition-all ${isExpired(pricing.download.offerDuration) ? "border-red-300 ring-2 ring-red-50 text-red-600" : "border-slate-200"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Optimization Policy */}
            <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                    <ResumeOptimizeIcon size={24} />
                  </div>
                  <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest">
                    AI Optimized
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleClearOffer("optimize")}
                  className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-all"
                >
                  <X size={12} /> Clear Offer
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase">
                    Retail Price (Raw)
                  </label>
                  <input
                    type="number"
                    value={
                      pricing.optimize.price === 0 ? "" : pricing.optimize.price
                    }
                    onChange={(e) =>
                      handleChange(
                        "optimize",
                        "price",
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                    placeholder="Enter raw value..."
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white bg-white/50 transition-all shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase">
                      Offer Discount (%)
                    </label>
                    <input
                      type="number"
                      value={
                        pricing.optimize.offerDiscount === 0
                          ? ""
                          : pricing.optimize.offerDiscount
                      }
                      onChange={(e) =>
                        handleChange(
                          "optimize",
                          "offerDiscount",
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="0"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-50 bg-white/50"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2 ml-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase">
                        Offer Expiry
                      </label>
                      {isExpired(pricing.optimize.offerDuration) && (
                        <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                          Expired
                        </span>
                      )}
                    </div>
                    <input
                      type="datetime-local"
                      value={formatDateForInput(pricing.optimize.offerDuration)}
                      onChange={(e) =>
                        handleChange(
                          "optimize",
                          "offerDuration",
                          e.target.value,
                        )
                      }
                      className={`w-full px-5 py-3.5 rounded-2xl border text-[11px] font-bold bg-white/50 transition-all ${isExpired(pricing.optimize.offerDuration) ? "border-red-300 ring-2 ring-red-50 text-red-600" : "border-slate-200"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const apiFetch = useAdminFetch();
  const [stats, setStats] = useState(null);
  const [username, setUsername] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showExport, setShowExport] = useState(false);
  const [exportType, setExportType] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setUsername(localStorage.getItem("admin_username") || "Administrator");
    setAuthed(true);
  }, [router]);

  useEffect(() => {
    if (!authed) return;
    apiFetch("/admin/stats").then((data) => {
      if (data) setStats(data);
    });
  }, [apiFetch, authed]);

  if (!authed) return null;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    router.replace("/admin/login");
  };

  const handleShowExport = (type = "all") => {
    setExportType(type);
    setShowExport(true);
  };

  const extractStats = stats?.byOperation?.extract;
  const optimizeStats = stats?.byOperation?.optimize;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Dynamic Header */}
      <header className=" backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="border-l border-slate-200 pl-4">
              <img
                src="/assets/logo.png"
                alt="FixCVNow"
                className="h-12 object-contain"
              />
            </div>
          </div>

          <nav className="flex-1 flex items-center justify-center gap-1  p-1.5 rounded-2xl hidden lg:flex max-w-3xl">
            {[
              { id: "overview", label: "Dashboard", icon: LayoutDashboard },
              { id: "leads", label: "Leads", icon: Database },
              { id: "tokens", label: "Tokens", icon: Zap },
              { id: "invoices", label: "Invoices", icon: ReceiptText },
              { id: "pricing", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleShowExport("all")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              <Download size={14} /> Export
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-700 mt-1">
                  {username}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-inner"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Acquisition Pipeline"
                value={stats?.totalLeads?.toLocaleString()}
                color={COLORS.blue}
                iconSize={24}
                sub="Total Registered Leads"
              />
              <StatCard
                icon={DocumentIcon}
                label="Processed Invoices"
                value={stats?.totalExtracts?.toLocaleString()}
                color="#3B82F6"
                iconSize={24}
                sub={`${extractStats?.totalTokens.toLocaleString() || 0} Extraction Tokens`}
              />
              <StatCard
                icon={ResumeOptimizeIcon}
                label="AI Enhancements"
                value={stats?.totalOptimizes?.toLocaleString()}
                color={COLORS.green}
                iconSize={24}
                sub={`${optimizeStats?.totalTokens.toLocaleString() || 0} Optimization Tokens`}
              />
              <StatCard
                icon={QuickTemplatesIcon}
                label="Network Payload"
                value={stats?.totalTokens?.toLocaleString()}
                color="#F59E0B"
                iconSize={24}
                sub="Aggregate Token Consumption"
              />
            </div>

            <div className="">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="font-black text-slate-800 text-xl tracking-tight">
                      Consumption Metrics
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Aggregate AI resource utilization trends
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS.green }}
                    />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      Total Tokens
                    </span>
                  </div>
                </div>
                <DailyChart dailyUsage={stats?.dailyUsage} />
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <LeadsTable
              apiFetch={apiFetch}
              onExport={() => handleShowExport("leads")}
            />
          </div>
        )}

        {/* TOKENS TAB */}
        {activeTab === "tokens" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <TokenTable
              apiFetch={apiFetch}
              onExport={() => handleShowExport("tokens")}
            />
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === "invoices" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <InvoicesTable
              apiFetch={apiFetch}
              onExport={() => handleShowExport("invoices")}
            />
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === "pricing" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <PricingTab apiFetch={apiFetch} />
          </div>
        )}
      </main>

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        router={router}
        type={exportType}
      />
    </div>
  );
}
