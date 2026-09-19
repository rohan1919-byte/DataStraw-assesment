const express = require("express");
const router = express.Router();
const {
  createTicket,
  listTickets,
  getTicket,
  updateTicket,
} = require("../controllers/ticketController");

router.post("/", createTicket);
router.get("/", listTickets);
router.get("/:ticketId", getTicket);
router.put("/:ticketId", updateTicket);

module.exports = router;
