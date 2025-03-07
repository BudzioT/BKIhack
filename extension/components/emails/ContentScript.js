function extractEmailConcept() {
    const emailBody = document.querySelector('[role="article"]');
    return emailBody ? emailBody.innerText : null;
}