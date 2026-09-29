'use client';
import { useEffect, useRef, useState } from 'react';
import ExpenseForm from './ExpenseForm';
import { categories } from '@/data/categories';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';


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
    const [storageError, setStorageError] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const filteredExpenses = expenses.filter(expense => expense.description.toLowerCase().includes(searchTerm.toLowerCase()) && (expense.category === categoryFilter || categoryFilter === ""));
    const sortedExpenses = sortExpenses(filteredExpenses);


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

    function handleFinishEditing() {
        setExpenseToEdit(null);
    }

    useEffect(() => {
        try {
            const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
            if (!Array.isArray(savedExpenses)) {
                setStorageError(true);
            }
            else {
                setExpenses(savedExpenses);
                setStorageError(false);
            }
            setIsLoaded(true);

        }
        catch (error) {
            console.error('Stored expense data could not be loaded.');
            setIsLoaded(true);
            setStorageError(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded || storageError) return
        try {
            localStorage.setItem('expenses', JSON.stringify(expenses));
        }
        catch (error) {
            console.error("Could not save expenses to local storage.");
            setStorageError(true);
        }
    }, [expenses, isLoaded, storageError]);

    const dialogRef = useRef(null);

    useEffect(() => {
        if (expenseToDelete) {
            dialogRef.current.showModal();
        }
    }, [expenseToDelete]);

    return (
        <>
            <p>Expenses: {expenses.length}</p>
            {storageError && <p>We couldn't save your expenses. Your changes may not persist.</p>}
            <div>
                <input type="text" placeholder='Search your expenses...' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                <select name="" id="" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                    <option value={""}>All categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select name="" id="" value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value={""}>Sort by</option>
                    {sortOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            <ExpenseForm
                onAddExpense={handleAddExpense}
                expenseToEdit={expenseToEdit}
                onFinishEditing={handleFinishEditing}
                onUpdateExpense={handleUpdateExpense}
            />
            <ExpenseList
                onEditExpense={handleEditExpense}
                sortedExpenses={sortedExpenses}
                hasExpenses={expenses.length !== 0}
                onRequestDelete={handleRequestDelete}
            />
            <ExpenseSummary
                filteredExpenses={filteredExpenses}
            />
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
        </>
    )
}