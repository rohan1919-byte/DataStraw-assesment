import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/client";
import TicketRow from "../components/TicketRow";
import EmptyState from "../components/EmptyState";

const FILTERS = ["All", "Open", "In Progress", "Closed"];

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    // Debounce the as-you-type search so we're not firing a request per
    // keystroke.
    const timer = setTimeout(async () => {
      try {
        const { data } = await getTickets({
          search: search || undefined,
          status: status === "All" ? undefined : status,
        });
        setTickets(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Couldn't load tickets. Is the API running?");
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, status]);

  const counts = useMemo(() => {
    const byStatus = { Open: 0, "In Progress": 0, Closed: 0 };
    tickets.forEach((t) => {
      if (byStatus[t.status] !== undefined) byStatus[t.status] += 1;
    });
    return byStatus;
  }, [tickets]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Tickets
          </h1>
          <p className="mt-1 text-sm text-ink/50">
            {tickets.length} showing · {counts.Open} open ·{" "}
            {counts["In Progress"]} in progress
          </p>
        </div>
        <Link
          to="/new"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          New ticket
        </Link>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ticket ID, or keyword"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 focus:border-brand"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                status === f
                  ? "bg-ink text-white"
                  : "bg-white text-ink/60 border border-line hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-status-open/30 bg-status-openBg px-4 py-3 text-sm text-status-open">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[68px] animate-pulse rounded-xl border border-line bg-white/70"
            />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState hasFilters={Boolean(search) || status !== "All"} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          {tickets.map((t) => (
            <TicketRow key={t.ticket_id} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
}
