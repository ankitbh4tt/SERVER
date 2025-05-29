const express = require("express");
const { createNewExpense } = require("../controllers/expenseController");
const checkUserAuthentication = require("../middleware/authMiddleware");

const router = express.Router();

router.use(checkUserAuthentication);

// For adding a new expense
router.post("/new", createNewExpense);

module.exports = router;
