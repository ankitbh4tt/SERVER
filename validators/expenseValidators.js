const { z } = require("zod");

const newExpenseSchema = z
  .object({
    title: z
      .string({
        required_error: "Title is required!",
        invalid_type_error: "Title must be a string!",
      })
      .nonempty("Title cannot be empty!"),

    description: z.string().optional(),

    amount: z
      .number({
        required_error: "Amount is required!",
        invalid_type_error: "Amount must be a number!",
      })
      .nonnegative("Amount must be a positive number!"),

    type: z.enum(["INCOME", "EXPENSE"], {
      required_error: "Type is required!",
      invalid_type_error: "Type must be INCOME or EXPENSE!",
    }),

    category: z.string().optional(), // Will validate conditionally
    source: z.string().optional(), // Will validate conditionally
  })
  .refine(
    (data) => {
      if (data.type === "EXPENSE") return !!data.category;
      return true;
    },
    {
      path: ["category"],
      message: "Category is required when type is EXPENSE.",
    }
  )
  .refine(
    (data) => {
      if (data.type === "INCOME") return !!data.source;
      return true;
    },
    {
      path: ["source"],
      message: "Source is required when type is INCOME.",
    }
  );
const expenseDateRangeFilterationSchema = z.object({
  startDate: z
    .string({
      required_error: "Start date is required!",
      invalid_type_error: "Start date must be a date type!",
    })
    .transform((val) => new Date(val)),
  endDate: z
    .string({
      required_error: "End date is required!",
      invalid_type_error: "End date must be a date type!",
    })
    .transform((val) => new Date(val)),
});

const updateExpenseSchema = z
  .object({
    title: z.string().optional(),

    description: z.string().optional(),

    amount: z
      .number({
        invalid_type_error: "Amount must be a number!",
      })
      .nonnegative("Amount must be a positive number!")
      .optional(),

    type: z.enum(["INCOME", "EXPENSE"]).optional(),

    category: z.string().optional(), // Only for EXPENSE
    source: z.string().optional(), // Only for INCOME
  })
  .refine(
    (data) => {
      if (data.type === "EXPENSE") return !!data.category;
      return true;
    },
    {
      path: ["category"],
      message: "Category is required when type is EXPENSE.",
    }
  )
  .refine(
    (data) => {
      if (data.type === "INCOME") return !!data.source;
      return true;
    },
    {
      path: ["source"],
      message: "Source is required when type is INCOME.",
    }
  );

module.exports = {
  newExpenseSchema,
  expenseDateRangeFilterationSchema,
  updateExpenseSchema,
};
