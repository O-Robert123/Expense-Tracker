export default function ExpenseItem({onEditExpense, expense, onRequestDelete}) {
    return (
        <div>
            <div>
                <p>{expense.description}</p>
                <p>{expense.amount}</p>
                <p>{expense.category}</p>
                <p>{expense.date}</p>
            </div>
            <div>
                <button className='delete-btn' onClick={() => onRequestDelete(expense)}>Delete</button>
                <button className='edit-btn' onClick={() => onEditExpense(expense)}>Edit</button>
            </div>
        </div>
    )
}