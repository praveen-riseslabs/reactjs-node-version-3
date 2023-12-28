import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    files: [
      {
        type: String,
      },
    ],
    trashed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

assetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const assetModel = mongoose.model("asset", assetSchema);

export { assetModel };
