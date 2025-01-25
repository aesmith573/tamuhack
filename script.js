function calculation() {
    const MonthIncome = parseFloat(document.getElementById('MonthIncome').value);
    const savings = parseFloat(document.getElementsById('savings').value);
    // const expenses = parseFloat(document.getElementsById('expenses').value);
    
    const leftover = MonthIncome - savings - expenses;
    document.getElementById('leftover').innerText = 'Leftover to budget: ${leftover}'; 
}
