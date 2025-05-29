const { newExpenseSchema } = require("../validators/expenseValidators");
const Expense = require("../models/expenseModel");

// Controller to create new expense
const createNewExpense = async (req, res, next) => {
  try {
    const validatedData = newExpenseSchema.parse(req.body);
    const { title, description, amount } = validatedData;
    const expense = await Expense.create({
      title,
      description,
      amount,
      spentBy: req._id,
    });
    return res.json({ expense });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNewExpense };
