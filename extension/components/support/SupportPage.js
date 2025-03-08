import { useState, useEffect, useRef } from 'react';

export default function SupportPage() {
    const [activeTab, setActiveTab] = useState('faq');
    const [chatMessages, setChatMessages] = useState([
        { role: 'system', content: 'Welcome to VanishHive Support! Ask me any cybersecurity questions.' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    
    // Auto-scroll, cause pls don't make me scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);
    
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        
        // Add user message to chat
        const newMessage = { role: 'user', content: userInput };
        setChatMessages(prev => [...prev, newMessage]);
        setUserInput('');
        setIsLoading(true);
        
        try {
            // Call Groq API similar to analyzeEmailSecurity function
            const GROQ_API_KEY = "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";
            
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful cybersecurity expert providing concise guidance about email security, phishing, and online safety. Keep answers brief and clear for browser extension users."
                        },
                        ...chatMessages.filter(msg => msg.role !== 'system'),
                        newMessage
                    ],
                    temperature: 0.2
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const responseData = await response.json();
            const aiResponse = { 
                role: 'system', 
                content: responseData.choices[0]?.message?.content || "Sorry, I couldn't process your request." 
            };
            
            setChatMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error fetching from Groq API:", error);
            setChatMessages(prev => [...prev, { 
                role: 'system', 
                content: "Sorry, I encountered an error while processing your question. Please try again later." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div id="support" style={{
            padding: '15px',
            maxHeight: '500px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#414141',
            borderRadius: '8px'
        }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#f1f1f1' }}>VanishHive Support</h2>
            
            {/* Navigation Tabs */}
            <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #ddd',
                marginBottom: '15px' 
            }}>
                <button 
                    onClick={() => setActiveTab('faq')}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: activeTab === 'faq' ? '#f0cc1c' : 'transparent',
                        color: activeTab === 'faq' ? 'white' : '#f1f1f1',
                        border: 'none',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'faq' ? 'bold' : 'normal',
                        marginRight: '5px'
                    }}
                >
                    FAQ
                </button>
                <button 
                    onClick={() => setActiveTab('chat')}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: activeTab === 'chat' ? '#f0cc1c' : 'transparent',
                        color: activeTab === 'chat' ? 'white' : '#f1f1f1',
                        border: 'none',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'chat' ? 'bold' : 'normal',
                        marginRight: '5px'
                    }}
                >
                    AI Support
                </button>
                <button 
                    onClick={() => setActiveTab('resources')}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: activeTab === 'resources' ? '#f0cc1c' : 'transparent',
                        color: activeTab === 'resources' ? 'white' : '#f1f1f1',
                        border: 'none',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'resources' ? 'bold' : 'normal'
                    }}
                >
                    Resources
                </button>
            </div>
            
            {/* Content Area */}
            <div style={{ 
                overflowY: 'auto',
                flex: 1,
                padding: '5px'
            }}>
                {activeTab === 'faq' && (
                    <div>
                        <details style={{ marginBottom: '10px' }} open>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                How does VanishHive detect dangerous emails?
                            </summary>
                            <p style={{ margin: '8px 0', paddingLeft: '15px' }}>
                                VanishHive uses AI-powered analysis to examine email content and not only - for signs of phishing,
                                suspicious links, urgent requests for personal information, grammatical errors 
                                typical of scams, mismatched sender information, and mentions of suspicious attachments.
                            </p>
                        </details>
                        
                        <details style={{ marginBottom: '10px' }}>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                What are common signs of phishing emails?
                            </summary>
                            <ul style={{ paddingLeft: '30px', margin: '8px 0' }}>
                                <li>Spelling and grammar errors</li>
                                <li>Urgent calls to action</li>
                                <li>Suspicious sender addresses</li>
                                <li>Requests for personal information</li>
                                <li>Unexpected attachments</li>
                                <li>Links that don't match claimed destinations</li>
                            </ul>
                        </details>
                        
                        <details style={{ marginBottom: '10px' }}>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                How accurate is the threat detection?
                            </summary>
                            <p style={{ margin: '8px 0', paddingLeft: '15px' }}>
                                Our system uses advanced AI models for threat detection with high accuracy rates. 
                                However, new techniques emerge constantly. We recommend using VanishHive
                                alongside good security practices like verifying unusual requests directly with the sender for emails.
                            </p>
                        </details>
                        
                        <details style={{ marginBottom: '10px' }}>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                What should I do if an email is flagged as dangerous?
                            </summary>
                            <p style={{ margin: '8px 0', paddingLeft: '15px' }}>
                                Don't click any links or download attachments. Don't reply with personal information.
                                If it's from an organization you know, contact them directly through official channels
                                (not using contact info from the suspicious email) to verify authenticity.
                            </p>
                        </details>
                        
                        <details style={{ marginBottom: '10px' }}>
                            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                Does VanishHive protect against all threats?
                            </summary>
                            <p style={{ margin: '8px 0', paddingLeft: '15px' }}>
                                VanishHive provides an additional layer of protection, but no system can guarantee 
                                100% detection of all threats. Always practice good security habits and keep your 
                                devices and software updated.
                            </p>
                        </details>
                    </div>
                )}
                
                {activeTab === 'chat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '330px' }}>
                        <div style={{ 
                            flex: 1, 
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ddd'
                        }}>
                            {chatMessages.map((msg, index) => (
                                <div key={index} style={{
                                    marginBottom: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{
                                        backgroundColor: msg.role === 'user' ? '#5b6368' : '#f7b613',
                                        borderRadius: '10px',
                                        padding: '8px 12px',
                                        maxWidth: '85%',
                                        wordBreak: 'break-word'
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <span>Thinking...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        
                        <div style={{ display: 'flex' }}>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about cybersecurity..."
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginRight: '8px'
                                }}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !userInput.trim()}
                                style={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '8px 15px',
                                    cursor: isLoading || !userInput.trim() ? 'not-allowed' : 'pointer',
                                    opacity: isLoading || !userInput.trim() ? 0.7 : 1
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
                
                {activeTab === 'resources' && (
                    <div>
                        <h4 style={{ margin: '0 0 10px 0' }}>Educational Resources</h4>
                        
                        <div style={{ 
                            backgroundColor: '#d98505',
                            padding: '10px', 
                            borderRadius: '5px',
                            marginBottom: '10px'
                        }}>
                            <h5 style={{ margin: '0 0 5px 0' }}>Email Security Basics</h5>
                            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                                <li>Never share passwords or financial information via email</li>
                                <li>Verify sender identities before responding to requests</li>
                                <li>Don't click links without hovering to check the destination URL</li>
                                <li>Be wary of unexpected attachments, even from known senders</li>
                            </ul>
                        </div>
                        
                        <div style={{ 
                            backgroundColor: '#ecae54',
                            padding: '10px', 
                            borderRadius: '5px',
                            marginBottom: '10px'
                        }}>
                            <h5 style={{ margin: '0 0 5px 0' }}>Create Strong Passwords</h5>
                            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                                <li>Use a mix of uppercase, lowercase, numbers and symbols</li>
                                <li>Aim for at least 12 characters in length</li>
                                <li>Don't reuse passwords across different accounts</li>
                                <li>Consider using a password manager</li>
                            </ul>
                        </div>
                        
                        <div style={{ 
                            backgroundColor: '#c6ae1e',
                            padding: '10px', 
                            borderRadius: '5px' 
                        }}>
                            <h5 style={{ margin: '0 0 5px 0' }}>Recommended Security Tools</h5>
                            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                                <li>Two-factor authentication apps</li>
                                <li>Password managers</li>
                                <li>VPN services for public Wi-Fi</li>
                                <li>Up-to-date antivirus software</li>
                            </ul>
                        </div>

                        <div style={{
                            backgroundColor: '#c08f39',
                            padding: '10px',
                            borderRadius: '5px'
                        }}>
                            <h5 style={{ margin: '0 0 5px 0' }}>Recommended learning sources</h5>
                            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                                <li><a href="https://roadmap.sh/cyber-security">CyberSecurity Roadmap</a></li>
                                <li><a href="https://tryhackme.com/">Put yourself in place of a Hacker</a></li>
                                <li><a href="https://thehackernews.com/">Fresh news about threats</a></li>
                                <li><a href="https://www.youtube.com/LiveOverflow">High-quality videos covering vulnerabilities</a></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}