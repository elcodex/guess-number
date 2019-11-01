const ANSWERS = {TOO_SMALL: 'too small', TOO_BIG: 'too big', RIGHT: 'right'};

exports.start = (from, to) => {
    return from + Math.floor(Math.random() * (to - from));
}
exports.turn = (userNumber, guessNumber, tries) => {    
    let gameTurn = {answer: ANSWERS.RIGHT, tries: tries + 1}
    if (userNumber < guessNumber)
        gameTurn.answer = ANSWERS.TOO_SMALL;
    if (userNumber > guessNumber)
        gameTurn.answer = ANSWERS.TOO_BIG;
    return gameTurn;
}
exports.allAnswers = _ => ANSWERS;

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
        if (this.isPrime(d) && number % d === 0) {
            dividers.push(d);
        }
    }
    if (dividers.length > 0) {
        return dividers[Math.floor(Math.random() * dividers.length)];
    }
    return 1;
}