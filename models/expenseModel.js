const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: true,
      uppercase: true,
    },

    category: {
      type: String,
      enum: [
        "FOOD",
        "ENTERTAINMENT",
        "TRANSPORT",
        "SHOPPING",
        "BILLS",
        "OTHER",
      ],
      required: function () {
        return this.type === "EXPENSE";
      },
      uppercase: true,
    },

    source: {
      type: String,
      enum: ["SALARY", "FREELANCE", "INTEREST", "REFUND", "OTHER"],
      required: function () {
        return this.type === "INCOME";
      },
      uppercase: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be greater than 0."],
    },
    spentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
