import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import Routes from "./routes/index";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

Routes(app);

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB avant de démarrer le serveur
mongoose
  .connect(`mongodb://${MONGODB_URI}`)
  .then(() => {
    console.log("Connexion à MongoDB OK");

    // Démarrage du serveur Express une fois que la connexion à MongoDB est réussie
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}!`);
    });
  })

  .catch((err) => {
    console.warn("Problèmes durant la connexion à MongoDB:", err);
  });
