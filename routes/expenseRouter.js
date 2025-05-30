const express = require("express");
const {
  createNewExpense,
  getAllExpenses,
  updateSingleExpenseByID,
} = require("../controllers/expenseController");
const checkUserAuthentication = require("../middleware/authMiddleware");

const router = express.Router();

router.use(checkUserAuthentication);

// For adding a new expense
router.post("/new", createNewExpense);
router.get("/bulk", getAllExpenses);
router.put("/update/:id", updateSingleExpenseByID);

module.exports = router;
