import express from "express";
import Reminder from "../models/Reminder.js";

const router = express.Router();

// GET all reminders
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { text, time } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Reminder text is required" });
    }
    if (!time) {
      return res.status(400).json({ error: "Reminder time is required" });
    }

    const newReminder = new Reminder({ text: text.trim(), time });
    await newReminder.save();
    res.json(newReminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// DELETE a reminder
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
