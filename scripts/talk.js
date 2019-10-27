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
        answer,
        start,
        end,
        allAnswers,
    }
}
let myGame = game(1, 100);

exports.serverAnswer = request => {
    let action = parseRequest(request);
    let answer = '';
    if ('command' in action) {
        if (action.command === 'hello') {  //hello
            answer = "Hello! Let's play a game. I think of the number from 1 to 100 and you try to guess it.";
            answer += "\nTo start the game type 'start'";  
        }
        else if (action.command === 'start') {
            myGame.start();
            answer = "Great! Now you type your guess and i will give you some hints";
        }
        else if (action.command === 'number') {
            const gameAnswer = myGame.answer(action.number);
            console.log(action.number, gameAnswer);
            if (gameAnswer === myGame.allAnswers().TOO_SMALL) {
                answer = 'Yours number is smaller than my number.';
            } else if (gameAnswer === myGame.allAnswers().TOO_BIG) {
                answer = 'Your guess is too big. Try another number.'
            } else if (gameAnswer === myGame.allAnswers().RIGHT) {
                const gameResults = myGame.end();
                answer = 'You got it! Congrats!';
                answer += '\nTries: ' + gameResults.triesCount + '. Number: ' + gameResults.number;
            }
        }
        else if (action.command === 'end') {
            const gameResults = myGame.end();
            answer = 'Ok. The number was ' + gameResults.number;
            answer += "\nLet's try again.";
        }
    }
    return answer; 
}


