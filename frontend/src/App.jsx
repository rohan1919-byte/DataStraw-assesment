import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TicketList from "./pages/TicketList";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";

export default function App() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-white px-6 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand font-display text-xs font-semibold text-white">
              D
            </div>
            <span className="font-display text-base font-semibold text-ink">
              Deskline
            </span>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<TicketList />} />
            <Route path="/new" element={<NewTicket />} />
            <Route path="/tickets/:ticketId" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
