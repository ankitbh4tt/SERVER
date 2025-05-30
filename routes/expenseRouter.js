const express = require("express");
const {
  createNewExpense,
  getAllExpenses,
  updateSingleExpenseByID,
  deleteSingleExpenseByID,
} = require("../controllers/expenseController");
const checkUserAuthentication = require("../middleware/authMiddleware");

const router = express.Router();

router.use(checkUserAuthentication);

// For adding a new expense
router.post("/new", createNewExpense);
router.get("/bulk", getAllExpenses);
router.put("/update/:id", updateSingleExpenseByID);
router.delete("/delete/:id", deleteSingleExpenseByID);

module.exports = router;
