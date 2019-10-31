const game = require('./game.js');
const appStore = require('./store.js');

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

exports.serverAnswer = request => {
    let action = parseRequest(request);
    let answer = '';
    const sessionId = request.session.userId;
    if ('command' in action) {
        if (action.command === 'hello') {  //hello
            answer = "Hello! Let's play a game. I think of the number from 1 to 100 and you try to guess it.";
            answer += "\nTo start the game type 'start'";
            appStore.addKey(sessionId);
        }
        else if (action.command === 'start') {
            const number = game.start(1, 100);
            appStore.addParam(sessionId, {key: 'number', value: number});
            appStore.addParam(sessionId, {key: 'tries', value: 0});
            answer = "Great! Now you type your guess and i will give you some hints";
        }
        else if (action.command === 'number') {
            const tries = appStore.getParam(sessionId, 'tries');
            const guessNumber = appStore.getParam(sessionId, 'number');
            const gameAnswer = game.turn(action.number, guessNumber, tries);
            appStore.addParam(sessionId, {key: 'tries', value: gameAnswer.tries});
            console.log(action.number, guessNumber, tries, gameAnswer);
            if (gameAnswer.answer === game.allAnswers().TOO_SMALL) {
                answer = 'Yours number is smaller than my number.';
            } else if (gameAnswer.answer === game.allAnswers().TOO_BIG) {
                answer = 'Your guess is too big. Try another number.'
            } else if (gameAnswer.answer === game.allAnswers().RIGHT) {
                const gameResults = {
                    number: appStore.getParam(sessionId, 'number'),
                    tries: appStore.getParam(sessionId, 'tries'),
                }
                appStore.clearKey(sessionId);
                answer = 'You got it! Congrats!';
                answer += '\nTries: ' + gameResults.tries + '. Number: ' + gameResults.number;
            }
        }
        else if (action.command === 'end') {
            const gameResults = {
                number: appStore.getParam(sessionId, 'number'),
                tries: appStore.getParam(sessionId, 'tries'),
            }
            appStore.clearKey(sessionId);
            answer = 'Ok. The number was ' + gameResults.number;
            answer += "\nLet's try again.";
        }
    }
    console.log(appStore.getInfo(sessionId));
    return answer; 
}


