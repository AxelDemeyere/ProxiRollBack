import mongoose from "mongoose";
const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    index: true // Ajout de l'index pour optimiser les recherches par nom
  },
  status: {
    type: String,
    enum: ['absent', 'present', 'maybe'],
    default: 'absent'
  },
  lastSelected: { type: Date, default: null },
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

const ParticipantModel = mongoose.model("participants", ParticipantSchema);
export default ParticipantModel;
