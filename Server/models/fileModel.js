import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
    },
  },
  { timestamps: true }
);

const fileModel = mongoose.model("file", fileSchema);

export { fileModel };
