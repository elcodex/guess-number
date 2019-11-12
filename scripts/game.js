const ANSWERS = {TOO_SMALL: 'too small', TOO_BIG: 'too big', RIGHT: 'right', INVALID: 'invalid'};
const FROM = 1;
const TO = 100;

exports.start = () => {
    return FROM + Math.floor(Math.random() * (TO - FROM));
}

exports.turn = (userNumber, guessNumber, tries) => {
    let gameTurn = {answer: ANSWERS.RIGHT, tries: tries + 1}
    if (userNumber < FROM || userNumber >= TO)
        gameTurn.answer = ANSWERS.INVALID;
    else {
        if (userNumber < guessNumber)
            gameTurn.answer = ANSWERS.TOO_SMALL;
        if (userNumber > guessNumber)
            gameTurn.answer = ANSWERS.TOO_BIG;
    }
    return gameTurn;
}

exports.allAnswers = () => ANSWERS;

exports.isPrime = (number) => {
    for (let d = 2; d <= Math.floor(Math.sqrt(number)); d++) {
        if (number % d === 0) {
            return false;
        }
    }
    return true;
}
exports.isEven = number => number % 2 === 0;

exports.dividedBy = number => {
    let dividers = [];
    for (let d = 2; d < number; d++) {
        if (number % d === 0) {
            dividers.push(d);
        }
    }
    if (dividers.length > 0) {
        return dividers[Math.floor(Math.random() * dividers.length)];
    }
    return 1;
}