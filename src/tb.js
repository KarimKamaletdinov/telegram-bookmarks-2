
if (!localStorage["chat_id"] || !localStorage["bot_id"]) {
    var openingPage = browser.runtime.openOptionsPage()
}else{
    var botId = parseInt(localStorage["bot_id"]);
    var chatId = parseInt(localStorage["chat_id"]);
}

function send(message) {
    if(chatId == NaN){
        return;
    }
    console.log("hello");
    var r = new XMLHttpRequest();
    r.open("POST", "https://api.telegram.org/bot5201400586:AAHNgfqgmzt-utOrLFVXNjnTVP7AlksJUgI/sendMessage", true);
    r.setRequestHeader("Content-Type", "application/json");
    r.send(JSON.stringify(
        {
            "chat_id": chatId,
            "text": message
        }
    ));
}

function updateTab(tabs) {
    if (tabs[0]) {
        var currentTab = tabs[0];
        if (currentTab.url != undefined) {
            var searching = browser.bookmarks.search({ url: currentTab.url });
            searching.then((bookmarks) => {
                var currentBookmark = bookmarks[0];
                if (currentBookmark) {
                    send(currentBookmark.url);
                }
            });
        }
    }
}

function updateActiveTab(tabs) {
    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then(updateTab);
}

function handleMessage(request, sender, sendResponse){
    chatId = request.chatId;
    botId = request.botId;
    localStorage["chat_id"] = chatId;
    localStorage["bot_id"] = botId;
}

browser.runtime.onMessage.addListener(handleMessage);
browser.bookmarks.onCreated.addListener(updateActiveTab);
updateActiveTab();