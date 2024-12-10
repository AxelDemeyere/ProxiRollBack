import mongoose from "mongoose";
const { Schema } = mongoose;

const ListSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    index: true // Ajout de l'index pour optimiser les recherches par nom
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "participants", 
    },
  ],
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Méthode virtuelle pour compter le nombre de participants
ListSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

const ListModel = mongoose.model("list", ListSchema);
export default ListModel;
