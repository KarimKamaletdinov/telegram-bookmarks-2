import {send} from './telegram.js';

let botId, chatId;
if (!localStorage["chat_id"] || !localStorage["bot_id"]) {
    browser.runtime.openOptionsPage().then();
} else {
    botId = parseInt(localStorage["bot_id"]);
    chatId = parseInt(localStorage["chat_id"]);
}

function updateTab(tabs) {
    if (tabs[0]) {
        const currentTab = tabs[0];
        if (currentTab.url !== undefined) {
            const searching = browser.bookmarks.search({url: currentTab.url});
            searching.then((bookmarks) => {
                const currentBookmark = bookmarks[0];
                if (currentBookmark) {
                    send(botId, chatId, currentBookmark.url).then();
                }
            });
        }
    }
}

function updateActiveTab(_) {
    const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then(updateTab);
}

function handleMessage(request, _, __){
    chatId = request.chatId;
    botId = request.botId;
    localStorage["chat_id"] = chatId;
    localStorage["bot_id"] = botId;
}

browser.runtime.onMessage.addListener(handleMessage);
browser.bookmarks.onCreated.addListener(updateActiveTab);
updateActiveTab();