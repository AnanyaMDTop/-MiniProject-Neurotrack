import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    time: { type: Date, required: true }, // ⏰ store reminder time
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
