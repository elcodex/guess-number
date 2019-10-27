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

let game = (from, to) => {
    let number = from + Math.floor(Math.random() * (to - from));

    let answer = userNumber => {
        const TOO_SMALL = 'too small';
        const TOO_BIG = 'too big';
        const RIGHT = 'right';
        if (userNumber < number)
            return TOO_SMALL;
        if (userNumber > number)
            return TOO_BIG;
        return RIGHT;    
    }
    let start = _ => {
        number = from + Math.floor(Math.random() * (to - from));
    }
    return {
        answer: answer,
        start: start
    }
}