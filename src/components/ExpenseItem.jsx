import styles from "@/components/ExpenseItem.module.css";
import { Utensils, CarFront, Tv, Receipt, ShoppingCart, Ellipsis } from "lucide-react";
import { categoryColors } from "@/data/categoryColours";

const categoryIcons = {
    Food: Utensils,
    Transport: CarFront,
    Entertainment: Tv,
    Bills: Receipt,
    Shopping: ShoppingCart,
    Other: Ellipsis
};
const categoryIconColors = {
    Food: "#86EFAC",
    Transport: "#93C5FD",
    Entertainment: "#D8B4FE",
    Bills: "#FCA5A5",
    Shopping: "#FCD34D",
    Other: "#CBD5E1"
};

export default function ExpenseItem({ onEditExpense, expense, onRequestDelete }) {
    const Icon = categoryIcons[expense.category];
    return (
        <div className={styles.expenseItem}>
            <div className={styles.expenseItemInfo}>
                {Icon && <span className={styles.iconOuterSpan} style={{ backgroundColor: categoryIconColors[expense.category] }}><Icon size={30} color={categoryColors[expense.category]} className={styles.Icon} /></span>}
                <div className={styles.allExpenseInfo}>
                    <p className={styles.expenseDescription}>{expense.description}</p>
                    <p className={styles.expenseCategory}><span className={styles.expenseCategorySpan}>{expense.category}</span><span className={styles.expenseDateSpan}>{expense.date}</span></p>
                </div>
                <p className={styles.expenseAmount}>#{expense.amount}</p>
            </div>
            <div className={styles.expenseItemBtns}>
                <button className={styles.deleteBtn} onClick={() => onRequestDelete(expense)}>Delete</button>
                <button className={styles.editBtn} onClick={() => onEditExpense(expense)}>Edit</button>
            </div>
        </div >
    )
}