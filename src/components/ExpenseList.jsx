import ExpenseItem from "./ExpenseItem";

export default function ExpenseList({sortedExpenses, onDeleteExpense, onEditExpense, hasExpenses}) {
    return (
        <div>
                {sortedExpenses.length !== 0 ?
                    sortedExpenses.map(expense => (
                        <ExpenseItem 
                        onDeleteExpense={onDeleteExpense}
                        onEditExpense={onEditExpense}
                        expense={expense}
                        key={expense.id}
                        />
                    ))
                    : <p>{hasExpenses ? "No expenses yet!" : "No expenses match your search/filter."}</p>
                }
            </div>
    )
}