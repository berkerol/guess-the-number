let lowerLimit = 100;
let upperLimit = 999;
let guessLimit = 10;
let positions = true;
let biggerSmaller = true;
let sumCheck = false;

let number;
let digits;
let sum;
let guesses;
let oldGuesses;
let locked;

document.addEventListener('keydown', keyDownHandler);
document.getElementById('lowerLimit').value = lowerLimit;
document.getElementById('upperLimit').value = upperLimit;
document.getElementById('guessLimit').value = guessLimit;
document.getElementById('positions').checked = positions;
document.getElementById('biggerSmaller').checked = biggerSmaller;
document.getElementById('sumCheck').checked = sumCheck;
document.getElementById('positions').addEventListener('change', function () {
  positions = this.checked;
});
document.getElementById('biggerSmaller').addEventListener('change', function () {
  biggerSmaller = this.checked;
});
document.getElementById('sumCheck').addEventListener('change', function () {
  sumCheck = this.checked;
  updateSum();
});
restart();

function guess () {
  const input = document.getElementById('guess');
  const guess = parseInt(input.value);
  input.value = '';
  if (isNaN(guess)) {
    write('alert alert-danger', 'Not a number.');
  } else if (findDigitsCount(guess) !== digits) {
    write('alert alert-danger', 'Wrong number of digits.');
  } else if (checkDigits(guess)) {
    write('alert alert-danger', 'Digists cannot repeat.');
  } else if (oldGuesses.includes(guess)) {
    write('alert alert-danger', 'Already guessed before.');
  } else if (sumCheck && findDigitsSum(guess) !== sum) {
    write('alert alert-danger', 'Wrong sum of digits.');
  } else {
    checkNumber(guess);
  }
}

function random () {
  let guess;
  do {
    guess = Math.floor(Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit);
  } while (checkDigits(guess) || oldGuesses.includes(guess) || (sumCheck && findDigitsSum(guess) !== sum));
  checkNumber(guess);
}

function giveUp () {
  exit('alert alert-danger', `Number was ${number}.`);
}

function restart () {
  lowerLimit = +document.getElementById('lowerLimit').value;
  upperLimit = +document.getElementById('upperLimit').value;
  guessLimit = +document.getElementById('guessLimit').value;
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
  locked = false;
  document.getElementById('guessLabel').innerHTML = guesses + '. Guess';
  document.getElementById('text').innerHTML = '';
}

function checkNumber (guess) {
  oldGuesses.push(guess);
  if (number === guess) {
    exit('alert alert-success', number + ' is correct.');
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
      exit('alert alert-danger', `Number was ${number}.`);
    } else {
      if (++guesses === guessLimit) {
        document.getElementById('guessLabel').innerHTML = 'Last Guess';
      } else {
        document.getElementById('guessLabel').innerHTML = guesses + '. Guess';
      }
      write('alert alert-warning', text);
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

function exit (className, text) {
  write(className, text);
  locked = true;
  write('alert alert-info', 'Restart the game!');
}

function write (className, text) {
  const child = document.createElement('div');
  child.className = className + ' alert-dismissible';
  child.innerHTML = '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>' + text;
  const parent = document.getElementById('text');
  parent.insertBefore(child, parent.firstChild);
}

function keyDownHandler (e) {
  if (e.keyCode === 13 && !locked) {
    e.preventDefault();
    guess();
  }
}
