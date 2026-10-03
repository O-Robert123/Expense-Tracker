'use client';
import { useEffect, useRef, useState } from 'react';
import ExpenseForm from './ExpenseForm';
import { categories } from '@/data/categories';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';
import isValidExpense from '@/utils/persistentExpenseLoadValidation';
import styles from './ExpenseTracker.module.css'


const sortOptions = [
    'Newest',
    'Oldest',
    'Highest amount',
    'Lowest amount'
]


export default function ExpenseTracker() {
    const [expenses, setExpenses] = useState([]);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sort, setSort] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoadFailed, setIsLoadFailed] = useState(false);
    const [isSaveFailed, setIsSaveFailed] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const filteredExpenses = expenses.filter(expense => expense.description.toLowerCase().includes(searchTerm.toLowerCase()) && (expense.category === categoryFilter || categoryFilter === ""));
    const sortedExpenses = sortExpenses(filteredExpenses);


    const dialogRef = useRef(null);
    const expenseDialogRef = useRef(null);


    function handleAddExpense(newExpense) {
        setExpenses(prev => [
            ...prev,
            {
                ...newExpense,
                id: prev.length === 0 ? 1 : Math.max(...prev.map(e => e.id)) + 1
            }
        ])
    };

    function handleRequestDelete(expense) {
        setExpenseToDelete(expense.id);
    }

    function handleDeleteExpense(id) {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
    };

    function handleEditExpense(expense) {
        setExpenseToEdit(expense);
    };

    function handleUpdateExpense(UpdatedExpense) {
        setExpenses(prev => prev.map(expense =>
            expense.id === expenseToEdit.id
                ? {
                    ...expense,
                    ...UpdatedExpense
                }
                : expense
        ));
    }

    function sortExpenses(array) {
        switch (sort) {
            case 'Newest':
                return [...array].sort((a, b) => new Date(b.date) - new Date(a.date));

            case 'Oldest':
                return [...array].sort((a, b) => new Date(a.date) - new Date(b.date));

            case 'Highest amount':
                return [...array].sort((a, b) => b.amount - a.amount);

            case 'Lowest amount':
                return [...array].sort((a, b) => a.amount - b.amount);

            default:
                return array;
        };
    };

    function saveExpenses() {
        if (!isLoaded || isLoadFailed) return
        try {
            localStorage.setItem('expenses', JSON.stringify(expenses));
            setIsSaveFailed(false);
        }
        catch (error) {
            console.error("Could not save expenses to local storage.");
            setIsSaveFailed(true);
        }
    }

    function handleFinishEditing() {
        setExpenseToEdit(null);
    }



    useEffect(() => {
        try {
            const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
            if (!Array.isArray(savedExpenses)) {
                throw new Error('Expense data is not an array.')
            }
            else if (!savedExpenses.every(expense => isValidExpense(expense))) {
                throw new Error('Expense information format invalid.')
            }
            else {
                setExpenses(savedExpenses);
                setIsLoadFailed(false);
            }
            setIsLoaded(true);
        }
        catch (error) {
            console.error('Stored expense data could not be loaded.', error);
            setIsLoaded(true);
            setIsLoadFailed(true);
        }
    }, []);

    useEffect(() => {
        saveExpenses();
    }, [expenses, isLoaded, isLoadFailed]);

    useEffect(() => {
        if (expenseToDelete) {
            dialogRef.current.showModal();
        }
    }, [expenseToDelete]);


    return (
        <main className={styles.expenseTracker}>
            {isLoadFailed && <p>We couldn't load your expenses.</p>}
            {isSaveFailed &&
                <div>
                    <p>We couldn't save your expenses. Your changes are still visible but they may be lost if you refresh.</p>
                    <button onClick={saveExpenses}>Retry Save</button>
                </div>}

            <header className={styles.header}>
                <div>
                    <h1 className={styles.heading}>Expense Tracker</h1>
                    <p className={styles.headingText}>Track all your spending with ease.</p>
                </div>
                <button className={styles.addExpenseBtn} onClick={() => { setIsFormOpen(true) }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>Add Expense</button>
            </header>


            <section>
                <ExpenseForm
                    onAddExpense={handleAddExpense}
                    expenseToEdit={expenseToEdit}
                    onFinishEditing={handleFinishEditing}
                    onUpdateExpense={handleUpdateExpense}
                    expenseDialogRef={expenseDialogRef}
                    isFormOpen={isFormOpen}
                    setIsFormOpen={setIsFormOpen}
                />
            </section>

            <section>
                <ExpenseSummary
                    filteredExpenses={filteredExpenses}
                />
            </section>

            <section className={styles.expenseList}>
                <div className={styles.sortAndSearchSection}>
                    <input className={styles.searchInput} type="text" placeholder='Search your expenses...' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                    <select className={styles.categorySelect} name="" id="" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                        <option value={""}>All categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select className={styles.sortSelect} name="" id="" value={sort} onChange={(event) => setSort(event.target.value)}>
                        <option value={""}>Sort by</option>
                        {sortOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <ExpenseList
                    onEditExpense={handleEditExpense}
                    sortedExpenses={sortedExpenses}
                    hasExpenses={expenses.length !== 0}
                    onRequestDelete={handleRequestDelete}
                />
            </section>

            <dialog ref={dialogRef}>
                <p>Are you sure you want to delete this expense?</p>
                <button onClick={() => {
                    setExpenseToDelete(null);
                    dialogRef.current.close();
                }}>Cancel</button>
                <button onClick={() => {
                    handleDeleteExpense(expenseToDelete);
                    dialogRef.current.close();
                    setExpenseToDelete(null);
                }}>Delete</button>
            </dialog>
        </main >
    )
}