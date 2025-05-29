const { z } = require("zod");

const newExpenseSchema = z.object({
  title: z
    .string({
      required_error: "Title is required!",
      invalid_type_error: "Title must be a string!",
    })
    .nonempty("Title cannot be empty!"),
  description: z.string(),
  amount: z
    .number({
      required_error: "Amount is required!",
      invalid_type_error: "Amount must be a number!",
    })
    .nonnegative("Amount must be in positive digits!"),
});

module.exports = { newExpenseSchema };
