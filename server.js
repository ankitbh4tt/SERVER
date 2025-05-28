const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const userRouter = require("./routes/userRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server chal raha hai bhai 🔥");
});

// Routes setup yahan add karo (in future)
app.use("/api/v1/user", userRouter);

// Error handler last me
app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 4000;

// Run server only if DB is connected
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server chal raha hai on http://localhost:${PORT}`);
  });
});
