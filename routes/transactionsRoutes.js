import express from "express";
import {
  createTransaction,
  deletTransactionById,
  getTranasactionByUser,
  getTransactionSummary,
} from "../controllers/transactionsController.js";
import rateLimiter from "../middleware/rateLimiter.js";

const transactionRouter = express.Router();

transactionRouter.post("/create", createTransaction);
transactionRouter.get("/summary/:userId", getTransactionSummary);
transactionRouter.get("/:userId", rateLimiter, getTranasactionByUser);
transactionRouter.delete("/:id", deletTransactionById);

export default transactionRouter;
