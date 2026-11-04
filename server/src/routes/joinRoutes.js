const express = require("express");
const router = express.Router();
const {
  joinEvent,
  getJoinedEvents,
  getEventParticipants,
} = require("../controllers/joinController");
const { protect } = require("../middleware/authMiddleware");

router.route("/events/:id/join").post(protect, joinEvent);
router.route("/joined-events").get(protect, getJoinedEvents);
router.route("/events/:id/participants").get(getEventParticipants);

module.exports = router;