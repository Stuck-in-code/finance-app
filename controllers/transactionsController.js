import { sql } from "../config/db.js";

// creating a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !category || !user_id || amount === undefined) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES(${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;
    res.json(transaction);
    console.log(transaction);
  } catch (error) {
    console.log("error creating transaction", error);
    res.json({ messsage: "internal server error" });
  }
};

// Get transactions by user ID

export const getTranasactionByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.json(transactions);
  } catch (error) {
    console.log("error getting transactions", error);
    res.json({ messsage: "internal server error" });
  }
};

// Delete transaction by id

export const deletTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id)))
      return res.status(400).json({ message: "invalid transactin Id" });
    const result = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "transaction not found" });
    }

    res.json({ message: "transaction deleted successfully" });
  } catch (error) {
    console.log("error getting transactions", error);
    res.json({ messsage: "internal server error" });
  }
};

export const getTransactionSummary = async (req, res) => {
  const { userId } = req.params;
  console.log("userId is:", userId);
  try {
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions
       WHERE user_id = ${userId} and amount > 0
    `;
    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expense FROM transactions
       WHERE user_id = ${userId} and amount < 0
    `;

    res.json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.log("error getting transactions summary", error);
    res.json({ messsage: "internal server error" });
  }
};
