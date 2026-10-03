'use client';
import styles from './ExpenseSummary.module.css';
import { categoryColors } from '@/data/categoryColours';

export default function ExpenseSummary({ filteredExpenses }) {
    function calculateCategoricalTotalExpenses(arr) {
        return arr.reduce((acc, expense) => {
            if (acc[expense.category] === undefined) {
                acc[expense.category] = expense.amount;
            }
            else {
                acc[expense.category] += expense.amount;
            }
            return acc;
        }, {})
    }
    const categoryTotals = calculateCategoricalTotalExpenses(filteredExpenses);

    function calculateTotalExpenses(arr) {
        return arr.reduce((total, expense) => {
            total += expense.amount;
            return total;
        }, 0);
    };
    const totalExpenses = calculateTotalExpenses(filteredExpenses);

    return (
        <div className={styles.expenseSummary}>
            <div className={styles.totalContainer}><p className={styles.total}>Total</p>
            <p className={styles.totalAmount}>₦{totalExpenses.toLocaleString()}</p></div>
            {
        Object.keys(categoryTotals).map(category => (
            <div className={styles.expenseSummaryItem} key={category} style={{ backgroundColor: categoryColors[category] }}><p className={styles.category}>{category}</p>
                <p className={styles.categoryAmount}> ₦{categoryTotals[category].toLocaleString()}</p></div>
        ))
    }
        </div >
    )
}