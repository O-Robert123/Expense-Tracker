'use client';
import { useEffect, useState } from 'react';
import { categories } from '@/data/categories';


export default function ExpenseForm({ onAddExpense, expenseToEdit, onFinishEditing, onUpdateExpense }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [errors, setErrors] = useState({});
    const expectedTypes = {
        id: 'number',
        description: 'string',
        amount: 'number',
        category: 'string',
        date: 'string'
    }

    function handleSubmit(event) {
        event.preventDefault();

        const tempErrors = {};

        if (description.trim() === "") {
            tempErrors.description = "Description is required.";
        };

        if (amount === "") {
            tempErrors.amount = "Amount is required";
        }
        else if (Number(amount) <= 0) {
            tempErrors.amount = "Amount must be greater than zero";
        };

        if (category === "") {
            tempErrors.category = "Category is required."
        };

        if (date === "") {
            tempErrors.date = "Date is required."
        };

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        };

        if (!expenseToEdit) {
            const newExpense = {
                description: description,
                amount: Number(amount),
                category: category,
                date: date
            }
            onAddExpense(newExpense);
        }
        else {
            const UpdatedExpense = {
                description: description,
                amount: Number(amount),
                category: category,
                date: date
            }
            onUpdateExpense(UpdatedExpense);
            onFinishEditing();
        }

        setDescription("");
        setAmount("");
        setCategory("");
        setDate("");
    };

    useEffect(() => {
        if (expenseToEdit) {
            setDescription(expenseToEdit.description);
            setAmount(String(expenseToEdit.amount));
            setCategory(expenseToEdit.category);
            setDate(expenseToEdit.date);
        }
    }, [expenseToEdit]);

    return (
        <>
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="description">Description</label>
                    <input type="text" id='description' aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} value={description} onChange={(event) => {
                        const value = event.target.value;
                        setDescription(value);
                        if (value.trim() !== "") {
                            setErrors(prev => {
                                const { description, ...remainingErrors } = prev;
                                return remainingErrors;
                            })
                        };
                    }} />
                    {errors.description && <p id='description-error'>{errors.description}</p>}
                </div>
                <div>
                    <label htmlFor="amount">Amount</label>
                    <input type="number" id='amount' aria-invalid={Boolean(errors.amount)} aria-describedby={errors.amount ? "amount-error" : undefined} value={amount} onChange={(event) => {
                        const value = event.target.value;
                        setAmount(value);
                        if (Number(value) > 0 && value.trim() !== "") {
                            setErrors(prev => {
                                const { amount, ...remainingErrors } = prev;
                                return remainingErrors;
                            });
                        };
                    }} />
                    {errors.amount && <p id='amount-error'>{errors.amount}</p>}
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <select id='category' aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'category-error' : undefined} value={category} onChange={(event) => {
                        const value = event.target.value;
                        setCategory(value);
                        if (value !== "") {
                            setErrors(prev => {
                                const { category, ...remainingErrors } = prev;
                                return remainingErrors;
                            });
                        };
                    }}>
                        <option value={""} disabled>Select a category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {errors.category && <p id='category-error'>{errors.category}</p>}
                </div>
                <div>
                    <label htmlFor="date">Date</label>
                    <input type="date" id='date' aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} value={date} onChange={(event) => {
                        const value = event.target.value;
                        setDate(value)
                        if (value !== "") {
                            setErrors(prev => {
                                const { date, ...remainingErrors } = prev;
                                return remainingErrors;
                            })
                        }
                        
                    }} />
                    {errors.date && <p id='date-error'>{errors.date}</p>}
                </div>
                <button type='submit'>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</button>
            </form>
        </>
    )
}