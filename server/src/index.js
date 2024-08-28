import express from "express";
// import { app } from "./app";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  res.json({ message: "Hello from server" });

  const { name, email, password } = req.body;
  req.json({ requestData: { name, email, password } });
  console.log(name, email, password);
});

app.listen(4000, () => {
  console.log("Server is running on port http://localhost:4000");
});
