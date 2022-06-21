import {send, getUpdates} from './telegram.js';

let timerId = 0;

async function waitForCode(secretCode, botId, onFound) {
    const updates = await getUpdates(botId);
    updates.result.forEach(update => {
        const message = update.message;
        if (message !== undefined) {
            if (message.text === secretCode.toString()) {
                clearInterval(timerId);
                onFound(botId, message.chat.id, message.chat.type, message.chat.type === 'group' ? message.chat.title : message.chat.first_name);
            }
        }
    });
}


async function onCodeFound(botId, chatId, chatType, chatName){
    document.querySelector("#secret_code_container").setAttribute('hidden', '');
    document.querySelector("#ok_text_container").removeAttribute('hidden');
    document.querySelector("#chat_id").textContent = chatId;
    document.querySelector("#chat_type").textContent = chatType;
    document.querySelector("#chat_name").textContent = chatName;
    await send(botId, chatId, "Hello");
    await send(botId, chatId, "This is Telegram-bookmarks plugin")
    await send(botId, chatId, "Now you are able to add some page into Bookmarks in your Firefox browser");
    await send(botId, chatId, "and probably this bot will send it here");
    await browser.runtime.sendMessage({chatId: chatId, botId: botId});
}

const input = document.querySelector("#bot_id");

document.querySelector("#form_submit").onclick = _ => {
    const botId = input.value;
    document.querySelector("#form_container").setAttribute('hidden', '');
    document.querySelector("#secret_code_container").removeAttribute('hidden');
    const secretCode = Math.floor(Math.random() * 1000);
    document.querySelector("#secret_code").textContent = secretCode;
    timerId = setInterval(waitForCode, 2000, secretCode, botId, onCodeFound);
};