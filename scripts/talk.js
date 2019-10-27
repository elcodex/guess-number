/*
commands: hello , start , end , [number]

 */
const COMMANDS = ['hello', 'start', 'end'];
const DO_NOTHING = 'do nothing';
const NUMBER = 'number';

let parseRequest = request => {
    const text = request.body.message.split(/ |\n/, 1)[0].toLowerCase();
    const n = Number(text);
    if (COMMANDS.includes(text))
        return {command: text};
    if (!isNaN(n))
        return {command: NUMBER, number: n}
    return {command: DO_NOTHING}        
}

//guess the number
let game = (from, to) => {
    let number = from; //from + Math.floor(Math.random() * (to - from));
    let triesCount = 0;
    const ANSWERS = {TOO_SMALL: 'too small', TOO_BIG: 'too big', RIGHT: 'right'};

    let answer = userNumber => {
       // console.log('number', number, userNumber);
        triesCount++;
        if (userNumber < number)
            return ANSWERS.TOO_SMALL;
        if (userNumber > number)
            return ANSWERS.TOO_BIG;
        return ANSWERS.RIGHT;    
    }
    let start = _ => {
        number = from + Math.floor(Math.random() * (to - from));
        triesCount = 0;
       // console.log('start number:', number);
    }
    let end = _ => {
        return {number, triesCount}
    }
    let allAnswers = _ => ANSWERS;
    return {
        answer: answer,
        start: start
    }
}