'use strict';
// DIFFERENT DATA! Contains movement dates, currency and locale
const account1 = {
  owner: 'A A',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-08-18T17:01:17.194Z',
    '2022-08-19T23:36:17.929Z',
    '2022-08-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const account2 = {
  owner: 'B B',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalClose = document.querySelector('.modalClose');

/////////////////////////////////////////////////
//event handler
let currAcc;
let currentDate;
let timer;
//modal window
function toggleModal() {
  modal.classList.toggle(`hidden`);
  overlay.classList.toggle(`hidden`);
}

function initialize() {
  toggleModal();
  modalClose.addEventListener(`click`, toggleModal.bind(this));
}
initialize();

//start Timer
function startTimer() {
  let time = 120;
  let minutes = String(Math.trunc(time / 60)).padStart(2, 0);
  let seconds = String(time % 60).padStart(2, 0);
  labelTimer.textContent = `${minutes}:${seconds}`;

  const timer = setInterval(function () {
    --time;
    minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      logout();
    }
  }, 1000);
  return timer;
}
//logout
function logout() {
  alert(`account closed`);
  labelWelcome.textContent = `Log in to get started`;
  inputCloseUsername.value = inputClosePin.value = ``;
  containerApp.style.opacity = 0;
}

//login
btnLogin.addEventListener(`click`, function (e) {
  e.preventDefault();
  currAcc = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currAcc?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = ``;
    actualize(currAcc);
    if (timer) clearInterval(timer);
    timer = startTimer();
  } else {
    0;
    alert(`wrong credentials`);
  }
});

function actualize(currAcc) {
  showDisplay(currAcc);
  summary(currAcc);
  balance(currAcc);
}

function usernameCreation(accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .split(` `)
      .map(elem => elem[0])
      .join(``)
      .toLowerCase();
  });
}
usernameCreation(accounts);

function toNumberFormat(mov, currAcc) {
  return new Intl.NumberFormat(currAcc.locale, {
    style: `currency`,
    currency: currAcc.currency,
  }).format(mov);
}

function toDateFormat(currAcc, date) {
  currentDate = new Date();
  const millisecondsAgo = currentDate.getTime() - date.getTime();
  const daysAgo = Math.trunc(millisecondsAgo / (24 * 60 * 60 * 1000));

  if (daysAgo === 0) return ` today`;
  else if (daysAgo === 1) return ` yesterday`;
  return new Intl.DateTimeFormat(currAcc.locale, {
    day: `2-digit`,
    month: `2-digit`,
    year: `2-digit`,
  }).format(date);
}

function showDisplay(currAcc, sort = false) {
  //sorting
  const moves = sort
    ? currAcc.movements.slice().sort((a, b) => a - b)
    : currAcc.movements;

  //display
  containerApp.style.opacity = 1;
  containerMovements.innerHTML = ``;
  labelWelcome.textContent = `Welcome ${currAcc.owner.split(` `).slice(0, 1)}`;
  moves.forEach(function (mov, i) {
    const eachDate = new Date(currAcc.movementsDates[i]);

    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type} ">${
      i + 1
    } ${type} </div>    
    As of <span class="date">${toDateFormat(currAcc, eachDate)}</span>
    <div class="movements__value">${toNumberFormat(mov, currAcc)}</div>
    </div>`;
    document.querySelector(`.movements`).insertAdjacentHTML(`afterbegin`, html);
  });
  currentDate = new Date();
  labelDate.textContent = new Intl.DateTimeFormat(currAcc.locale, {
    day: `2-digit`,
    month: `2-digit`,
    year: `2-digit`,
  }).format(currentDate);
}

function balance(currAcc) {
  currAcc.balance = currAcc.movements.reduce(
    (counter, mov) => counter + mov,
    0
  );
  labelBalance.textContent = toNumberFormat(currAcc.balance, currAcc);
}

function summary(currAcc) {
  accounts.forEach(function (acc) {
    currAcc.incomes = currAcc.movements
      .filter(mov => mov > 0)
      .reduce((counter, mov) => counter + mov, 0);
    labelSumIn.textContent = toNumberFormat(currAcc.incomes, currAcc);

    currAcc.expenses = currAcc.movements
      .filter(mov => mov < 0)
      .reduce((counter, mov) => counter + mov, 0);
    labelSumOut.textContent = toNumberFormat(
      Math.abs(currAcc.expenses),
      currAcc
    );

    //interests 0.1 of deposits greater than 100
    currAcc.interests = currAcc.movements
      .filter(mov => mov >= 100)
      .map(mov => mov * 0.1)
      .reduce((counter, mov) => counter + mov, 0);
    labelSumInterest.textContent = toNumberFormat(currAcc.interests, currAcc);
  });
}

btnTransfer.addEventListener(`click`, function (e) {
  clearInterval(timer);
  timer = startTimer();
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recipient = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    recipient &&
    recipient?.username !== currAcc.username &&
    amount >= 10 &&
    amount <= currAcc.balance
  ) {
    recipient.movements.push(amount);
    currAcc.movements.push(-amount);
    recipient.movementsDates.push(new Date());
    currAcc.movementsDates.push(new Date());
    alert(`transfer completed`);
  } else {
    alert(`invalid request`);
  }

  inputTransferAmount.value = inputTransferTo.value = ``;
  actualize(currAcc);
});

//request loan: only if you have at least one movement greater than 10% of the loan
btnLoan.addEventListener(`click`, function (e) {
  clearInterval(timer);
  timer = startTimer();
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currAcc.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    currAcc.movements.push(loanAmount);
    currAcc.movementsDates.push(new Date());
    alert(`loan granted`);
  } else {
    alert(`loan cannot be granted`);
  }
  inputLoanAmount.value = ``;

  setTimeout(function () {
    actualize(currAcc);
  }, 3000);
});

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currAcc.username &&
    Number(inputClosePin.value) === currAcc.pin
  ) {
    const index = accounts.findIndex(acc => acc.username === currAcc.username);
    accounts.splice(index, 1);
    logout();
  } else {
    alert(`invalid request`);
  }
  logout();
});

let sorting = false;
btnSort.addEventListener(`click`, function () {
  showDisplay(currAcc, !sorting);
  sorting = !sorting;
});
