import React, { useState, useEffect } from 'react';
import { analyzeEmailSecurity } from "../../services/groqService";

export default function EmailPage() {
    const [emailContent, setEmailContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState({});
    const [securityAnalysis, setSecurityAnalysis] = useState(null);
    const [analyzeLoading, setAnalyzeLoading] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('blur', handleMouseLeave);

        window.addEventListener('blur', () => {
            setTimeout(() => window.focus(), 0);
        });

        const extractEmails = async () => {
            try {
                setDebugInfo({status: "Starting extraction..."});

                // Check if browser API is available (Firefox uses browser instead of chrome in some contexts)
                const api = typeof browser !== 'undefined' ? browser : chrome;

                if (!api || !api.tabs) {
                    setError("Extension API not available. Are you running this in the extension context?");
                    setLoading(false);
                    return;
                }

                setDebugInfo(prev => ({...prev, status: "Getting current tab..."}));

                // Use try/catch for all API calls
                try {
                    // Wrap in Promise to handle Firefox's promise-based API
                    const getCurrentTab = () => {
                        return new Promise((resolve, reject) => {
                            api.tabs.query({active: true, currentWindow: true}, (tabs) => {
                                if (api.runtime.lastError) {
                                    reject(api.runtime.lastError);
                                    return;
                                }
                                if (!tabs || tabs.length === 0) {
                                    reject(new Error("No active tab found"));
                                    return;
                                }
                                resolve(tabs[0]);
                            });
                        });
                    };

                    // Get current tab safely
                    const currentTab = await getCurrentTab();
                    setDebugInfo(prev => ({...prev, currentUrl: currentTab.url}));

                    // Safely execute script
                    try {
                        const results = await new Promise((resolve, reject) => {
                            api.scripting.executeScript({
                                target: {tabId: currentTab.id},
                                func: () => {
                                    // More specific extraction function
                                    try {
                                        const url = window.location.href;
                                        const title = document.title;

                                        let emailData = {
                                            url,
                                            title,
                                            timestamp: new Date().toISOString(),
                                            provider: "Unknown"
                                        };

                                        // Email provider detection
                                        if (url.includes('mail.google.com')) {
                                            emailData.provider = "Gmail";

                                            // Target specifically the email content area, not the entire body
                                            const emailContentElement = document.querySelector('.a3s.aiL');
                                            emailData.emailContentExists = !!emailContentElement;

                                            if (emailContentElement) {
                                                emailData.bodyText = emailContentElement.innerText.substring(0, 200) + "...";

                                                const subjectElement = document.querySelector('h2[data-thread-perm-id]');
                                                emailData.subject = subjectElement ? subjectElement.textContent : 'Unknown Subject';

                                                const senderElement = document.querySelector('span[email]');
                                                emailData.sender = senderElement ? senderElement.getAttribute('email') : 'Unknown Sender';
                                                emailData.senderName = senderElement ? senderElement.textContent : 'Unknown';
                                            } else {
                                                emailData.bodyText = "No email content found. Please open an email first.";
                                            }
                                        }

                                        return emailData;
                                    } catch (err) {
                                        return {error: err.message};
                                    }
                                }
                            }, (results) => {
                                if (api.runtime.lastError) {
                                    reject(api.runtime.lastError);
                                    return;
                                }
                                resolve(results);
                            });
                        });

                        setDebugInfo(prev => ({...prev, scriptResults: results}));

                        if (results && results[0] && results[0].result) {
                            const emailData = results[0].result;
                            setEmailContent(emailData);

                            // If we have email content, analyze it
                            if (emailData.subject || emailData.bodyText) {
                                setAnalyzeLoading(true);
                                analyzeEmailSecurity(emailData)
                                    .then(analysis => {
                                        setSecurityAnalysis(analysis);
                                        setAnalyzeLoading(false);
                                    })
                                    .catch(err => {
                                        setError("Security analysis error: " + err.message);
                                        setAnalyzeLoading(false);
                                    });
                            }
                        } else {
                            setEmailContent("No email content detected.");
                        }
                    } catch (err) {
                        setError("Script error: " + err.message);
                        setDebugInfo(prev => ({...prev, scriptError: err.message}));
                    }
                } catch (err) {
                    setError("Tab access error: " + err.message);
                    setDebugInfo(prev => ({...prev, tabError: err.message}));
                }

                setLoading(false);
            } catch (err) {
                setError("Critical error: " + err.message);
                setLoading(false);
                setDebugInfo(prev => ({...prev, criticalError: err.message, stack: err.stack}));
            }
        };

        // Start extraction with a slight delay to ensure popup is fully loaded
        setTimeout(() => {
            extractEmails().then();
        }, 100);

        // Return cleanup function
        return () => {
            document.body.removeEventListener('mouseleave');
            document.body.removeEventListener('blur', handleMouseLeave);
            window.removeEventListener('blur');
        };
    }, []);

    return (
        <div id="email_page" style={{padding: '1rem', maxWidth: '600px', minHeight: '300px'}}>
            <h4>Email Security Check</h4>
            <p>Stay safe and let VanishHive check your email against scams, phishing attempts and more!</p>

            {loading && <p>Loading email content...</p>}
            {error && (
                <div className="error" style={{color: 'red', marginTop: '10px'}}>
                    <p>Error: {error}</p>
                </div>
            )}

            {/* Security Analysis Display */}
            {analyzeLoading && <p>Analyzing email security...</p>}

            {securityAnalysis && (
                <div className="security-analysis" style={{
                    marginTop: '15px',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: securityAnalysis.isSafe ? '#eefbf1' : '#fbeeee',
                    border: `1px solid ${securityAnalysis.isSafe ? '#4caf50' : '#f44336'}`
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        {securityAnalysis.isSafe ? (
                            <div style={{
                                color: '#4caf50',
                                fontSize: '24px',
                                marginRight: '10px'
                            }}>✓</div>
                        ) : (
                            <div style={{
                                color: '#f44336',
                                fontSize: '24px',
                                marginRight: '10px'
                            }}>✗</div>
                        )}
                        <h5 style={{margin: 0}}>
                            {securityAnalysis.isSafe ? 'This email appears safe' : 'This email may be dangerous'}
                        </h5>
                    </div>

                    <div style={{marginBottom: '10px'}}>
                        <strong>Threat Level:</strong>
                        <div style={{
                            width: '100%',
                            height: '10px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '5px',
                            overflow: 'hidden',
                            marginTop: '5px'
                        }}>
                            <div style={{
                                width: `${securityAnalysis.threatLevel * 10}%`,
                                height: '100%',
                                backgroundColor: getThreatLevelColor(securityAnalysis.threatLevel)
                            }}></div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            marginTop: '3px'
                        }}>
                            <span>Safe (0)</span>
                            <span>Dangerous (10)</span>
                        </div>
                    </div>

                    <div>
                        <strong>Analysis:</strong>
                        <p>{securityAnalysis.reasoning}</p>
                    </div>
                </div>
            )}

            {emailContent && (
                <div className="email-content-container">
                    <h5>Extracted Email Content:</h5>
                    {/* Email content display */}
                </div>
            )}

            {/* Debug Info Section */}
            <div style={{marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px', color: 'white'}}>
                <details>
                    <summary>Debug Information</summary>
                    <pre style={{fontSize: '12px'}}>{JSON.stringify(debugInfo, null, 2)}</pre>
                </details>
            </div>

            {/* Add a hidden div with height to keep popup open */}
            <div style={{height: '300px'}}></div>
        </div>
    );
}

function getThreatLevelColor(level) {
    if (level <= 3) return '#4caf50'; // Green for low threat
    if (level <= 6) return '#ff9800'; // Orange for medium threat
    return '#f44336'; // Red for high threat
}