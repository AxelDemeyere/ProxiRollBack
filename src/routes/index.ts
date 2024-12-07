import { Express, Request, Response } from "express";
import ParticipantController from "../controllers/participants";

const Routes = (server: Express) => {
  server.get("/participants", (req: Request, res: Response) => {
    ParticipantController.getAll(req, res);
  });

  server.get("/participants/:id", (req: Request, res: Response) => {
    ParticipantController.get(req, res);
  });

  server.post("/participants", (req: Request, res: Response) => {
    ParticipantController.create(req, res);
  });

  server.put("/participants/:id", (req: Request, res: Response) => {
    ParticipantController.update(req, res);
  });

  server.delete("/participants/:id", (req: Request, res: Response) => {
    ParticipantController.delete(req, res);
  });
};

export default Routes;
