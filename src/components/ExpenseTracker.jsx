'use client';
import { useEffect, useRef, useState } from 'react';
import ExpenseForm from './ExpenseForm';
import { categories } from '@/data/categories';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';

const sampleExpenses = [
    {
        id: 1,
        description: 'KFC',
        amount: 7000,
        category: 'Food',
        date: '2026-09-16',
    },
    {
        id: 2,
        description: 'Car wash',
        amount: 3500,
        category: 'Other',
        date: '2026-09-19',
    }
];

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
    const filteredExpenses = expenses.filter(expense => expense.description.toLowerCase().includes(searchTerm.toLowerCase()) && (expense.category === categoryFilter || categoryFilter === ""));
    const sortedExpenses = sortExpenses(filteredExpenses);
    console.log(filteredExpenses);


    function handleAddExpense(newExpense) {
        setExpenses(prev => [
            ...prev,
            {
                ...newExpense,
                id: prev.length === 0 ? 1 : Math.max(...prev.map(e => e.id)) + 1
            }
        ])
    };

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
                console.log(array.map(item => item.date))
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
        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(savedExpenses);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded === true) {
            localStorage.setItem('expenses', JSON.stringify(expenses));
        }
    }, [expenses]);


    return (
        <>
            <p>Expenses: {expenses.length}</p>
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
                onDeleteExpense={handleDeleteExpense}
                onEditExpense={handleEditExpense}
                sortedExpenses={sortedExpenses}
                hasExpenses={expenses.length !== 0}
            />
            <ExpenseSummary
                filteredExpenses={filteredExpenses}
            />
        </>
    )
}