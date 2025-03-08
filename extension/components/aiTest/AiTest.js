import { useState, useEffect, useRef } from 'react';

export default function AiTest() {
    const [activeTab, setActiveTab] = useState('attack');

    // Attack simulation states
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [awarenessLevel, setAwarenessLevel] = useState(50);
    const [gameState, setGameState] = useState('intro'); // intro, playing, won, lost
    const [attackType, setAttackType] = useState('');
    const chatEndRef = useRef(null);

    // Quiz states
    const [quizState, setQuizState] = useState('intro'); // intro, question, feedback, completed
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [quizFeedback, setQuizFeedback] = useState('');
    const [quizScore, setQuizScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);

    // Attack types for randomization
    const attackTypes = [
        "phishing", "pretexting", "baiting", "quid pro quo", "tailgating", "whaling", "diversion theft",
        "business email compromise", "vishing", "smishing", "watering hole attack", "spear phishing",
        "honey trap", "impersonation", "shoulder surfing"
    ];

    // Auto-scroll chat, again - I don't wanna scroll, do it for me
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Initialize daa Hack!
    useEffect(() => {
        if (activeTab === 'attack' && chatMessages.length === 0) {
            setChatMessages([
                {
                    role: 'system',
                    content: 'Welcome to Social Engineering Defense Training! I will simulate a social engineering attack, and you need to respond appropriately. Your awareness meter starts at 50%. Respond carefully to increase it to 100% and win, or risk losing if it drops too low. Ready to start?'
                }
            ]);
        }
    }, [activeTab]);

    const startAttackSimulation = async () => {
        // Reset game state
        setAwarenessLevel(50);
        setGameState('playing');
        setChatMessages([]);
        setIsLoading(true);

        // Select random attack type
        const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        setAttackType(randomAttack);

        try {
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
                            content: `You are simulating a ${randomAttack} social engineering attack in an educational setting. Start the conversation with a realistic opener that someone using this technique might use. Don't reveal that this is a simulation, act like the attacker. Be persuasive but include subtle red flags that a vigilant user could detect. Keep messages brief.`
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const responseData = await response.json();
            const firstMessage = {
                role: 'attacker',
                content: responseData.choices[0]?.message?.content || "Error initializing attack simulation."
            };

            setChatMessages([firstMessage]);
        } catch (error) {
            console.error("Error fetching from Groq API:", error);
            setChatMessages([{
                role: 'system',
                content: "There was an error starting the simulation. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        // Add user message
        const newMessage = { role: 'user', content: userInput };
        const updatedMessages = [...chatMessages, newMessage];
        setChatMessages(updatedMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const GROQ_API_KEY = "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";

            // Fomrattin for API
            const apiMessages = updatedMessages.map(msg => {
                if (msg.role === 'attacker') return { role: 'assistant', content: msg.content };
                return { role: msg.role, content: msg.content };
            });

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
                            content: `You are simulating a ${attackType} social engineering attack for educational purposes. Continue the conversation realistically. You should act like in a real scenario - where you hide your intentions, and use tricks, social engineering to achieve goals.
                            Your intentions should not be obvious. User will learn to detect tricky, but not obvious attacks.
                            After each user message, return a JSON object with 3 properties:
                            1. "message": Your next attacker message (continue the social engineering attempt)
                            2. "awarenessChange": A number between -20 and +20 indicating how the user's awareness level should change based on their response. Positive if they showed caution or detected red flags, negative if they fell for manipulation tactics.
                            3. "explanation": A brief explanation of why their awareness changed (hidden until game end)
                            Format your entire response as valid JSON.`
                        },
                        ...apiMessages
                    ],
                    temperature: 0.6,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const responseData = await response.json();
            let parsedResponse = {};

            try {
                parsedResponse = JSON.parse(responseData.choices[0]?.message?.content);
            } catch {
                // Raw content if JSON fails, cause we're lazy
                parsedResponse = {
                    message: responseData.choices[0]?.message?.content,
                    awarenessChange: 0,
                    explanation: "Could not analyze response"
                };
            }

            // Update awareness level
            const newAwarenessLevel = Math.min(Math.max(0, awarenessLevel + parsedResponse.awarenessChange), 100);
            setAwarenessLevel(newAwarenessLevel);

            // AI responsee
            setChatMessages(prev => [...prev, {
                role: 'attacker',
                content: parsedResponse.message,
                explanation: parsedResponse.explanation
            }]);

            // Conds
            if (newAwarenessLevel >= 100) {
                setGameState('won');
                getGameSummary('won');
            } else if (newAwarenessLevel <= 20) {
                setGameState('lost');
                getGameSummary('lost');
            }

        } catch (error) {
            console.error("Error in attack simulation:", error);
            setChatMessages(prev => [...prev, {
                role: 'system',
                content: "There was an error processing your response. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getGameSummary = async (outcome) => {
        setIsLoading(true);
        try {
            const GROQ_API_KEY = "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";

            const messages = chatMessages.map(msg => ({
                role: msg.role === 'attacker' ? 'assistant' : msg.role,
                content: msg.content
            }));

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
                            content: `The user just ${outcome} a simulated ${attackType} attack. Analyze the conversation and provide a comprehensive educational summary including: 1) What is a ${attackType} attack, 2) Red flags that were present in the conversation, 3) What the user did well or poorly, and 4) Advice for detecting similar attacks in the future. Be informative but concise.`
                        },
                        ...messages
                    ],
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const responseData = await response.json();
            setChatMessages(prev => [...prev, {
                role: 'system',
                content: responseData.choices[0]?.message?.content || "Game ended. No summary available."
            }]);

        } catch (error) {
            console.error("Error getting game summary:", error);
            setChatMessages(prev => [...prev, {
                role: 'system',
                content: "Game ended. Error retrieving summary."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const startQuiz = () => {
        setQuizState('question');
        setQuizScore(0);
        setQuestionCount(0);
        generateQuestion();
    };

    const generateQuestion = async () => {
        setIsLoading(true);
        try {
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
                            content: `Generate a challenging multiple-choice cybersecurity question with 4 options. Return a JSON object with these properties:
                            "question": The question text
                            "options": Array of 4 answer choices
                            "correctIndex": Index (0-3) of the correct answer
                            "explanation": Detailed explanation of why the correct answer is right and others are wrong
                            Format as valid JSON.`
                        }
                    ],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const responseData = await response.json();
            const questionData = JSON.parse(responseData.choices[0]?.message?.content);
            setCurrentQuestion(questionData);
            setQuestionCount(prev => prev + 1);

        } catch (error) {
            console.error("Error generating question:", error);
            setCurrentQuestion({
                question: "Error generating question",
                options: ["Try again"],
                correctIndex: 0,
                explanation: "An error occurred"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelection = (index) => {
        setSelectedAnswer(index);
        const isCorrect = index === currentQuestion.correctIndex;

        if (isCorrect) {
            setQuizScore(prev => prev + 1);
            setQuizFeedback(`Correct! ${currentQuestion.explanation}`);
        } else {
            setQuizFeedback(`Incorrect. The correct answer is "${currentQuestion.options[currentQuestion.correctIndex]}". ${currentQuestion.explanation}`);
        }

        setQuizState('feedback');
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);

        if (questionCount >= 5) {
            setQuizState('completed');
        } else {
            setQuizState('question');
            generateQuestion();
        }
    };

    return (
        <div style={{
            padding: '15px',
            maxHeight: '500px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#262525',
            borderRadius: '8px'
        }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#fefefe' }}>Cybersecurity Training</h2>

            {/* Navigation Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #ddd',
                marginBottom: '15px'
            }}>
                <button
                    onClick={() => setActiveTab('attack')}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: activeTab === 'attack' ? '#f7b613' : 'transparent',
                        color: activeTab === 'attack' ? 'white' : '#fefefe',
                        border: 'none',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'attack' ? 'bold' : 'normal',
                        marginRight: '5px'
                    }}
                >
                    Attack Simulation
                </button>
                <button
                    onClick={() => setActiveTab('quiz')}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: activeTab === 'quiz' ? '#f7b613' : 'transparent',
                        color: activeTab === 'quiz' ? 'white' : '#fefefe',
                        border: 'none',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'quiz' ? 'bold' : 'normal'
                    }}
                >
                    Security Quiz
                </button>
            </div>

            {/* Content Area */}
            <div style={{
                overflowY: 'auto',
                flex: 1,
                padding: '5px'
            }}>
                {/* Attack Simulation */}
                {activeTab === 'attack' && (
                    <div>
                        {gameState === 'intro' && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <h3>Social Engineering Defense Training</h3>
                                <p>This simulation will test your ability to recognize and respond to social engineering attacks.</p>
                                <p>You'll interact with an AI that simulates various social engineering techniques.</p>
                                <p>Your goal: Recognize manipulation tactics and respond appropriately to raise your awareness level to 100%.</p>
                                <button
                                    onClick={startAttackSimulation}
                                    style={{
                                        backgroundColor: '#f0cc1c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    Start Simulation
                                </button>
                            </div>
                        )}

                        {gameState !== 'intro' && (
                            <>
                                {/* Awareness Meter */}
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span>Awareness Level: {awarenessLevel}%</span>
                                        {gameState === 'won' && <span style={{ color: 'green', fontWeight: 'bold' }}>You won!</span>}
                                        {gameState === 'lost' && <span style={{ color: 'red', fontWeight: 'bold' }}>You lost!</span>}
                                    </div>
                                    <div style={{
                                        height: '10px',
                                        width: '100%',
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: '5px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${awarenessLevel}%`,
                                            backgroundColor: awarenessLevel > 70 ? '#4caf50' :
                                                awarenessLevel > 30 ? '#f7b613' : '#f44336',
                                            transition: 'width 0.5s ease-in-out'
                                        }} />
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <div style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    backgroundColor: '#fff',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    border: '1px solid #ddd',
                                    maxHeight: '250px'
                                }}>
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} style={{
                                            marginBottom: '8px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                        }}>
                                            <div style={{
                                                backgroundColor: msg.role === 'user' ? '#5b6368' :
                                                    msg.role === 'attacker' ? '#f7b613' : '#e0e0e0',
                                                color: msg.role === 'user' ? 'white' : 'black',
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

                                {/* Input Area (only show if still playing) */}
                                {gameState === 'playing' && (
                                    <div style={{ display: 'flex' }}>
                                        <input
                                            type="text"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type your response..."
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
                                                backgroundColor: '#f0cc1c',
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
                                )}

                                {/* Reset Button (only show if game ended) */}
                                {(gameState === 'won' || gameState === 'lost') && (
                                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <button
                                            onClick={startAttackSimulation}
                                            style={{
                                                backgroundColor: '#f0cc1c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '8px 15px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Try Another Simulation
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Security Quiz */}
                {activeTab === 'quiz' && (
                    <div>
                        {quizState === 'intro' && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <h3>Cybersecurity Knowledge Quiz</h3>
                                <p>Test your cybersecurity knowledge with this interactive quiz.</p>
                                <p>You'll be presented with 5 multiple-choice questions about various security topics.</p>
                                <button
                                    onClick={startQuiz}
                                    style={{
                                        backgroundColor: '#f0cc1c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    Start Quiz
                                </button>
                            </div>
                        )}

                        {quizState === 'question' && (
                            <div style={{ padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span>Question {questionCount}/5</span>
                                    <span>Score: {quizScore}</span>
                                </div>

                                {isLoading ? (
                                    <div style={{ textAlign: 'center', padding: '30px' }}>
                                        <p>Loading question...</p>
                                    </div>
                                ) : (
                                    <>
                                        <h4 style={{ marginBottom: '15px' }}>{currentQuestion.question}</h4>

                                        <div>
                                            {currentQuestion.options?.map((option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleAnswerSelection(index)}
                                                    style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        padding: '10px 15px',
                                                        margin: '8px 0',
                                                        backgroundColor: '#f0f0f0',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {quizState === 'feedback' && (
                            <div style={{ padding: '20px' }}>
                                <div style={{
                                    backgroundColor: selectedAnswer === currentQuestion.correctIndex ? '#5c6f5c' : '#c95454',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    marginBottom: '20px'
                                }}>
                                    <h4 style={{
                                        color: selectedAnswer === currentQuestion.correctIndex ? '#84ff8a' : '#ff8e8e',
                                        marginTop: 0
                                    }}>
                                        {selectedAnswer === currentQuestion.correctIndex ? 'Correct!' : 'Incorrect!'}
                                    </h4>
                                    <p>{quizFeedback}</p>
                                </div>

                                <button
                                    onClick={handleNextQuestion}
                                    style={{
                                        backgroundColor: '#f0cc1c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                >
                                    {questionCount >= 5 ? 'See Results' : 'Next Question'}
                                </button>
                            </div>
                        )}

                        {quizState === 'completed' && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <h3>Quiz Completed!</h3>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '20px 0',
                                    color: quizScore >= 4 ? '#2e7d32' : quizScore >= 3 ? '#f9a825' : '#c62828'
                                }}>
                                    Your Score: {quizScore}/5
                                </div>

                                <p>
                                    {quizScore >= 4 ? 'Excellent! You have strong cybersecurity knowledge.' :
                                        quizScore >= 3 ? 'Good job! You have decent cybersecurity awareness.' :
                                            'You might benefit from reviewing cybersecurity basics.'}
                                </p>

                                <button
                                    onClick={startQuiz}
                                    style={{
                                        backgroundColor: '#f0cc1c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        marginTop: '15px'
                                    }}
                                >
                                    Take Quiz Again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}