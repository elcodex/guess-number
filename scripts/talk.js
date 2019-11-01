const game = require('./game.js');
const appStore = require('./store.js');

const COMMANDS = ['hello', 'start', 'end'];
const DO_NOTHING = 'do nothing';
const NUMBER = 'number';
const FROM = 1;
const TO = 100;

const fs = require('fs');
const serverAnswersData = fs.readFileSync('data/answers.json', 'utf-8');
const serverAnswers = JSON.parse(serverAnswersData);

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
    let answer = serverAnswers.default;
    const sessionId = request.session.userId;
    if ('command' in action) {
        if (action.command === 'hello') {
            answer = serverAnswers.hello;
            appStore.addKey(sessionId);
        } else if (action.command === 'start') {
            const number = game.start(FROM, TO);
            appStore.addParam(sessionId, {key: 'number', value: number});
            appStore.addParam(sessionId, {key: 'tries', value: 0});
            answer = serverAnswers.start;
        } else if (action.command === 'number' && appStore.getParam(sessionId, 'number') !== undefined) {
            let tries = appStore.getParam(sessionId, 'tries');
            const guessNumber = appStore.getParam(sessionId, 'number');
            const gameAnswer = game.turn(action.number, guessNumber, tries);
            appStore.addParam(sessionId, {key: 'tries', value: gameAnswer.tries});
            tries = appStore.getParam(sessionId, 'tries');
            if (gameAnswer.answer === game.allAnswers().RIGHT) {
                appStore.clearKey(sessionId);
                answer = serverAnswers['right'];
                answer += '\nTries: ' + tries + '. Number: ' + guessNumber;
            } else if (action.number < FROM || action.number >= TO) {
                answer = serverAnswers['out of range'];
            } else if (tries % 2 === 0) {
                if (appStore.getParam(sessionId, 'isPrime') === undefined) {
                    const isPrime = game.isPrime(guessNumber);
                    appStore.addParam(sessionId, {key: 'isPrime', value: isPrime});
                    if (isPrime) {
                        answer = serverAnswers.prime;
                    } else {
                        const divider = game.dividedBy(guessNumber);
                        answer = serverAnswers['divide by'] + divider.toString();
                    }
                } else if (appStore.getParam(sessionId, 'isEven') === undefined) {
                    const isEven = game.isEven(guessNumber);
                    appStore.addParam(sessionId, {key: 'isEven', value: isEven});
                    if (isEven) {
                        answer = serverAnswers.even;
                    } else {
                        answer = serverAnswers.odd;
                    }
                } else {
                    const divider = game.dividedBy(guessNumber);
                    answer = serverAnswers['divide by'] + divider.toString();
                }
            } else if (action.command === 'number' && appStore.getParam(sessionId, 'number') === undefined) {
                answer = serverAnswers['not start yet'];    
            } else if (gameAnswer.answer === game.allAnswers().TOO_SMALL) {
                answer = serverAnswers['too small'];
            } else if (gameAnswer.answer === game.allAnswers().TOO_BIG) {
                answer = serverAnswers['too big'];
            }
        }
        else if (action.command === 'end') {
            const gameResults = {
                number: appStore.getParam(sessionId, 'number'),
                tries: appStore.getParam(sessionId, 'tries'),
            }
            appStore.clearKey(sessionId);
            answer = serverAnswers.end[0] + gameResults.number;
            answer += serverAnswers.end[1];
        }
    }
    console.log(appStore.getInfo(sessionId));
    return answer; 
}


