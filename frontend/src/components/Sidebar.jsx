import { NavLink } from "react-router-dom";

const navItem =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-ink text-white/90 md:flex">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-display text-sm font-semibold text-white">
          D
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-white">
          Deskline
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          All tickets
        </NavLink>
        <NavLink
          to="/new"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          New ticket
        </NavLink>
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/40">
        Internal support desk
      </div>
    </aside>
  );
}
