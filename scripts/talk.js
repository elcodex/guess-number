const game = require('./game.js');
const gameStore = require('./store.js');

const fs = require('fs');
const serverAnswersData = fs.readFileSync('data/answers.json', 'utf-8');
const serverAnswers = JSON.parse(serverAnswersData);

const USER_COMMANDS = {HELLO: 'hello', START: 'start', END: 'end', HELP: 'help'};
const COMMAND_DEFAULT = 'do nothing';
const COMMAND_NUMBER = 'number';

let extractCommandFromRequest = request => {
    const command = request.body.message.split(/ |\n|\r|\r\n/, 1)[0].toLowerCase();

    if (Object.values(USER_COMMANDS).includes(command))
        return {command};

    const number = Number(command);
    if (number && !isNaN(number))
        return {command: COMMAND_NUMBER, number};

    return {command: COMMAND_DEFAULT};
}

let executeCommand = (sessionId, commandNumber = 0) => {
    let executeCommandHello = () => {
        gameStore.addKey(sessionId);
        return {template: serverAnswers.hello};
    }
    let executeCommandStart = () => {
        const number = game.start();
        gameStore.addParam(sessionId, {key: 'number', value: number});
        gameStore.addParam(sessionId, {key: 'tries', value: 0});
        return {template: serverAnswers.start};
    }
    let executeCommandEnd = () => {
        let answer = serverAnswers['not start yet'];
        let data = {};
        if (gameStore.getParam(sessionId, 'number')) {
            const gameResults = {
                number: gameStore.getParam(sessionId, 'number'),
                tries: gameStore.getParam(sessionId, 'tries'),
            }
            gameStore.clearKey(sessionId);
            answer = serverAnswers.end;
            data = {number: gameResults.number};
        }
        return {template: answer, data};
    }
    let executeCommandNumber = () => {
        let tries = gameStore.getParam(sessionId, 'tries');
        const guessNumber = gameStore.getParam(sessionId, 'number');
        
        if (!guessNumber) 
            return {template: serverAnswers['not start yet']};

        const gameAnswer = game.turn(commandNumber, guessNumber, tries);
        gameStore.addParam(sessionId, {key: 'tries', value: gameAnswer.tries});
        tries = gameStore.getParam(sessionId, 'tries');

        let answer = '';
        let data = {};
        if (gameAnswer.answer === game.allAnswers().INVALID) {
            return {template: serverAnswers['out of range']};
        }

        if (gameAnswer.answer === game.allAnswers().RIGHT) {
            gameStore.clearKey(sessionId);
            answer = serverAnswers['right'];
            data = {tries, number: guessNumber};
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
                    answer = serverAnswers['divide by'] + '\r\n';
                    data = {number: divider};
                }
            }
            if (gameAnswer.answer === game.allAnswers().TOO_SMALL) {
                answer += serverAnswers['too small'];
            } 
            else if (gameAnswer.answer === game.allAnswers().TOO_BIG) {
                answer += serverAnswers['too big'];
            }
        }
        return {template: answer, data};
    }

    let executeDefaultCommand = () => ({template: serverAnswers.default});
    
    let executeCommandHelp = () => ({template: serverAnswers.help});

    const answers = {};
    answers[USER_COMMANDS.HELLO] = executeCommandHello;
    answers[USER_COMMANDS.START] = executeCommandStart;
    answers[USER_COMMANDS.END] = executeCommandEnd;
    answers[COMMAND_NUMBER] = executeCommandNumber;
    answers[COMMAND_DEFAULT] = executeDefaultCommand;
    answers[USER_COMMANDS.HELP] = executeCommandHelp;
    return answers;
}

exports.getServerAnswer = request => {
    let userCommand = extractCommandFromRequest(request);
    const sessionId = request.session.userId;

    return executeCommand(sessionId, userCommand.number)[userCommand.command](); 
}

exports.getHistoryMessages = request => {
    const sessionId = request.session.userId;
    const startMessage = {from: 'server', author: 'server', text: serverAnswers.help};
    let messages = gameStore.getParam(sessionId, 'history') || [];
    if (messages.length === 0) {
        messages.push(startMessage);
    }

    return messages;
}