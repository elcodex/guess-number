document.querySelector('.form__button').addEventListener('click', e => {
    const data = new FormData(document.querySelector('.form'));
    
    displayMessage(data.get('message'), 'you');   
    e.preventDefault();
   
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onerror = _ => console.log('error', xmlHttpRequest.statusText);
    xmlHttpRequest.onloadstart = _ => console.log('load starts');
    xmlHttpRequest.onloadend = _ => {
        console.log('load ends', xmlHttpRequest.statusText);
        console.log(xmlHttpRequest.responseText);
        displayMessage(xmlHttpRequest.responseText, 'server');
    }
    xmlHttpRequest.onload = _ => console.log('load', xmlHttpRequest.statusText);

    xmlHttpRequest.open('post', '/');
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttpRequest.send(`message=${data.get('message')}`);
});

let displayMessage = (text, from) => {
    let messageContainer = document.createElement('div');
    messageContainer.classList.add(`${from}-message`);
    let messageTag = document.createElement('p');
    let authorTag = document.createElement('span');
    authorTag.classList.add('message__author');
    authorTag.innerText = from;
    let textTag = document.createElement('span');
    textTag.classList.add('message__text');
    textTag.innerText = text;
    messageTag.appendChild(authorTag);
    messageTag.innerText += ': ';
    messageTag.appendChild(textTag);
    messageContainer.appendChild(messageTag);

    let display = document.querySelector('.display-messages');
    display.appendChild(messageContainer);
    display.scrollTop = display.scrollHeight;
    //console.log(display.getElementsByClassName.height, display.scrollHeight);
}