/* global createNumberCol createNumberRow createCheckboxRow createButtonGroupRow createRow createAlert exit keyDownHandler keyUpHandler */
const defaultLowerLimit = 100;
const defaultUpperLimit = 999;
const defaultGuessLimit = 10;
const defaultPositions = true;
const defaultBiggerSmaller = true;
const defaultSumCheck = false;
let lowerLimit;
let upperLimit;
let guessLimit;
let positions;
let biggerSmaller;
let sumCheck;

let number;
let digits;
let sum;
let guesses;
let oldGuesses;

window.locked = true;

const form = document.getElementById('form');
const rowClass = 'row justify-content-center';
const colClass = 'col col-md-3 col-lg-2 mb-3';
const numberClass = 'col-3 col-md-2 col-xl-1 mb-3';
const buttonClass = 'col-9 col-md-7 col-lg-6 col-xl-5 my-auto';
const firstRow = [['Lower Limit', 'lowerLimit', '1', '99999'], ['Upper Limit', 'upperLimit', '1', '99999'], ['Guess Limit', 'guessLimit', '1', '9999']];
const secondRow = [['<u>P</u>ositions', 'positions', 'p'], ['<u>B</u>igger Smaller', 'biggerSmaller', 'b'], ['<u>S</u>um <span id="sum"></span>', 'sumCheck', 's']];
const numberRow = ['1. Guess', 'guess', '1', '99999'];
const buttonRow = [['success', 'if(!locked)window.guess()', 'g', 'search', '<u>G</u>uess'], ['primary', 'if(!locked)random()', 'r', 'random', '<u>R</u>andom'], ['danger', 'if(!locked)giveUp()', 'u', 'times', 'Give <u>U</u>p'], ['info', 'restart()', 'e', 'sync', 'R<u>e</u>start']];
form.appendChild(createNumberRow(rowClass, colClass, firstRow));
form.appendChild(createCheckboxRow(rowClass, colClass, secondRow));
form.appendChild(createRow(rowClass, [createNumberCol(numberClass, ...numberRow), createButtonGroupRow(buttonClass, 'btn-group', buttonRow)]));
const guessLabel = form.children[2].children[0].children[0];
resetInputs();
restart();
document.getElementById('sumCheck').addEventListener('change', function () {
  sumCheck = this.checked;
  updateSum();
});
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function resetInputs () {
  lowerLimit = defaultLowerLimit;
  upperLimit = defaultUpperLimit;
  guessLimit = defaultGuessLimit;
  positions = defaultPositions;
  biggerSmaller = defaultBiggerSmaller;
  sumCheck = defaultSumCheck;
  document.getElementById('lowerLimit').value = lowerLimit;
  document.getElementById('upperLimit').value = upperLimit;
  document.getElementById('guessLimit').value = guessLimit;
  document.getElementById('positions').checked = positions;
  document.getElementById('biggerSmaller').checked = biggerSmaller;
  document.getElementById('sumCheck').checked = sumCheck;
}

window.guess = function () {
  const input = document.getElementById('guess');
  const guess = parseInt(input.value);
  input.value = '';
  if (isNaN(guess)) {
    createAlert('danger', 'Not a number.');
  } else if (findDigitsCount(guess) !== digits) {
    createAlert('danger', 'Wrong number of digits.');
  } else if (checkDigits(guess)) {
    createAlert('danger', 'Digists cannot repeat.');
  } else if (oldGuesses.includes(guess)) {
    createAlert('danger', 'Already guessed before.');
  } else if (sumCheck && findDigitsSum(guess) !== sum) {
    createAlert('danger', 'Wrong sum of digits.');
  } else {
    checkNumber(guess);
  }
};

window.random = function () {
  let guess;
  do {
    guess = Math.floor(Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit);
  } while (checkDigits(guess) || oldGuesses.includes(guess) || (sumCheck && findDigitsSum(guess) !== sum)); // eslint-disable-line no-unmodified-loop-condition
  checkNumber(guess);
};

window.giveUp = function () {
  exit('danger', `Number was ${number}.`);
};

function restart () {
  lowerLimit = +document.getElementById('lowerLimit').value;
  upperLimit = +document.getElementById('upperLimit').value;
  guessLimit = +document.getElementById('guessLimit').value;
  positions = document.getElementById('positions').checked;
  biggerSmaller = document.getElementById('biggerSmaller').checked;
  if (guessLimit === 0) {
    guessLimit = Number.MAX_SAFE_INTEGER;
  }
  do {
    number = Math.floor(Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit);
  } while (checkDigits(number));
  digits = findDigitsCount(number);
  sum = findDigitsSum(number);
  updateSum();
  guesses = 1;
  oldGuesses = [];
  window.locked = false;
  guessLabel.innerHTML = guesses + '. Guess';
  document.getElementById('text').innerHTML = '';
}

function checkNumber (guess) {
  oldGuesses.push(guess);
  if (number === guess) {
    exit('success', number + ' is correct.');
  } else {
    let text = guess + ' is incorrect.';
    if (positions) {
      let corrects = 0;
      let incorrects = 0;
      const a = guess.toString();
      const b = number.toString();
      for (let i = 0; i < a.length; i++) {
        if (a.charAt(i) === b.charAt(i)) {
          corrects++;
        }
        for (let j = 0; j < b.length; j++) {
          if (i !== j && a.charAt(i) === b.charAt(j)) {
            incorrects++;
          }
        }
      }
      text += `<br>${corrects} in correct position, ${incorrects} in incorrect position, ${digits - corrects - incorrects} no match.`;
    }
    if (biggerSmaller) {
      if (guess > number) {
        text += '<br>Your guess should be smaller.';
      } else {
        text += '<br>Your guess should be larger.';
      }
    }
    if (guesses === guessLimit) {
      exit('danger', `Number was ${number}.`);
    } else {
      if (++guesses === guessLimit) {
        guessLabel.innerHTML = 'Last Guess';
      } else {
        guessLabel.innerHTML = guesses + '. Guess';
      }
      createAlert('warning', text);
    }
  }
}

function checkDigits (n) {
  return (/([0-9]).*?\1/).test(n);
}

function findDigitsCount (n) {
  return n.toString().length;
}

function findDigitsSum (n) {
  let sum = 0;
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return sum;
}

function updateSum () {
  if (sumCheck) {
    document.getElementById('sum').innerHTML = sum;
  } else {
    document.getElementById('sum').innerHTML = '';
  }
}
