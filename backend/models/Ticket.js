const mongoose = require("mongoose");

// Notes are stored as an embedded array on the ticket document rather than
// a separate collection. In MongoDB this is the idiomatic equivalent of the
// optional "notes" table in the spec (ticket_id FK + note_text + created_at):
// a note only ever belongs to one ticket and is always read together with
// it, so embedding avoids a needless join/second round trip.
const noteSchema = new mongoose.Schema(
  {
    note_text: { type: String, required: true, trim: true },
    // "note"   = written by an agent
    // "system" = generated automatically (e.g. a status change),
    //            so the ticket carries its own audit trail for free.
    type: { type: String, enum: ["note", "system"], default: "note" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: { type: String, required: true, unique: true, index: true },
    customer_name: { type: String, required: true, trim: true },
    customer_email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    notes: [noteSchema],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
