import { app } from "./app.js";

import connectDB from "./db/db.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running on port ${process.env.PORT}`);
    });
    app.on("error", (error) => {
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

// app.listen(4000, () => {
//   console.log("Server is running on port http://localhost:4000");
// });
