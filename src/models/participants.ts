import mongoose from "mongoose";
const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  name: { type: String, required: true },
});

const ParticipantModel = mongoose.model("participant", ParticipantSchema);
export default ParticipantModel;
