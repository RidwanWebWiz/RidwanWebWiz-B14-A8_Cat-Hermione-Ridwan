const EventParticipants = require("../models/EventParticipants");
const Event = require("../models/Event");

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event date has passed
    if (new Date(event.eventDate) < new Date()) {
      return res.status(400).json({ message: "Cannot join past events" });
    }

    // Create participant record (Unique compound index will catch duplicates)
    const participation = await EventParticipants.create({
      eventId,
      userId,
      userEmail: req.user.email,
      userName: req.user.name || "Volunteer",
    });

    res.status(201).json({ message: "Successfully joined event", participation });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already joined this event" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events joined by currently authenticated user (sorted by event date)
// @route   GET /api/joined-events
// @access  Private
const getJoinedEvents = async (req, res) => {
  try {
    const participations = await EventParticipants.find({ userId: req.user._id }).populate("eventId");

    // Extract events and filter out nulls if an event was deleted, then sort by eventDate
    const events = participations
      .map((p) => p.eventId)
      .filter((event) => event !== null)
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get participants count and list for an event
// @route   GET /api/events/:id/participants
// @access  Public
const getEventParticipants = async (req, res) => {
  try {
    const participants = await EventParticipants.find({ eventId: req.params.id });
    res.status(200).json({
      count: participants.length,
      participants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  joinEvent,
  getJoinedEvents,
  getEventParticipants,
};