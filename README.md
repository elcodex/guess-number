# Guessing a number

[Project page](https://guess-number1234.herokuapp.com/)

The Server guesses a number and the User tries to get it. User sends the number, server gives a clue.

Server support the next commands:

- `HELLO` - start talking with the server,
- `START` - play a guess game,
- `END` - end the current game,
- `HELP` - list supported commands,
- <number> - guess a number.

## Implementation details

- server side: Express.js, Handlebars.js templates
- client side: JS, HTML, CSS,
- deployed on Heroku.