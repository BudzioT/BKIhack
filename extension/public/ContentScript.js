// contentScript.js
console.log("VanishHive content script loaded");

// Firefox compatibility: Use browser if available, fallback to chrome
const api = typeof browser !== 'undefined' ? browser : chrome;

// Listen for messages from the extension
api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractEmail") {
        // Extract the email data based on current page
        const emailData = extractEmailContent();
        sendResponse(emailData);
    }
    // Always return true for async response
    return true;
});

function extractEmailContent() {
    try {
        const url = window.location.href;

        // Gmail detection
        if (url.includes('mail.google.com')) {
            return extractGmailContent();
        }
        // Outlook detection
        else if (url.includes('outlook.live') || url.includes('outlook.office')) {
            return extractOutlookContent();
        }
        // Yahoo Mail detection
        else if (url.includes('mail.yahoo.com')) {
            return extractYahooContent();
        }
        else {
            return {
                error: "Unsupported email provider or not on an email page",
                url: url
            };
        }
    } catch (err) {
        return {
            error: "Error extracting email content: " + err.message,
            stack: err.stack
        };
    }
}

function extractGmailContent() {
    // Check if we're viewing an email
    const emailContainer = document.querySelector('.a3s');
    if (!emailContainer) {
        return {
            provider: "Gmail",
            error: "No email content found. Please open an email to scan.",
            elements: {
                mainDiv: document.querySelector('div[role="main"]') !== null,
                a3sClass: document.querySelectorAll('.a3s').length
            }
        };
    }

    // Get email subject
    const subjectElement = document.querySelector('h2[data-thread-perm-id]');
    const subject = subjectElement ? subjectElement.textContent : 'Unknown Subject';

    // Get sender information
    const senderElement = document.querySelector('span[email]');
    const sender = senderElement ? senderElement.getAttribute('email') : 'Unknown Sender';
    const senderName = senderElement ? senderElement.textContent : 'Unknown';

    // Extract ONLY the email body content, not the surrounding UI elements
    const bodyText = emailContainer.textContent || '';

    return {
        provider: 'Gmail',
        subject,
        sender,
        senderName,
        bodyPreview: bodyText.substring(0, 500) + (bodyText.length > 500 ? '...' : ''),
        bodyLength: bodyText.length
    };
}

function extractOutlookContent() {
    // Check if we're viewing an email
    const emailBody = document.querySelector('.ReadingPaneContent');
    if (!emailBody) {
        return {
            provider: "Outlook",
            error: "No email content found. Please open an email to scan."
        };
    }

    // Get email subject
    const subjectElement = document.querySelector('[role="heading"]');
    const subject = subjectElement ? subjectElement.textContent : 'Unknown Subject';

    // Get sender information
    const senderElement = document.querySelector('.RPEPersona');
    const sender = senderElement ? senderElement.textContent : 'Unknown Sender';

    // Extract body content
    const bodyContentElement = document.querySelector('[role="region"]');
    const bodyText = bodyContentElement ? bodyContentElement.textContent : '';

    return {
        provider: 'Outlook',
        subject,
        sender,
        bodyPreview: bodyText.substring(0, 500) + (bodyText.length > 500 ? '...' : ''),
        bodyLength: bodyText.length
    };
}

function extractYahooContent() {
    // Similar implementation to above for Yahoo Mail
    return {
        provider: 'Yahoo Mail',
        status: 'Implementation needed',
        url: window.location.href
    };
}