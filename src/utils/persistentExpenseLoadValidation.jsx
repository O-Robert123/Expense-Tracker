const expectedTypes = {
    id: 'number',
    description: 'string',
    amount: 'number',
    category: 'string',
    date: 'string'
}

export default function isValidExpense(expense) {
    if (typeof expense !== 'object' || expense === null || Array.isArray(expense)) {
        return false;
    }
    if (Object.keys(expectedTypes).every(key => key in expense)) {
        const expenseKeys = Object.keys(expense);
        return expenseKeys.every(key => typeof expense[key] === expectedTypes[key])
    }
    else{
        return false
    }
};