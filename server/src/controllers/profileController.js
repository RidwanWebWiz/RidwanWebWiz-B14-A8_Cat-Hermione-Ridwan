const User = require("../models/User");
const Event = require("../models/Event");
const EventParticipants = require("../models/EventParticipants");

// @desc    Get authenticated user profile and stats
// @route   GET /api/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const createdCount = await Event.countDocuments({ creatorId: user._id });
    const joinedCount = await EventParticipants.countDocuments({ userId: user._id });

    res.status(200).json({
      ...user.toObject(),
      createdEventCount: createdCount,
      joinedEventCount: joinedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update authenticated user profile
// @route   PATCH /api/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.image = req.body.image !== undefined ? req.body.image : user.image;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};