export default function Features() {
    return (
        <div id="features" style={{
            padding: '20px',
            backgroundColor: '#171717',
            borderRadius: '8px',
            maxHeight: '500px',
            overflow: 'auto'
        }}>
            <h2 style={{
                margin: '0 0 20px 0',
                color: '#333',
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#f7b613',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>All Features</h2>

            <div className="feature" style={{
                backgroundColor: '#d98505',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '20px' }}>📧</span>
                </div>
                <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>Email scam detector</h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>Detects scams in emails thanks to this tool. It's powered by AI to bring peace to your work</p>
                </div>
            </div>

            <div className="feature" style={{
                backgroundColor: '#ecae54',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '20px' }}>🖼️</span>
                </div>
                <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>Images metadata detector, remover</h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>View what metadata your image has, and get a safe image without all of it</p>
                </div>
            </div>

            <div className="feature" style={{
                backgroundColor: '#c6ae1e',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '20px' }}>🕒</span>
                </div>
                <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>Emails</h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>VanishHive allows you to send emails that disappear after a certain amount of time.</p>
                </div>
            </div>

            <div className="feature" style={{
                backgroundColor: '#4caf50',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '20px' }}>🤖</span>
                </div>
                <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>AI Support</h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>Consult security concerns with AI, learn new ways to stay safe</p>
                </div>
            </div>

            <div className="feature" style={{
                backgroundColor: '#c08f39',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '20px' }}>💬</span>
                </div>
                <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>AI Chat</h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>Simulate a chat with hacker to raise awareness</p>
                </div>
            </div>
        </div>
    );
}