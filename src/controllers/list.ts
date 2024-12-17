import { Request, Response } from "express";
import ListModel from "../models/list";
import ParticipantModel from "../models/participants";
import mongoose from "mongoose";

const ListController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log('[LIST CONTROLLER] Fetching all lists');
      const lists = await ListModel.find().populate("participants");
      console.log('[LIST CONTROLLER] Found lists:', lists.length);
      res.status(200).json(lists);
    } catch (err) {
      console.error('[LIST CONTROLLER] Error fetching lists:', err);
      res.status(500).json({
        error: "Erreur lors de la récupération des listes",
        details: err instanceof Error ? err.message : err,
      });
    }
  },

  async get(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      console.log(`[LIST CONTROLLER] Fetching list with ID: ${id}`);
      const list = await ListModel.findById(id).populate("participants");
      if (!list) {
        console.log(`[LIST CONTROLLER] List not found: ${id}`);
        res.status(404).json({ error: "Liste non trouvée" });
        return;
      }
      console.log('[LIST CONTROLLER] List found:', list);
      res.status(200).json(list);
    } catch (err) {
      console.error(`[LIST CONTROLLER] Error fetching list ${id}:`, err);
      res.status(500).json({
        error: "Erreur lors de la récupération de la liste",
        details: err instanceof Error ? err.message : err,
      });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    if (!name) {
      console.error('[LIST CONTROLLER] List name is required');
      res.status(400).json({ error: "Le nom de la liste est obligatoire" });
      return;
    }

    try {
      console.log('[LIST CONTROLLER] Creating new list:', name);
      const list = new ListModel({ name });
      await list.save();
      console.log('[LIST CONTROLLER] List created:', list);
      res
        .status(201)
        .json({ message: `Création de la liste ${list.name} réussie`, list });
    } catch (err) {
      console.error('[LIST CONTROLLER] Error creating list:', err);
      res.status(500).json({
        error: "Erreur lors de la création de la liste",
        details: err instanceof Error ? err.message : err,
      });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      console.log('[LIST CONTROLLER] Updating list:', { id, updates });

      if (!id) {
        res.status(400).json({ 
          error: "ID de liste requis",
          details: { id }
        });
        return;
      }

      // Conversion de l'ID en ObjectId
      let listObjectId: mongoose.Types.ObjectId;
      try {
        listObjectId = new mongoose.Types.ObjectId(id);
      } catch (idError) {
        res.status(400).json({ 
          error: "Format d'ID invalide",
          details: idError instanceof Error ? idError.message : String(idError)
        });
        return;
      }

      // Vérification de l'existence de la liste
      const list = await ListModel.findById(listObjectId);
      if (!list) {
        res.status(404).json({ 
          error: "Liste non trouvée",
          details: { id }
        });
        return;
      }

      // Mise à jour de la liste
      list.name = updates.name || list.name;
      const updatedList = await list.save();

      // Récupération de la liste avec les détails des participants
      const populatedList = await ListModel.findById(listObjectId).populate("participants");

      res.status(200).json(populatedList);
    } catch (error) {
      console.error("[LIST CONTROLLER] Erreur lors de la mise à jour de la liste:", error);
      
      res.status(500).json({ 
        error: "Erreur interne lors de la mise à jour de la liste",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log('[LIST CONTROLLER] Deleting list:', id);

      if (!id) {
        res.status(400).json({ 
          error: "ID de liste requis",
          details: { id }
        });
        return;
      }

      // Conversion de l'ID en ObjectId
      let listObjectId: mongoose.Types.ObjectId;
      try {
        listObjectId = new mongoose.Types.ObjectId(id);
      } catch (idError) {
        res.status(400).json({ 
          error: "Format d'ID invalide",
          details: idError instanceof Error ? idError.message : String(idError)
        });
        return;
      }

      // Vérification de l'existence de la liste
      const list = await ListModel.findById(listObjectId);
      if (!list) {
        res.status(404).json({ 
          error: "Liste non trouvée",
          details: { id }
        });
        return;
      }

      // Suppression de la liste
      await ListModel.findByIdAndDelete(listObjectId);

      res.status(200).json({
        message: "Liste supprimée avec succès",
        listId: id
      });
    } catch (error) {
      console.error("[LIST CONTROLLER] Erreur lors de la suppression de la liste:", error);
      
      res.status(500).json({ 
        error: "Erreur interne lors de la suppression de la liste",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  },

  async addParticipant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { participantId } = req.body;

      // Validation des paramètres d'entrée
      if (!id || !participantId) {
        res.status(400).json({ 
          error: "ID de liste et ID de participant sont requis",
          details: {
            listId: id,
            participantId: participantId
          }
        });
        return;
      }

      // Conversion des ID en ObjectId avec gestion des erreurs
      let listObjectId: mongoose.Types.ObjectId;
      let participantObjectId: mongoose.Types.ObjectId;

      try {
        listObjectId = new mongoose.Types.ObjectId(id);
        participantObjectId = new mongoose.Types.ObjectId(participantId);
      } catch (idError) {
        res.status(400).json({ 
          error: "Format d'ID invalide",
          details: idError instanceof Error ? idError.message : String(idError)
        });
        return;
      }

      // Vérification de l'existence de la liste
      const list = await ListModel.findById(listObjectId);
      if (!list) {
        res.status(404).json({ 
          error: "Liste non trouvée",
          details: { listId: id }
        });
        return;
      }

      // Vérification de l'existence du participant
      const participant = await ParticipantModel.findById(participantObjectId);
      if (!participant) {
        res.status(404).json({ 
          error: "Participant non trouvé",
          details: { participantId: participantId }
        });
        return;
      }

      // Vérification si le participant est déjà dans la liste
      const isParticipantInList = list.participants.some(
        existingParticipantId => existingParticipantId.equals(participantObjectId)
      );

      if (isParticipantInList) {
        res.status(409).json({ 
          error: "Participant déjà présent dans la liste",
          details: { 
            listId: id, 
            participantId: participantId 
          }
        });
        return;
      }

      // Ajout du participant à la liste
      list.participants.push(participantObjectId);
      
      // Sauvegarde de la liste mise à jour
      const updatedList = await list.save();

      // Récupération de la liste avec les détails des participants
      const populatedList = await ListModel.findById(listObjectId).populate("participants");

      res.status(200).json({
        message: "Participant ajouté avec succès",
        list: populatedList
      });

    } catch (error) {
      console.error("[LIST CONTROLLER] Erreur lors de l'ajout du participant:", error);
      
      res.status(500).json({ 
        error: "Erreur interne lors de l'ajout du participant",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  },

  async removeParticipant(req: Request, res: Response): Promise<void> {
    try {
      const { id, participantId } = req.params;

      // Validation des paramètres d'entrée
      if (!id || !participantId) {
        res.status(400).json({ 
          error: "ID de liste et ID de participant sont requis",
          details: {
            listId: id,
            participantId: participantId
          }
        });
        return;
      }

      // Conversion des ID en ObjectId avec gestion des erreurs
      let listObjectId: mongoose.Types.ObjectId;
      let participantObjectId: mongoose.Types.ObjectId;

      try {
        listObjectId = new mongoose.Types.ObjectId(id);
        participantObjectId = new mongoose.Types.ObjectId(participantId);
      } catch (idError) {
        res.status(400).json({ 
          error: "Format d'ID invalide",
          details: idError instanceof Error ? idError.message : String(idError)
        });
        return;
      }

      // Vérification de l'existence de la liste
      const list = await ListModel.findById(listObjectId);
      if (!list) {
        res.status(404).json({ 
          error: "Liste non trouvée",
          details: { listId: id }
        });
        return;
      }

      // Vérification si le participant est dans la liste
      const participantIndex = list.participants.findIndex(
        existingParticipantId => existingParticipantId.equals(participantObjectId)
      );

      if (participantIndex === -1) {
        res.status(404).json({ 
          error: "Participant non trouvé dans la liste",
          details: { 
            listId: id, 
            participantId: participantId 
          }
        });
        return;
      }

      // Suppression du participant de la liste
      list.participants.splice(participantIndex, 1);
      
      // Sauvegarde de la liste mise à jour
      const updatedList = await list.save();

      // Récupération de la liste avec les détails des participants
      const populatedList = await ListModel.findById(listObjectId).populate("participants");

      res.status(200).json({
        message: "Participant supprimé avec succès",
        list: populatedList
      });

    } catch (error) {
      console.error("[LIST CONTROLLER] Erreur lors de la suppression du participant:", error);
      
      res.status(500).json({ 
        error: "Erreur interne lors de la suppression du participant",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
};

export default ListController;
