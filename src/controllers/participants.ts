import { Request, Response } from "express";
import ParticipantModel from "../models/participants";
import ListModel from "../models/list";
import mongoose from "mongoose";

const ParticipantController = {
  getAll(req: Request, res: Response): void {
    ParticipantModel.find()
      .populate("list")
      .then((participants) => {
        res.send(participants);
      })
      .catch((err) => {
        res.status(500).send({
          error: "Erreur lors de la récupération des participants",
          details: err,
        });
      });
  },

  get(req: Request, res: Response): void {
    const { id } = req.params;
    ParticipantModel.findById(id)
      .then((participant) => {
        if (participant) {
          res.send(participant);
        } else {
          res.status(404).send({ error: "Participant non trouvé" });
        }
      })
      .catch((err) => {
        res.status(500).send({
          error: "Erreur lors de la récupération du participant",
          details: err,
        });
      });
  },

  create(req: Request, res: Response): void {
    console.log('[CONTROLLER] Creating participant - Full request body:', JSON.stringify(req.body, null, 2));
    console.log('[CONTROLLER] Request headers:', JSON.stringify(req.headers, null, 2));

    // Validation du nom
    if (!req.body.name || typeof req.body.name !== 'string') {
      console.error('[CONTROLLER] Invalid participant name:', req.body.name);
      res.status(400).send({ 
        error: "Nom du participant invalide", 
        details: { name: req.body.name } 
      });
    }

    const participant = new ParticipantModel({
      name: req.body.name,
    });

    console.log('[CONTROLLER] Participant model before save:', JSON.stringify(participant, null, 2));

    participant
      .save() // Sauvegarde du participant
      .then((newParticipant) => {
        console.log('[CONTROLLER] Participant saved - Full response:', JSON.stringify(newParticipant, null, 2));

        if (!newParticipant) {
          console.error('[CONTROLLER] Participant creation failed - no participant returned');
          return res
            .status(500)
            .send({ error: "Échec de la création du participant" });
        }
        
        // Vérification explicite de l'_id
        if (!newParticipant._id) {
          console.error('[CONTROLLER] Participant created without _id:', JSON.stringify(newParticipant, null, 2));
          return res
            .status(500)
            .send({ error: "Participant créé sans _id" });
        }

        res.status(201).send(newParticipant); // Renvoie le participant créé
      })
      .catch((err) => {
        console.error('[CONTROLLER] Error creating participant - Full error:', JSON.stringify(err, null, 2));
        res
          .status(500)
          .send({ 
            error: "Erreur lors de la création", 
            details: {
              message: err.message,
              name: err.name,
              code: err.code,
              stack: err.stack
            } 
          });
      });
  },

  update(req: Request, res: Response): void {
    const id = req.params.id;
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      res
        .status(400)
        .send({ error: "Nom du participant manquant ou invalide" });
    }

    ParticipantModel.findByIdAndUpdate(id, { name }, { new: true })
      .then((participant) => {
        if (participant) {
          res.send({
            result: `Mise à jour du participant ${participant.name}`,
          });
        } else {
          res
            .status(404)
            .send({ error: "Participant non trouvé pour mise à jour" });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ error: "Erreur lors de la mise à jour", details: err });
      });
  },

  delete(req: Request, res: Response): void {
    const { id } = req.params;
    if (id) {
      ParticipantModel.findByIdAndDelete(id)
        .then((participant) => {
          if (participant) {
            res.send({
              result: `Suppression du participant ${participant.name} OK`,
            });
          } else {
            res
              .status(404)
              .send({ error: "Participant non trouvé pour suppression" });
          }
        })
        .catch((err) => {
          res
            .status(500)
            .send({ error: "Erreur lors de la suppression", details: err });
        });
    } else {
      res.status(400).send({
        error: "Identifiant du participant manquant",
      });
    }
  },

  async getAvailable(req: Request, res: Response): Promise<void> {
    try {
      // Récupérer tous les participants
      const allParticipants = await ParticipantModel.find();
      
      // Récupérer toutes les listes avec leurs participants
      const allLists = await ListModel.find();
      
      // Créer un Set de tous les IDs de participants qui sont dans des listes
      const assignedParticipantIds = new Set(
        allLists.flatMap(list => list.participants.map(id => id.toString()))
      );
      
      // Filtrer les participants qui ne sont pas dans des listes
      const availableParticipants = allParticipants.filter(
        participant => !assignedParticipantIds.has(participant._id.toString())
      );
      
      res.status(200).json(availableParticipants);
    } catch (err) {
      console.error("[CONTROLLER] Error getting available participants:", err);
      res.status(500).json({
        error: "Erreur lors de la récupération des participants disponibles",
        details: err instanceof Error ? err.message : err,
      });
    }
  },
};

// Export par défaut
export default ParticipantController;
