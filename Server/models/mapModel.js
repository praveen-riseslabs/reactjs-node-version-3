import mongoose from "mongoose";

const coords = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    trim: true,
  },
  longitude: {
    type: Number,
    required: true,
    trim: true,
  },
});

const coordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    points: [coords],
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const mapModel = mongoose.model("coord", coordSchema);

export { mapModel };
