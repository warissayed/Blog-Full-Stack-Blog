import express from "express";
import cors from "cors";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Replace 'http://localhost:3000' with the actual origin of your frontend
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

console.log("Hello from server");

app.use("/api/v1/users", router);

console.log("done");

export { app };
