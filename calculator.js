function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  if (y == 0) {
    return "No! I can't do that!"
  }
  return Math.round(x / y * 100000000000000) / 100000000000000;
}

function operate(num1, operator, num2) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
    default:
      return 'Error'
  }
}

function storeCharacter(newCharacter) {
  // Store the new character based on what it is and what is currently displayed
  if (prevent == true) {
    console.log('No new numbers after operating.');
  } else if (currentString === '0' && parseInt(newCharacter)) {
    currentString = newCharacter;
  } else if (!parseInt(newCharacter) || newCharacter == '0') {
    if (newCharacter == '0') {
      if (currentString.slice(-1) == '0' && currentString.slice(-2, -1) == ' ') {
        console.log('No extra zeros');
      } else {
      currentString = currentString + newCharacter;
      }
    } else if (newCharacter == '.') {
      currentString = currentString + newCharacter;
    } else if (currentString.slice(-1) !== ' ') {
      currentString = currentString + ' ' + newCharacter + ' ';
    }
  } else {
    if (currentString.slice(-1) == '0' && currentString.slice(-2, -1) == ' ') {
      currentString = currentString.slice(0,-1) + newCharacter;
    } else {
      currentString = currentString + newCharacter;
    }
  }
  updateDisplay(currentString);
}

function updateDisplay(text) {
  // Update display but prevent character overflow by limiting displayed size
  if (text.length >= 20) {
    display.textContent = text.slice(-20);
  } else {
    display.textContent = text;    
  }
}

// Get display element for updating, get buttons to add eventsListeners, intialize several variables for functionality
let display = document.getElementById('calc-display');
let buttons = document.querySelectorAll('button');
let currentString = '0';
let prevent = false;
let allowDec = true;

buttons.forEach(button => {
  if (button.classList[0] !== 'opers') {
    if (button.value == '.') {
      button.addEventListener('click', (e) => {
        // Only allows one decimal point per number
        if (allowDec == true) {
          allowDec = false;
          storeCharacter('.');
        }
      })
    } else if (button.value == '=') {
      button.addEventListener('click', (e) => {
        // Remove unnecessary values
        if (currentString.slice(-1) == ' ') { currentString = currentString.slice(0,-3)};
        if (currentString.slice(-1) == '.') { currentString = currentString.slice(0,-1)};
        
        let argArr = currentString.split(' ');
        
        // Perform each operation requested in order of input
        while (argArr[0] && argArr[1] && argArr[2]) {
          let newValue = operate(Number(argArr.shift()),argArr.shift(),Number(argArr.shift()));
          argArr.unshift(newValue);
        }
        
        // Convert results to sci. not. if too many digits for display
        if (argArr[0] > 9999999999999) {
        currentString = '' + argArr[0].toExponential(14);
        } else {
          currentString = '' + argArr[0];
        }
        
        // Display final answer and prevent logic that would break calculator
        updateDisplay(currentString);
        prevent = true;
      })
    } else {
      // Only numbers make it here
      button.addEventListener('click', (e) => {
        storeCharacter(e.target.value);
      })
    }
  } else {
    if (button.value == 'back') {
      // Logic for backspacing
      button.addEventListener('click', (e) => {
        if (prevent == true) {
          console.log("Can't delete results of operation.");
        } else if (currentString.slice(-1) == ' ') {
          currentString = currentString.slice(0,-2);
          updateDisplay(currentString);
        } else if (currentString.length == 1) {
          currentString = '0';
          updateDisplay(currentString);
        } else {
          if (currentString.slice(-1) == '.') { allowDec = true;}
          currentString = currentString.slice(0,-1);
          updateDisplay(currentString);
        }
      })
    } else if (button.value == 'clear') {
      // Logic for clearing
      button.addEventListener('click', (e) => {
        currentString = '0';
        prevent = false;
        allowDec = true;
        updateDisplay(currentString);
      })
    } else {
      // Logic for adding an operator
      button.addEventListener('click', (e) => {
        prevent = false;
        allowDec = true;
        storeCharacter(e.target.value);
      })
    }
  }
});
