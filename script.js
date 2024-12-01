// Elements
const balanceAmount = document.getElementById('balance-amount');
const expensesAmount = document.getElementById('expensesAmount');
const incomeAmount = document.getElementById('incomeAmount');
const totalSavingsAmount = document.getElementById('totalSavingsAmount');
const transactionList = document.getElementById('transactionList');
const goalsContainer = document.getElementById('goalsContainer');
const dateDisplay = document.querySelector('.date');

// Initial state
let balance = 0;
let expenses = 0;
let income = 0;
let totalSavings = 0;
let transactions = [];
let goals = [];

// Update Date
const updateDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.innerText = new Date().toLocaleDateString(undefined, options);
};

// Add Event Listeners for Overlays
const addOverlayListeners = () => {
    document.getElementById('addExpenseButton').onclick = () => toggleOverlay('expense-overlay');
    document.getElementById('addIncomeButton').onclick = () => toggleOverlay('income-overlay');
    document.getElementById('addSavingsButton').onclick = () => toggleOverlay('savings-overlay');
    document.getElementById('addGoalButton').onclick = () => toggleOverlay('goal-overlay');

    document.getElementById('closeExpenseOverlay').onclick = () => toggleOverlay('expense-overlay');
    document.getElementById('closeIncomeOverlay').onclick = () => toggleOverlay('income-overlay');
    document.getElementById('closeSavingsOverlay').onclick = () => toggleOverlay('savings-overlay');
    document.getElementById('closeGoalOverlay').onclick = () => toggleOverlay('goal-overlay');
};

// Toggle Overlay
function toggleOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

// Form Submissions
const addFormListeners = () => {
    document.getElementById('expense-form').onsubmit = (e) => handleFormSubmission(e, 'Expense');
    document.getElementById('income-form').onsubmit = (e) => handleFormSubmission(e, 'Income');
    document.getElementById('savings-form').onsubmit = (e) => handleSavingsSubmission(e);
    document.getElementById('goal-form').onsubmit = (e) => handleGoalSubmission(e);
};

const handleFormSubmission = (e, type) => {
    e.preventDefault();
    const name = type === 'Expense' ? e.target.expenseName.value : e.target.incomeName.value;
    const amountValue = type === 'Expense' ? e.target.expenseAmount.value : e.target.incomeAmount.value;
    const amount = parseFloat(amountValue);
    const date = type === 'Expense' ? e.target.expenseDate.value : e.target.incomeDate.value;
    const category = type === 'Expense' ? e.target.expenseCategory.value : null;

    if (isNaN(amount) || amount <= 0) {
        alert(`Please enter a valid ${type.toLowerCase()} amount.`);
        return;
    }

    console.log(`Submitting ${type.toLowerCase()}:`, { name, amount, date, category });
    addTransaction(type, name, amount, date, category);
    toggleOverlay(type === 'Expense' ? 'expense-overlay' : 'income-overlay');
    e.target.reset();
};

const handleSavingsSubmission = (e) => {
    e.preventDefault();
    const savingsAmount = parseFloat(e.target.savingsAmount.value);
    const savingsDate = e.target.savingsDate.value;

    if (isNaN(savingsAmount) || savingsAmount <= 0) {
        alert("Please enter a valid savings amount.");
        return;
    }

    totalSavings += savingsAmount;
    totalSavingsAmount.innerText = `Kshs ${totalSavings.toFixed(2)}`;
    console.log("Submitting savings:", { savingsAmount, savingsDate });

    addTransaction('Savings', 'Savings Contribution', savingsAmount, savingsDate);
    toggleOverlay('savings-overlay');
    e.target.reset();
};

const handleGoalSubmission = (e) => {
    e.preventDefault();
    const goalName = e.target.goalName.value;
    const goalTarget = parseFloat(e.target.goalTarget.value);
    const goalDate = e.target.goalDate.value;

    if (isNaN(goalTarget) || goalTarget <= 0) {
        alert("Please enter a valid goal target.");
        return;
    }

    goals.push({ name: goalName, target: goalTarget, date: goalDate });
    console.log("Submitting goal:", { goalName, goalTarget, goalDate });
    renderGoals();
    saveData();
    toggleOverlay('goal-overlay');
    e.target.reset();
};

// Update Balance
function updateBalance(amount) {
    balance += amount;
    balanceAmount.innerText = `Kshs ${balance.toFixed(2)}`;
    console.log(`Updated balance: ${balance}`);
}

// Add Transaction
function addTransaction(type, name, amount, date, category = null) {
    transactions.push({ type, name, amount, date, category });

    if (type === 'Expense') {
        expenses += amount;
        expensesAmount.innerText = `Kshs ${expenses.toFixed(2)}`;
        updateBalance(-amount);
    } else if (type === 'Income') {
        income += amount;
        incomeAmount.innerText = `Kshs ${income.toFixed(2)}`;
        updateBalance(amount);
    }

    updateTransactionList();
    saveData();
}

// Update Transaction List
function updateTransactionList() {
    transactionList.innerHTML = transactions.map(transaction => `
        <li class="transaction-item">
            <span class="transaction-date">${transaction.date}</span>
            <span class="transaction-type">${transaction.type}</span>
            <span class="transaction-name">${transaction.name}</span>
            <span class="transaction-amount">Kshs ${transaction.amount.toFixed(2)}</span>
            ${transaction.category ? `<span class="transaction-category">(Category: ${transaction.category})</span>` : ''}
        </li>
    `).join('');
}

// Render Goals
function renderGoals() {
    goalsContainer.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <h4 class="goal-name">${goal.name}</h4>
            <p class="goal-target">Target: Kshs ${goal.target.toFixed(2)} by ${goal.date}</p>
        </div>
    `).join('');
}

// Save and Load Data
function saveData() {
    const data = { balance, expenses, income, totalSavings, transactions, goals };
    localStorage.setItem('financeData', JSON.stringify(data));
}

function loadData() {
    const storedData = localStorage.getItem('financeData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        balance = parsedData.balance || 0;
        expenses = parsedData.expenses || 0;
        income = parsedData.income || 0;
        totalSavings = parsedData.totalSavings || 0;
        transactions = parsedData.transactions || [];
        goals = parsedData.goals || [];

        updateUI();
    }
}

// Update UI
function updateUI() {
    balanceAmount.innerText = `Kshs ${balance.toFixed(2)}`;
    expensesAmount.innerText = `Kshs ${expenses.toFixed(2)}`;
    incomeAmount.innerText = `Kshs ${income.toFixed(2)}`;
    totalSavingsAmount.innerText = `Kshs ${totalSavings.toFixed(2)}`;
    updateTransactionList();
    renderGoals();
}

// Initialize
window.onload = () => {
    updateDate();
    loadData();
    addOverlayListeners();
    addFormListeners();
};
