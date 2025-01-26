// Calculate leftover budget
let chart;

function calculation() {
    const MonthIncome = parseFloat(document.getElementById('MonthIncome').value);
    const totalSavings = parseFloat(document.getElementById('savings').value); // Total savings input
  
    if (isNaN(MonthIncome) || isNaN(totalSavings) || MonthIncome < 0 || totalSavings < 0) {
        document.getElementById('leftover').innerText = "Please enter valid numbers for income and savings.";
        return;
    }
  
    const numBills = parseInt(document.getElementById('NumBills').value, 10);
    let totalBillCost = 0;
    let billCategories = [];
    let billAmounts = [];
  
    // Calculate total bill cost
    for (let i = 1; i <= numBills; i++) {
        const billCost = parseFloat(document.getElementById(`${i}BillCost`).value);
        const billName = document.getElementById(`${i}BillName`).value;
        
        if (!isNaN(billCost) && billCost >= 0 && billName) {
            totalBillCost += billCost;
            billCategories.push(billName);
            billAmounts.push(billCost);
        } else {
            document.getElementById('leftover').innerText = `Invalid input for Bill ${i} Cost.`;
            return;
        }
    }
  
    // Calculate savings sub-goals
    const numGoals = parseInt(document.getElementById('numSavings').value, 10);
    let savingsCategories = [];
    let savingsAmounts = [];
    let savingsGoalsTotal = 0;

    for (let i = 1; i <= numGoals; i++) {
        const goalName = document.getElementById(`${i}saveName`).value;
        const goalAmount = parseFloat(document.getElementById(`${i}saveCost`).value);
        
        if (goalName && !isNaN(goalAmount) && goalAmount >= 0) {
            savingsCategories.push(goalName);
            savingsAmounts.push(goalAmount);
            savingsGoalsTotal += goalAmount; // Accumulate the total of sub-goals
        } else {
            document.getElementById('leftover').innerText = `Invalid input for Goal ${i} Amount.`;
            return;
        }
    }
  
    // Check if sub-goals exceed total savings
    if (savingsGoalsTotal > totalSavings) {
        document.getElementById('leftover').innerText = `The total of your savings goals exceeds your total savings limit of $${totalSavings.toFixed(2)}. Please adjust your goals.`;
        return;
    }
  
    // Calculate leftover money
    const leftover = MonthIncome - totalBillCost - totalSavings;

    if (leftover < 0) {
        document.getElementById('leftover').innerText = `You are over budget by $${Math.abs(leftover).toFixed(2)}.`;
    } else {
        document.getElementById('leftover').innerText = `You have $${leftover.toFixed(2)} left to budget.`;
    }

    // Generate chart
    generateChart(billCategories, billAmounts, totalSavings, savingsCategories, savingsAmounts);
    generateSavingsChart(savingsCategories, savingsAmounts);
}


  // Function to create or update the chart
  function generateChart(labels, data, savings) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
  
    if (chart) {
      chart.destroy();
    }
  
    // Insert the savings value as a separate entry in the data array
    const updatedData = [...data];  // Add savings at the end of the data array
  
    // Ensure the labels include "Savings" at the end
    const updatedLabels = [...labels, 'Savings'];  // Add 'Savings' as a new category
  
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: updatedLabels,  // Labels including "Savings"
        datasets: [
          {
            label: 'Bill Costs',
            data: updatedData,  // Updated data including savings
            backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Light green for bills
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Savings',
            data: new Array(labels.length).fill(0).concat(savings),  // Fill with 0 for bills and add savings at the end
            backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Pink for savings
            borderColor: 'rgba(255, 99, 132, 1)',  // Pink for savings
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          x: {
            stacked: false  // Bars will be displayed side by side
          },
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }
    

  let savingsChart;

  function generateSavingsChart(categories, amounts) {
      const ctx = document.getElementById('savingsChart').getContext('2d');
    
      if (savingsChart) {
          savingsChart.destroy();
      }
    
      savingsChart = new Chart(ctx, {
          type: 'pie', // You can also use 'bar' if you prefer
          data: {
              labels: categories,
              datasets: [{
                  label: 'Savings Breakdown',
                  data: amounts,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)', // Colors for each category
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: { position: 'top' },
                  tooltip: { enabled: true }
              }
          }
      });
  }



//does the numBills field and displays certain amount of bills based on what the user inputs
const numBillsField = document.getElementById('NumBills');
const numContain = document.querySelector('.numContain');

const numSaveField = document.getElementById('numSavings');
const saveContain = document.querySelector('.saveContain')

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

    numSaveField.addEventListener('input', () => {
        const count1 = parseInt(numSaveField.value, 10);
        // Validate the input
    if (isNaN(count1) || count1 < 1) {
        saveContain.innerHTML = '<p>Please enter a valid number of goals.</p>';
        return;
    }
  
    // Clear previous fields
    saveContain.innerHTML = '';
  
   
    // Generate inputs for each bill
    for (let i = 1; i <= count1; i++) {
      const saveDiv = document.createElement('div');
      saveDiv.innerHTML = `
        <label for="${i}saveName">What category are you planning on saving in?</label>
        <input type="text" id="${i}saveName" name="${i}saveName" placeholder="Goal ${i} Name">
        <label for="${i}saveCost">How much?</label>
        <input type="text" id="${i}saveCost" name="${i}saveCost" placeholder="Goal ${i} Cost"><br>
      `;
      saveContain.appendChild(saveDiv);
    }
    })
   

