import express from "express";
import cors from "cors";
import router from "./routes/user.routes.js";

const app = express();

// Replace 'http://localhost:3000' with the actual origin of your frontend
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // To parse incoming JSON requests
console.log("Hello from server");

app.use("/api/v1/users", router);

console.log("done");

export { app };
