export async function send(botId, chatId, message){
    await fetch('https://api.telegram.org/bot' + botId + '/sendMessage', {
        method: "POST",
        body: JSON.stringify(
            {
                "chat_id": chatId,
                "text": message
            }
        ),
        headers: {'Content-Type': 'application/json'}
    });
}
export async function getUpdates(botId){
    return await (await fetch('https://api.telegram.org/bot' + botId + '/getUpdates')).json()
}