const game = require('./game.js');
const gameStore = require('./store.js');

const fs = require('fs');
const serverAnswersData = fs.readFileSync('data/answers.json', 'utf-8');
const serverAnswers = JSON.parse(serverAnswersData);

const USER_COMMANDS = {HELLO: 'hello', START: 'start', END: 'end'};
const COMMAND_DEFAULT = 'do nothing';
const COMMAND_NUMBER = 'number';

let extractCommandFromRequest = request => {
    const command = request.body.message.split(/ |\n|\r|\r\n/, 1)[0].toLowerCase();

    if (Object.values(USER_COMMANDS).includes(command))
        return {command};

    const number = Number(command);
    if (!isNaN(number))
        return {command: COMMAND_NUMBER, number};

    return {command: COMMAND_DEFAULT};
}
let executeCommand = (sessionId, commandNumber = 0) => {
    let executeCommandHello = _ => {
        gameStore.addKey(sessionId);
        return serverAnswers.hello;
    }
    let executeCommandStart = _ => {
        const number = game.start();
        gameStore.addParam(sessionId, {key: 'number', value: number});
        gameStore.addParam(sessionId, {key: 'tries', value: 0});
        return serverAnswers.start;
    }
    let executeCommandEnd = _ => {
        let answer = serverAnswers['not start yet'];
        if (gameStore.getParam(sessionId, 'number')) {
            const gameResults = {
                number: gameStore.getParam(sessionId, 'number'),
                tries: gameStore.getParam(sessionId, 'tries'),
            }
            gameStore.clearKey(sessionId);
            answer = serverAnswers.end[0] + gameResults.number;
            answer += serverAnswers.end[1];
        }
        return answer;
    }
    let executeCommandNumber = _ => {
        let tries = gameStore.getParam(sessionId, 'tries');
        const guessNumber = gameStore.getParam(sessionId, 'number');
        
        if (!guessNumber) 
            return serverAnswers['not start yet'];

        const gameAnswer = game.turn(commandNumber, guessNumber, tries);
        gameStore.addParam(sessionId, {key: 'tries', value: gameAnswer.tries});
        tries = gameStore.getParam(sessionId, 'tries');

        let answer = '';
        
        if (gameAnswer.answer === game.allAnswers().INVALID) {
            return serverAnswers['out of range'];
        }

        if (gameAnswer.answer === game.allAnswers().RIGHT) {
            gameStore.clearKey(sessionId);
            answer = serverAnswers['right'];
            answer += '\r\nTries: ' + tries + '. Number: ' + guessNumber;
        }
        else {
            if (tries % 2 === 0) {
                if (gameStore.getParam(sessionId, 'isPrime') === undefined) {
                    const isPrime = game.isPrime(guessNumber);
                    gameStore.addParam(sessionId, {key: 'isPrime', value: isPrime});
                    if (isPrime) {
                        answer = serverAnswers.prime + '\r\n';
                    }
                }
                if (typeof gameStore.getParam(sessionId, 'isPrime') === 'boolean' && 
                    !gameStore.getParam(sessionId, 'isPrime')) {
                    
                    const divider = game.dividedBy(guessNumber);
                    answer = serverAnswers['divide by'] + divider.toString() + '\r\n';
                }
            }
            if (gameAnswer.answer === game.allAnswers().TOO_SMALL) {
                answer += serverAnswers['too small'];
            } 
            else if (gameAnswer.answer === game.allAnswers().TOO_BIG) {
                answer += serverAnswers['too big'];
            }
        }
        return answer;
    }
    let executeDefaultCommand = _ => serverAnswers.default;
    
    const answers = {};
    answers[USER_COMMANDS.HELLO] = executeCommandHello;
    answers[USER_COMMANDS.START] = executeCommandStart;
    answers[USER_COMMANDS.END] = executeCommandEnd;
    answers[COMMAND_NUMBER] = executeCommandNumber;
    answers[COMMAND_DEFAULT] = executeDefaultCommand;
    return answers;
}

exports.getServerAnswer = request => {
    let userCommand = extractCommandFromRequest(request);
    const sessionId = request.session.userId;

    return executeCommand(sessionId, userCommand.number)[userCommand.command](); 
}