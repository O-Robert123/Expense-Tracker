import ExpenseItem from "./ExpenseItem";

export default function ExpenseList({sortedExpenses, onEditExpense, hasExpenses, onRequestDelete}) {
    return (
        <div>
                {sortedExpenses.length !== 0 ?
                    sortedExpenses.map(expense => (
                        <ExpenseItem 
                        onEditExpense={onEditExpense}
                        expense={expense}
                        key={expense.id}
                        onRequestDelete={onRequestDelete}
                        />
                    ))
                    : <p>{hasExpenses ?  "No expenses match your search/filter." : "No expenses yet!"}</p>
                }
            </div>
    )
}