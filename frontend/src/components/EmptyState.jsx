import { Link } from "react-router-dom";

export default function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light font-display text-lg text-brand">
        ?
      </div>
      {hasFilters ? (
        <>
          <p className="text-sm font-semibold text-ink">No tickets match</p>
          <p className="mt-1 max-w-xs text-sm text-ink/50">
            Try a different search term or switch the status filter back to
            all tickets.
          </p>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-ink">No tickets yet</p>
          <p className="mt-1 max-w-xs text-sm text-ink/50">
            Once a customer reaches out, log it here so nothing falls through
            the cracks.
          </p>
          <Link
            to="/new"
            className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Log the first ticket
          </Link>
        </>
      )}
    </div>
  );
}
