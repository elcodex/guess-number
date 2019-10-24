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
    console.log(display.getElementsByClassName.height, display.scrollHeight);
}