const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add an event title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add an event description"],
    },
    category: {
      type: String,
      required: [true, "Please specify an event category"],
      enum: ["Cleanup", "Plantation", "Donation", "Winter Relief", "Healthcare", "Education", "Other"],
    },
    image: {
      type: String,
      required: [true, "Please provide a thumbnail image URL"],
    },
    location: {
      type: String,
      required: [true, "Please specify an event location"],
    },
    eventDate: {
      type: Date,
      required: [true, "Please specify a future event date"],
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    creatorEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting and upcoming date queries
eventSchema.index({ eventDate: 1 });

module.exports = mongoose.model("Event", eventSchema);