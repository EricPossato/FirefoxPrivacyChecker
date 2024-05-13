var cookie_number = document.cookie.split(";").length;

var local_storage = JSON.stringify(localStorage);
browser.runtime.sendMessage({type : "getLocalStorage", data : local_storage});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == "fetchLocalStorage") {
        browser.runtime.sendMessage({type : "getLocalStorage", data : local_storage});
    }
    if (message.type == "fetchCookies") {
        browser.runtime.sendMessage({type : "getCookies", data : cookie_number});
    }
});
