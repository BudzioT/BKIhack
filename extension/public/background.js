// background.js
// Firefox compatibility: Use browser if available, fallback to chrome
const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkEmailPage") {
        // Message from popup to verify if we're on an email page
        api.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                const url = tabs[0].url;
                sendResponse({
                    isEmailPage: url.includes('mail.google.com') ||
                        url.includes('outlook.') ||
                        url.includes('mail.yahoo.com'),
                    url: url
                });
            } else {
                sendResponse({
                    isEmailPage: false,
                    error: "No active tab found"
                });
            }
        });
        return true; // For async response
    }
});