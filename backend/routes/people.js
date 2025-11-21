// backend/routes/people.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Person  from "../models/Person.js";


const router = express.Router();



// Get all people for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const people = await Person.find({ userId: req.user.id });
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new person for logged-in user
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("➡️ Body:", req.body);
    console.log("➡️ User from token:", req.user);

    const { name, relation } = req.body;
    if (!name || !relation) return res.status(400).json({ message: "Name and relation required" });

    const person = new Person({
      name,
      relation,
      userId: req.user.id, // link to logged-in user
    });

    await person.save();
    res.json(person);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding person" });
  }
});

// Delete person by ID (logged-in user only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const person = await Person.findOne({ _id: req.params.id, userId: req.user.id });
    if (!person) return res.status(404).json({ message: "Person not found" });

    await person.deleteOne();
    res.json({ message: "Person deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting person" });
  }
});

export default router;
