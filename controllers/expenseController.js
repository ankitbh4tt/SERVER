const {
  newExpenseSchema,
  expenseDateRangeFilterationSchema,
  updateExpenseSchema,
} = require("../validators/expenseValidators");
const Expense = require("../models/expenseModel");

// Controller to create new expense
const createNewExpense = async (req, res, next) => {
  try {
    const validatedData = newExpenseSchema.parse(req.body);
    const { title, description, amount } = validatedData;
    let expense = await Expense.create({
      title,
      description,
      amount,
      spentBy: req._id,
    });
    // Fetching User's detail who created this expense
    expense = await expense.populate("spentBy");
    return res.json({ expense });
  } catch (error) {
    next(error);
  }
};

// Controller to get expenses of a particular date range
const getAllExpenses = async (req, res, next) => {
  try {
    if (!req.query?.startDate || !req.query?.endDate) {
      return res.status(400).json({ error: "Please select date range!" });
    }
    const validatedData = expenseDateRangeFilterationSchema.parse(req.query);

    // set and format dates
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);

    // set endDate to full day by setting hours
    endDate.setHours(23, 59, 59, 999);
    //fetch expenses on descending order
    const expenses = await Expense.find({
      spentBy: req._id,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({
      createdAt: -1,
    });
    if (!expenses.length) {
      return res
        .status(200)
        .json({ message: "No expenses found. Please create one" });
    }
    return res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

// Controller to update a expense
const updateSingleExpenseByID = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "At least one field must be updated" });
    }
    const updatedExpense = updateExpenseSchema.parse(req.body);
    console.log(updatedExpense);
    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, spentBy: req._id },
      updatedExpense,
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: "No expense found!" });
    }
    return res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

module.exports = { createNewExpense, getAllExpenses, updateSingleExpenseByID };
