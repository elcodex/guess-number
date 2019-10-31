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