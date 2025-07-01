const {
  newExpenseSchema,
  expenseDateRangeFilterationSchema,
  updateExpenseSchema,
} = require("../validators/expenseValidators");
const Expense = require("../models/expenseModel");
const { default: mongoose } = require("mongoose");
const { calculateExpenseSummary } = require("../utils/calculateExpenseSummary");

// Controller to create new expense
const createNewExpense = async (req, res, next) => {
  try {
    const validatedData = newExpenseSchema.parse(req.body);
    const { title, description, amount, type, category, source } =
      validatedData;

    // Build the object to save
    const expenseData = {
      title,
      description,
      amount,
      type,
      spentBy: req._id,
    };

    // Add category or source based on type
    if (type === "EXPENSE") {
      expenseData.category = category.toUpperCase();
    } else if (type === "INCOME") {
      expenseData.source = source.toUpperCase();
    }

    // Create and populate expense
    let expense = await Expense.create(expenseData);
    expense = await expense.populate("spentBy");

    return res.status(201).json({ expense });
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
    const allTnx = req.query?.allTnx || false;
    // set endDate to full day by setting hours
    endDate.setHours(23, 59, 59, 999);
    //fetch expenses on descending order
    const expenses = await Expense.find(
      {
        spentBy: req._id,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      { spentBy: 0, __v: 0 }
    ).sort({ createdAt: -1 });

    if (!expenses.length) {
      return res
        .status(200)
        .json({ message: "No Transaction found. Please create one" });
    }
    const expenseSummary = calculateExpenseSummary(expenses);
    const filteredExpenses = allTnx ? expenses : expenses.slice(0, 5);
    return res.status(200).json({ expenses: filteredExpenses, expenseSummary });
  } catch (error) {
    next(error);
  }
};

// Controller to update an expense
const updateSingleExpenseByID = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    if (!Object.keys(req.body).length) {
      return res
        .status(400)
        .json({ message: "At least one field must be updated" });
    }
    const updatedExpense = updateExpenseSchema.parse(req.body);
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

// Controller to delete an expense
const deleteSingleExpenseByID = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    if (!expenseId) {
      return res.status(404).json({ error: "Expense ID is missing !" });
    }
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: "Invalid Expense ID format!" });
    }
    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      spentBy: req._id,
    });
    if (!expense) {
      return res
        .status(400)
        .json({ message: "Expense not found or user is unauthorized!" });
    }
    return res.status(200).json({
      message: `${expense.title} removed successfully!`,
      expenseId: expense?._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewExpense,
  getAllExpenses,
  updateSingleExpenseByID,
  deleteSingleExpenseByID,
};
