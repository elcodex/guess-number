document.querySelector('.answer-form__message').value = "";

document.querySelector('.answer-form__button').addEventListener('click', e => {
    e.preventDefault();
    displayAndPost();
});

document.querySelector('.answer-form__message').addEventListener('keypress', e => {
    if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        displayAndPost();
    }
})

let displayAndPost = _ => {
    const data = new FormData(document.querySelector('.answer-form'));
    const messageText = data.get('message').trim();
    
    displayMessage(messageText, 'client');
    postMessage(messageText);

    document.querySelector('.answer-form__message').value = "";
}

let postMessage = message => {
    let xhr = new XMLHttpRequest();
    xhr.onerror = _ => console.log('error', xhr.statusText);
    xhr.onloadend = _ => displayMessage(xhr.responseText, 'server');
    xhr.open('post', '/');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`message=${message.substring(0, 20)}`); 
}

let displayMessage = (text, from) => {
    let authorTag = document.createElement('span');
    authorTag.classList.add('message__author');
    authorTag.innerText = from === 'client' ? 'you' : from;

    let textTag = document.createElement('span');
    textTag.classList.add('message__text');
    textTag.innerText = text;

    let messageContainer = document.createElement('li');
    messageContainer.classList.add(`message-history__${from}-message`);
    messageContainer.appendChild(authorTag);
    messageContainer.innerHTML += ': ';
    messageContainer.appendChild(textTag);

    let display = document.querySelector('.message-history__list');
    display.appendChild(messageContainer);
    document.querySelector('.message-history').scrollTop = display.scrollHeight;
}