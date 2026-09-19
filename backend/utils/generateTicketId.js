const Counter = require("../models/Counter");

/**
 * Returns the next ticket id in the form TKT-0001, TKT-0002, ...
 * Backed by an atomic counter document so IDs never collide,
 * even under concurrent requests.
 */
async function generateTicketId() {
  const counter = await Counter.findByIdAndUpdate(
    "ticket_id",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(4, "0");
  return `TKT-${padded}`;
}

module.exports = generateTicketId;
