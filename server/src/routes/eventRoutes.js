const express = require("express");
const router = express.Router();
const {
  getEvents,
  getRecentEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserCreatedEvents,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getEvents).post(protect, createEvent);
router.route("/recent").get(getRecentEvents);
router.route("/manage/user").get(protect, getUserCreatedEvents);
router.route("/:id").get(getEventById).patch(protect, updateEvent).delete(protect, deleteEvent);

module.exports = router;