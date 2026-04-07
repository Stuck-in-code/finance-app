import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import transactionRouter from "./routes/transactionsRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/transaction", transactionRouter);


app.get("/", (req, res) => {
  res.status(200).send("my app is working alright");
});

const port = process.env.PORT || 8000;

initDB().then(() => {
  app.listen(port, () => {
    console.log(`server is live on port: ${port}`);
  });
});
