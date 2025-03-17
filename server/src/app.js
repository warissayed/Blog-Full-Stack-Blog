import express from "express";
import cors from "cors";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();

const corsOptions = {
  origin: "https://xzenblog.vercel.app",

  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://xzenblog.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use((req, res, next) => {
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);
  console.log("accessToken", req.Cookies);
  next();
});

app.use("/api/v1/users", router);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { app, server, io };
