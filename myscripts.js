// --- Core Logic --- //

let awaitingNewCalculation = false;

const add = function(a, b, ...additionalNumbers) {
    let total = a + b;
  for (let num of additionalNumbers) {
    total += num;
  }
  return total;
};

const subtract = function(a, b, ...additionalNumbers) {
    let total = a - b;
  for (let num of additionalNumbers) {
    total -= num;
  }
  return total;
};

const multiply = function(a, b, ...additionalNumbers) {
  let total = a * b;
  for (let num of additionalNumbers) {
    total *= num;
  }
  return total;
};

const divide = function(a, b) {
    if (b === 0) {
        return "Can't divide by 0!";
    }
    return a / b;
}

function operate(operator, num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);

    let result;
    if (operator === "+") {
        result = add(num1, num2);
    }
    if (operator === "-") {
        result = subtract(num1, num2);
    }
    if (operator === "x" || operator === "*") {
        result = multiply(num1, num2);
    }
    if (operator === "÷" || operator === "/") {
        result = divide(num1, num2);
    }
    // Check if the result is a number and has a decimal
    if (typeof result === 'number' && !Number.isInteger(result)) {
        // Round to 4 decimal places
        return parseFloat(result.toFixed(4));
    }
    return result;
}

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let firstNumber = '';
let operator = '';
let secondNumber = '';
let result = null;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.value;
        const isOperator = ['+', '-', '*', '/', '='].includes(value);

        if (value === 'clear') {
            firstNumber = '';
            operator = '';
            secondNumber = '';
            result = null;
            display.textContent = '0';
        } else if (value === '=') {
            if (firstNumber !== '' && operator !== '' && secondNumber !== '') {
                result = operate(operator, firstNumber, secondNumber);
                display.textContent = result;
                firstNumber = result;
                operator = '';
                secondNumber = '';
                // Set the flag to true after a calculation is complete
                awaitingNewCalculation = true;
            }
        } else if (isOperator) {
            // Check if a calculation has just been completed
            if (awaitingNewCalculation) {
                // If so, the firstNumber is already the result of the last calculation.
                // We just need to set the new operator.
                operator = value;
                // Reset the flag for the next operation
                awaitingNewCalculation = false;
                // Update the display to show the result and the new operator
                display.textContent = `${firstNumber} ${operator}`;
            } else if (firstNumber !== '' && operator !== '' && secondNumber !== '') {
                // This block handles intermediate calculations (e.g., 5 + 6 + 7)
                result = operate(operator, firstNumber, secondNumber);
                if (result === "Can't divide by 0!") {
                    display.textContent = result;
                    firstNumber = '';
                    operator = '';
                    secondNumber = '';
                    return;
                }
                firstNumber = result;
                secondNumber = '';
                operator = value; // Set the new operator
                display.textContent = `${firstNumber} ${operator}`;
            } else {
                // This is the first operator after the first number is entered
                operator = value;
                display.textContent = `${firstNumber} ${operator}`;
            }

        } else { // It's a number or a decimal point
            if (awaitingNewCalculation) {
                firstNumber = '';
                awaitingNewCalculation = false; // Reset the flag
                display.textContent = '0'; // Clear the display
            }
            if (value === '.') {
                if (operator === '') {
                    // Check if firstNumber already has a decimal point
                    if (!firstNumber.includes('.')) {
                        firstNumber += value;
                        display.textContent = firstNumber;
                    }
                } else {
                    // Check if secondNumber already has a decimal point
                    if (!secondNumber.includes('.')) {
                        secondNumber += value;
                        display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
                    }
                }
            } else { // It's a number (0-9)
                if (operator === '') {
                    if (display.textContent === '0') {
                        display.textContent = '';
                    }
                    firstNumber += value;
                    display.textContent = firstNumber;
                } else {
                    secondNumber += value;
                    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
                }
            }
        }
    });
});



// Extra: Dark Mode

const modeToggle = document.getElementById('mode-toggle');
const modeIcon = modeToggle.querySelector('i');

// Check for existing mode in localStorage or default to day mode
const currentMode = localStorage.getItem('mode');
if (currentMode === 'dark') {
    document.body.classList.add('dark-mode');
    modeIcon.classList.remove('fa-sun');
    modeIcon.classList.add('fa-cloud-moon');
} else {
    modeIcon.classList.add('fa-sun');
}


modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Toggle the icon based on the current mode
    if (document.body.classList.contains('dark-mode')) {
        modeIcon.classList.remove('fa-sun');
        modeIcon.classList.add('fa-cloud-moon'); 
        localStorage.setItem('mode', 'dark'); 
    } else {
        modeIcon.classList.remove('fa-cloud-moon');
        modeIcon.classList.add('fa-sun'); 
        localStorage.setItem('mode', 'light'); 
    }
});