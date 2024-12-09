import { Request, Response } from "express";
import ListModel from "../models/list";

const ListController = {
  getAll(req: Request, res: Response): void {
    ListModel.find()
      .populate("participants")
      .then((lists) => {
        res.send(lists);
      })
      .catch((err) => {
        res.status(500).send({
          error: "Erreur lors de la récupération des listes",
          details: err,
        });
      });
  },

  get(req: Request, res: Response): void {
    const { id } = req.params;
    ListModel.findById(id)
      .then((list) => {
        if (list) {
          res.send(list);
        } else {
          res.status(404).send({ error: "Liste non trouvée" });
        }
      })
      .catch((err) => {
        res.status(500).send({
          error: "Erreur lors de la récupération de la liste",
          details: err,
        });
      });
  },

  create(req: Request, res: Response): void {
    const list = new ListModel({
      name: req.body.name,
    });

    list
      .save()
      .then(() => {
        res.send({ result: `Création de la liste ${list.name} OK` });
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
      ListModel.findByIdAndUpdate(id, req.body, { new: true })
        .then((list) => {
          if (list) {
            res.send({
              result: `Mise à jour de la liste ${list.name}`,
            });
          } else {
            res.status(404).send({ error: "Liste non trouvée" });
          }
        })
        .catch((err) => {
          res.status(500).send({
            error: "Erreur lors de la mise à jour de la liste",
            details: err,
          });
        });
    } else {
      res.status(400).send({ error: "Identifiant de liste manquant" });
    }
  },

  delete(req: Request, res: Response): void {
    const { id } = req.params;
    ListModel.findByIdAndDelete(id)
      .then((list) => {
        if (list) {
          res.send({ result: `Suppression de la liste ${list.name} OK` });
        } else {
          res.status(404).send({ error: "Liste non trouvée" });
        }
      })
      .catch((err) => {
        res.status(500).send({
          error: "Erreur lors de la suppression de la liste",
          details: err,
        });
      });
  },
};

export default ListController;
