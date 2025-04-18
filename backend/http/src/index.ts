import express from "express";

import cors from "cors";
import cookieparser from "cookie-parser";
import { authRouter } from "./routes/auth/auth.route";
import { roomRouter } from "./routes/room/room.route";
import { userRouter } from "./routes/user/user.route";

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://yourdomain.com",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/user", userRouter);

app.get("/", async (req, res) => {
  res.send("Hello World! , From StudySync");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
