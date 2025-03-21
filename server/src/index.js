import { app } from "./app.js";
import { server } from "./app.js";

import connectDB from "./db/db.js";
import dotenv from "dotenv";

dotenv.config(
  process.env.NODE_ENV === "production"
    ? {}
    : {
        path: "./.env",
      }
);

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running on port ${process.env.PORT}`);
    });
    server.on("error", (error) => {
      console.log("Error:", error);
      throw error;
    });
  })
  .catch((err) => console.log("mongodb connection failed ", err));

app.post("/", (req, res) => {
  res.json({ message: "Hello from server" });

  const { name, email, password } = req.body;
  req.json({ requestData: { name, email, password } });
  console.log(name, email, password);
});
