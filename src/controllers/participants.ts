import { Request, Response } from "express";
import ParticipantModel from "../models/participants";

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
    const participant = new ParticipantModel({
      name: req.body.name,
    });

    participant
      .save() // Sauvegarde du participant
      .then((newParticipant) => {
        if (!newParticipant) {
          return res
            .status(500)
            .send({ error: "Échec de la création du participant" });
        }
        res.send({
          result: `Création du participant ${newParticipant.name} OK`,
        });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ error: "Erreur lors de la création", details: err });
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
};

// Export par défaut
export default ParticipantController;
