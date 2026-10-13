import ExpenseItem from "./ExpenseItem";
import { categoryColors } from "@/data/categoryColours";
import styles from "@/components/ExpenseList.module.css"

export default function ExpenseList({sortedExpenses, onEditExpense, hasExpenses, onRequestDelete}) {
    return (
        <div className={styles.ExpenseListContainer}>
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