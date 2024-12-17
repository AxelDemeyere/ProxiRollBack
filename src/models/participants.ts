import mongoose from "mongoose";
const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['absent', 'present', 'maybe'],
    default: 'absent'
  },
  lastSelected: { type: Date, default: null },
}, {
  timestamps: true
});

const ParticipantModel = mongoose.model("participants", ParticipantSchema);
export default ParticipantModel;
