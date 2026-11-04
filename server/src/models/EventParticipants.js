const mongoose = require("mongoose");

const eventParticipantsSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL REQUIREMENT: Unique compound index to prevent duplicate registrations
eventParticipantsSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("EventParticipants", eventParticipantsSchema);