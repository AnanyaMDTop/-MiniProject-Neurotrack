// backend/models/Person.js
import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
   // owner (patient/caregiver/doctor)
  name: { type: String, required: true,trim:true },
  relation: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // friend, caregiver, doctor, etc.
}, { timestamps: true });

const Person = mongoose.model("Person", personSchema);

export default Person;