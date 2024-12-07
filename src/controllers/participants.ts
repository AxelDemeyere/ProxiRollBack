import { Request, Response } from "express";
import ParticipantModel from "../models/participants";

const ParticipantController = {
  getAll(req: Request, res: Response): void {
    ParticipantModel.find()
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
      .save()
      .then(() => {
        res.send({ result: `Création du participant ${participant.name} OK` });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ error: "Erreur lors de la création", details: err });
      });
  },

  update(req: Request, res: Response): void {
    const id = req.params.id;
    if (id) {
      ParticipantModel.findByIdAndUpdate(id, req.body, { new: true })
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
    } else {
      res.status(400).send({
        error: "Un ID est nécessaire pour mettre à jour un participant",
      });
    }
  },

  delete(req: Request, res: Response): void {
    const id = req.params.id;
    if (id) {
      ParticipantModel.findByIdAndDelete(id)
        .then(() => {
          res.send({ result: `Suppression du participant n°${id}` });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ error: "Erreur lors de la suppression", details: err });
        });
    } else {
      res.status(400).send({
        error: "Un ID est nécessaire pour la suppression du participant",
      });
    }
  },
};

// Export par défaut
export default ParticipantController;
