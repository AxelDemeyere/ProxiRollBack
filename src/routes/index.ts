import { Express, Request, Response } from "express";
import ListController from "../controllers/list";
import ParticipantController from "../controllers/participants";

const Routes = (server: Express) => {
  //Participants
  server.get("/participants/available", (req: Request, res: Response) => {
    ParticipantController.getAvailable(req, res);
  });

  server.get("/participants", (req: Request, res: Response) => {
    ParticipantController.getAll(req, res);
  });

  server.get("/participants/:id", (req: Request, res: Response) => {
    ParticipantController.get(req, res);
  });

  server.post("/participants", (req: Request, res: Response) => {
    ParticipantController.create(req, res);
  });

  server.patch("/participants/:id", (req: Request, res: Response) => {
    ParticipantController.update(req, res);
  });

  server.delete("/participants/:id", (req: Request, res: Response) => {
    ParticipantController.delete(req, res);
  });

  //Listes
  server.get("/listes", (req: Request, res: Response) => {
    ListController.getAll(req, res);
  });

  server.get("/listes/:id", (req: Request, res: Response) => {
    ListController.get(req, res);
  });

  server.post("/listes", (req: Request, res: Response) => {
    ListController.create(req, res);
  });

  server.patch("/listes/:id", (req: Request, res: Response) => {
    ListController.update(req, res);
  });

  server.delete("/listes/:id", (req: Request, res: Response) => {
    ListController.delete(req, res);
  });

  // Routes pour la gestion des participants dans les listes
  server.patch("/listes/:id/participants", (req: Request, res: Response) => {
    ListController.addParticipant(req, res);
  });

  server.delete("/listes/:id/participants/:participantId", (req: Request, res: Response) => {
    ListController.removeParticipant(req, res);
  });
};

export default Routes;
