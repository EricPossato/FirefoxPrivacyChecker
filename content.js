
var local_storage = JSON.stringify(localStorage);
browser.runtime.sendMessage({type : "getLocalStorage", data : local_storage});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == "fetchLocalStorage") {
        browser.runtime.sendMessage({type : "getLocalStorage", data : local_storage});
    }
});