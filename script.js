// Calculate leftover budget
function calculation() {
    const MonthIncome = parseFloat(document.getElementById('MonthIncome').value);
    const savings = parseFloat(document.getElementById('savings').value);
  
    if (isNaN(MonthIncome) || isNaN(savings) || MonthIncome < 0 || savings < 0) {
      document.getElementById('leftover').innerText = "Please enter valid numbers for income and savings.";
      return;
    }
  
    const numBills = parseInt(document.getElementById('NumBills').value, 10);
    let totalBillCost = 0;
  
    // Sum up all bill costs
    for (let i = 1; i <= numBills; i++) {
      const billCost = parseFloat(document.getElementById(`${i}BillCost`).value);
      if (!isNaN(billCost) && billCost >= 0) {
        totalBillCost += billCost;
      } else {
        document.getElementById('leftover').innerText = `Invalid input for Bill ${i} Cost.`;
        return;
      }
    }
  
    // Calculate leftover money
    const leftover = MonthIncome - totalBillCost - savings;
  
    if (leftover < 0) {
      document.getElementById('leftover').innerText = `You are over budget by $${Math.abs(leftover).toFixed(2)}.`;
    } else {
      document.getElementById('leftover').innerText = `You have $${leftover.toFixed(2)} left to budget.`;
    }
  }

//does the numBills field and displays certain amount of bills based on what the user inputs
const numBillsField = document.getElementById('NumBills');
const numContain = document.querySelector('.numContain');

// Event listener for user input
numBillsField.addEventListener('input', () => {
const count = parseInt(numBillsField.value, 10);

// Validate the input
if (isNaN(count) || count < 1) {
    numContain.innerHTML = '<p>Please enter a valid number of bills.</p>';
    return;
}
  
    // Clear previous fields
    numContain.innerHTML = '';
  
    // Generate inputs for each bill
    for (let i = 1; i <= count; i++) {
      const billDiv = document.createElement('div');
      billDiv.innerHTML = `
        <label for="${i}BillName">What bill do you have to pay?</label>
        <input type="text" id="${i}BillName" name="${i}BillName" placeholder="Bill ${i} Name">
        <label for="${i}BillCost">How much?</label>
        <input type="text" id="${i}BillCost" name="${i}BillCost" placeholder="Bill ${i} Cost"><br>
      `;
      numContain.appendChild(billDiv);
    }
    });

    

