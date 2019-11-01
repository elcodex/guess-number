const game = require('./game.js');
const appStore = require('./store.js');

const COMMANDS = ['hello', 'start', 'end'];
const DO_NOTHING = 'do nothing';
const NUMBER = 'number';

const fs = require('fs');
const serverAnswersData = fs.readFileSync('data/answers.json', 'utf-8');
const serverAnswers = JSON.parse(serverAnswersData);
//console.log(serverAnswers);

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
        }
        else if (action.command === 'start') {
            const number = game.start(1, 100);
            appStore.addParam(sessionId, {key: 'number', value: number});
            appStore.addParam(sessionId, {key: 'tries', value: 0});
            answer = serverAnswers.start;
        }
        else if (action.command === 'number') {
            const tries = appStore.getParam(sessionId, 'tries');
            const guessNumber = appStore.getParam(sessionId, 'number');
            const gameAnswer = game.turn(action.number, guessNumber, tries);
            appStore.addParam(sessionId, {key: 'tries', value: gameAnswer.tries});
            console.log(action.number, guessNumber, tries, gameAnswer);
            if (gameAnswer.answer === game.allAnswers().TOO_SMALL) {
                answer = serverAnswers['too small'];
            } else if (gameAnswer.answer === game.allAnswers().TOO_BIG) {
                answer = serverAnswers['too big'];
            } else if (gameAnswer.answer === game.allAnswers().RIGHT) {
                const gameResults = {
                    number: appStore.getParam(sessionId, 'number'),
                    tries: appStore.getParam(sessionId, 'tries'),
                }
                appStore.clearKey(sessionId);
                answer = serverAnswers['right'];
                answer += '\nTries: ' + gameResults.tries + '. Number: ' + gameResults.number;
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


