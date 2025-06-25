const calculateExpenseSummary = (expenses) => {
  if (!expenses) {
    console.error("No expense found");
    return;
  }

  const totalIncome = expenses
    .filter((exp) => exp.type.toLowerCase() === "income")
    .reduce((acc, exp) => acc + Number(exp.amount), 0);

  const totalExpenses = expenses
    .filter((exp) => exp.type.toLowerCase() === "expense")
    .reduce((acc, exp) => acc + Number(exp.amount), 0);

  const balanceTotal = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, balanceTotal };
};

module.exports = { calculateExpenseSummary };
