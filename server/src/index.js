import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>this is the test feels good</h1>");
});

app.listen(4000, () => {
  console.log("Server is running on port http://localhost:4000");
});
