document.querySelector('.answer-form__button').addEventListener('click', e => {
    const data = new FormData(document.querySelector('.answer-form'));
    
    displayMessage(data.get('message'), 'client');   
    e.preventDefault();
   
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onerror = _ => console.log('error', xmlHttpRequest.statusText);
    xmlHttpRequest.onloadstart = _ => console.log('load starts');
    xmlHttpRequest.onloadend = _ => {
        console.log('load ends', xmlHttpRequest.statusText);
        displayMessage(xmlHttpRequest.responseText, 'server');
    }
    xmlHttpRequest.onload = _ => console.log('load', xmlHttpRequest.statusText);

    xmlHttpRequest.open('post', '/');
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttpRequest.send(`message=${data.get('message')}`);
});

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