import express from "express";
import cors from "cors";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io; // Attach `io` to the request object
  next();
});

console.log("Hello from server");

app.use("/api/v1/users", router);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

console.log("done");

export { app, server, io };
