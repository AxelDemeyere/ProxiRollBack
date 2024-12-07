import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import Routes from "./routes/index";

const app = express();

app.use(cors());
app.use(bodyParser.json());

Routes(app);

// Connexion à MongoDB avant de démarrer le serveur
mongoose
  .connect("mongodb://127.0.0.1:27017/ProxiRoll")
  .then(() => {
    console.log("Connexion à MongoDB OK");

    // Démarrage du serveur Express une fois que la connexion à MongoDB est réussie
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })

  .catch((err) => {
    console.warn("Problèmes durant la connexion à MongoDB:", err);
  });
