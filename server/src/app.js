import express from "express";
import cors from "cors";
import router from "./routes/user.routes.js";

const app = express();
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests
console.log("Hello from server");

app.use("/api/v1/users", router);
//
console.log("done");

export { app };
