'use client';

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
        <div>
            <div>
                {Object.keys(categoryTotals).map(category => (
                    <p key={category}>{category}: {categoryTotals[category]}</p>
                ))}
            </div>
            <div>
                <p>Total : {totalExpenses}</p>
            </div>
        </div>
    )
}