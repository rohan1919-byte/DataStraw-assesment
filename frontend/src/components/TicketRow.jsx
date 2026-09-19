import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export default function TicketRow({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.ticket_id}`}
      className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-line bg-white px-5 py-4 transition-colors last:border-b-0 last:rounded-b-xl first:rounded-t-xl hover:bg-brand-light/40 sm:gap-6"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 font-display text-xs font-semibold text-ink/70">
        {initials(ticket.customer_name)}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">
          {ticket.subject}
        </p>
        <p className="mt-0.5 truncate text-xs text-ink/50">
          {ticket.customer_name}
          <span className="mx-1.5 font-mono text-[11px] text-ink/30">
            {ticket.ticket_id}
          </span>
        </p>
      </div>

      <StatusBadge status={ticket.status} className="hidden sm:inline-flex" />

      <span className="whitespace-nowrap text-xs text-ink/40">
        {formatDate(ticket.created_at)}
      </span>
    </Link>
  );
}
