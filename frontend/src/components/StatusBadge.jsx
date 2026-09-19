const STYLES = {
  Open: "text-status-open bg-status-openBg border-status-open/30",
  "In Progress": "text-status-progress bg-status-progressBg border-status-progress/30",
  Closed: "text-status-closed bg-status-closedBg border-status-closed/30",
};

export default function StatusBadge({ status, className = "" }) {
  const style = STYLES[status] || "text-ink bg-line/40 border-line";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
