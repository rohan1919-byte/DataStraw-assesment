const Ticket = require("../models/Ticket");
const generateTicketId = require("../utils/generateTicketId");

const VALID_STATUSES = ["Open", "In Progress", "Closed"];

// POST /api/tickets
async function createTicket(req, res) {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({
        error:
          "customer_name, customer_email, subject and description are all required.",
      });
    }

    const ticket_id = await generateTicketId();

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
    });

    return res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (err) {
    console.error("createTicket error:", err);
    return res.status(500).json({ error: "Could not create ticket." });
  }
}

// GET /api/tickets?status=Open&search=jane
async function listTickets(req, res) {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== "All") {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status: ${status}` });
      }
      query.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { ticket_id: regex },
        { customer_name: regex },
        { customer_email: regex },
        { subject: regex },
        { description: regex },
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ created_at: -1 })
      .select("ticket_id customer_name subject status created_at");

    return res.json(tickets);
  } catch (err) {
    console.error("listTickets error:", err);
    return res.status(500).json({ error: "Could not fetch tickets." });
  }
}

// GET /api/tickets/:ticketId
async function getTicket(req, res) {
  try {
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    return res.json(ticket);
  } catch (err) {
    console.error("getTicket error:", err);
    return res.status(500).json({ error: "Could not fetch ticket." });
  }
}

// PUT /api/tickets/:ticketId
async function updateTicket(req, res) {
  try {
    const { status, notes } = req.body;
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status: ${status}` });
      }
      if (status !== ticket.status) {
        ticket.notes.push({
          note_text: `Status changed from ${ticket.status} to ${status}.`,
          type: "system",
        });
        ticket.status = status;
      }
    }

    if (notes && notes.trim()) {
      ticket.notes.push({ note_text: notes.trim() });
    }

    await ticket.save();

    return res.json({ success: true, updated_at: ticket.updated_at });
  } catch (err) {
    console.error("updateTicket error:", err);
    return res.status(500).json({ error: "Could not update ticket." });
  }
}

module.exports = { createTicket, listTickets, getTicket, updateTicket };
