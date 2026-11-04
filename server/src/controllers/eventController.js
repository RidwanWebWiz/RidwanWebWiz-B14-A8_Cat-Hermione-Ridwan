const Event = require("../models/Event");

// @desc    Get all upcoming events (filter out past dates)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({ eventDate: { $gte: today } }).sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get 6 recent upcoming events for home page (.limit() operator)
// @route   GET /api/events/recent
// @access  Public
const getRecentEvents = async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({ eventDate: { $gte: today } })
      .sort({ eventDate: 1 })
      .limit(6);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, description, category, image, location, eventDate } = req.body;

    // Reject past event dates server-side
    if (new Date(eventDate) < new Date()) {
      return res.status(400).json({ message: "Event date must be in the future. Past dates are not allowed." });
    }

    const event = await Event.create({
      title,
      description,
      category,
      image,
      location,
      eventDate,
      creatorId: req.user._id,
      creatorEmail: req.user.email,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event (with strict ownership verification)
// @route   PATCH /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // SECURITY: Verify ownership on backend
    if (event.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own events" });
    }

    if (req.body.eventDate && new Date(req.body.eventDate) < new Date()) {
      return res.status(400).json({ message: "Event date must be in the future." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event (with strict ownership verification)
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // SECURITY: Verify ownership on backend
    if (event.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own events" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event removed successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events created by authenticated user
// @route   GET /api/events/manage/user
// @access  Private
const getUserCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ creatorId: req.user._id }).sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getRecentEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserCreatedEvents,
};