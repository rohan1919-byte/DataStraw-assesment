import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { getTicket, updateTicket } from "../api/client";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["Open", "In Progress", "Closed"];

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const { data } = await getTicket(ticketId);
      setTicket(data);
    } catch (err) {
      if (err?.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    load();
  }, [load]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  async function handleStatusChange(status) {
    if (!ticket || status === ticket.status) return;
    setSavingStatus(true);
    const previous = ticket.status;
    setTicket((t) => ({ ...t, status }));
    try {
      await updateTicket(ticketId, { status });
      showToast(`Status set to ${status}`);
    } catch (err) {
      setTicket((t) => ({ ...t, status: previous }));
      showToast("Couldn't update status. Try again.");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await updateTicket(ticketId, { notes: noteText.trim() });
      setNoteText("");
      await load();
      showToast("Note added");
    } catch (err) {
      showToast("Couldn't save the note. Try again.");
    } finally {
      setSavingNote(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
        <div className="h-6 w-40 animate-pulse rounded bg-line" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-line/60" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-10">
        <p className="font-display text-xl font-semibold text-ink">
          Ticket not found
        </p>
        <p className="mt-2 text-sm text-ink/50">
          {ticketId} doesn't match anything in the system.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand">
          Back to all tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All tickets
      </Link>

      {/* Ticket stub header */}
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div>
            <p className="font-mono text-xs tracking-wide text-ink/40">
              {ticket.ticket_id}
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
              {ticket.subject}
            </h1>
            <p className="mt-2 text-sm text-ink/50">
              Filed {formatDateTime(ticket.created_at)}
            </p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <div className="bg-perforation h-px w-full" />

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Customer
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {ticket.customer_name}
            </p>
            <p className="text-sm text-ink/50">{ticket.customer_email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Last updated
            </p>
            <p className="mt-1 text-sm text-ink">
              {formatDateTime(ticket.updated_at)}
            </p>
          </div>
        </div>

        <div className="border-t border-line px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
            Description
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Status control */}
      <div className="mt-5 rounded-xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-ink">Update status</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              disabled={savingStatus}
              onClick={() => handleStatusChange(s)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
                ticket.status === s
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink/60 hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Notes + activity trail */}
      <div className="mt-5 rounded-xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-ink">Activity</p>
        <p className="mt-0.5 text-xs text-ink/40">
          Notes you add here, plus an automatic record of status changes.
          Visible to your team only, not the customer.
        </p>

        <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this ticket…"
            className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-brand"
          />
          <button
            type="submit"
            disabled={savingNote || !noteText.trim()}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-light disabled:opacity-50"
          >
            Add
          </button>
        </form>

        <ul className="mt-4 space-y-3">
          {ticket.notes.length === 0 ? (
            <li className="text-sm text-ink/40">No notes yet.</li>
          ) : (
            [...ticket.notes]
              .reverse()
              .map((n, i) =>
                n.type === "system" ? (
                  <li
                    key={n._id || i}
                    className="flex items-center gap-2 px-1 text-xs text-ink/40"
                  >
                    <span className="h-1 w-1 rounded-full bg-ink/30" />
                    {n.note_text}
                    <span className="text-ink/25">
                      · {formatDateTime(n.created_at)}
                    </span>
                  </li>
                ) : (
                  <li key={n._id || i} className="rounded-lg bg-paper px-3.5 py-3">
                    <p className="text-sm text-ink/80">{n.note_text}</p>
                    <p className="mt-1 text-xs text-ink/35">
                      {formatDateTime(n.created_at)}
                    </p>
                  </li>
                )
              )
          )}
        </ul>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-ink px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
