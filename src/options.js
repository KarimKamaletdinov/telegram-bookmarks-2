function getUpdates(botId) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.telegram.org/bot" + botId  + "/getUpdates", false);
    request.send();
    return JSON.parse(request.response);
}
function send(botId, chatId, message) {
    console.log("hello");
    var r = new XMLHttpRequest();
    r.open("POST", "https://api.telegram.org/bot" + botId  + "/sendMessage", false);
    r.setRequestHeader("Content-Type", "application/json");
    r.send(JSON.stringify(
        {
            "chat_id": chatId,
            "text": message
        }
    ));
}
var timerId = 0;
function vaitForCode(secretCode, botId, onFound) {
    updates = getUpdates(botId);
    updates.result.forEach(update => {
        var message = update.message;
        if (message != undefined) {
            if (message.text == secretCode) {
                clearInterval(timerId);
                onFound(botId, message.chat.id, message.chat.type, message.chat.type == 'group' ? message.chat.title : message.chat.first_name);
            }
        }
    });
}


function onCodeFound(botId, chatId, chatType, chatName){
    document.querySelector("#secret_code_container").setAttribute('hidden', '');
    document.querySelector("#ok_text_container").removeAttribute('hidden');
    document.querySelector("#chat_id").textContent = chatId;
    document.querySelector("#chat_type").textContent = chatType;
    document.querySelector("#chat_name").textContent = chatName;
    send(botId, chatId, "Hello");
    send(botId, chatId, "This is Telegram-bookmarks plugin")
    send(botId, chatId, "Now you are able to add some page into Bookmarks in your Firefox browser");
    send(botId, chatId, "and probably this bot will send it here");
    browser.runtime.sendMessage({chatId: chatId, botId: botId});
}

const input = document.querySelector("#bot_id");

document.querySelector("#form_submit").onclick = event => {
    const botId = input.value;
    document.querySelector("#form_container").setAttribute('hidden', '');
    document.querySelector("#secret_code_container").removeAttribute('hidden');
    const secretCode = Math.floor(Math.random() * 1000);
    document.querySelector("#secret_code").textContent = secretCode;
    timerId = setInterval(vaitForCode, 2000, secretCode, botId, onCodeFound);
};