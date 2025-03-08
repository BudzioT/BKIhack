export default function Main() {
    return (
        <div id="main" style={{
            padding: '20px',
            backgroundColor: '#171717',
            borderRadius: '8px',
            maxHeight: '500px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            {/* Logo and Header */}
            <div style={{
                marginBottom: '15px',
                backgroundColor: '#f7b613',
                padding: '15px 25px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '80%'
            }}>
                <h2 style={{
                    margin: '0 0 5px 0',
                    color: '#333',
                    fontSize: '28px'
                }}>VanishHive</h2>
                <p style={{
                    margin: '0',
                    fontStyle: 'italic',
                    fontWeight: '500',
                    color: '#444'
                }}>Swarm the threats, shield your trail: Vanish silently, powered by the hive</p>
            </div>

            {/* Main Content */}
            <div style={{ margin: '15px 0' }}>
                <p style={{ fontSize: '16px', lineHeight: '1.5', margin: '10px 0' }}>
                    VanishHive is your comprehensive cybersecurity companion, available both as a website and browser extension.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '20px 0'
                }}>
                    <div style={{
                        backgroundColor: '#d98505',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 15px',
                        boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
                    }}>
                        <span style={{ fontSize: '24px' }}>🛡️</span>
                    </div>
                    <div style={{
                        backgroundColor: '#ecae54',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 15px',
                        boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
                    }}>
                        <span style={{ fontSize: '24px' }}>🔒</span>
                    </div>
                    <div style={{
                        backgroundColor: '#c6ae1e',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 15px',
                        boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
                    }}>
                        <span style={{ fontSize: '24px' }}>🔍</span>
                    </div>
                </div>

                <p style={{ fontSize: '16px', lineHeight: '1.5', margin: '10px 0' }}>
                    Powered by advanced AI, VanishHive delivers peace of mind while you work online.
                </p>
            </div>

            {/* Call to Action */}
            <div style={{
                backgroundColor: '#eac627',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '10px',
                width: '80%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: 'white', margin: '0', fontWeight: 'bold' }}>
                    Go to the 'All' page to explore available tools or select one from the navbar!
                </p>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '20px' }}>
                <p style={{
                    fontStyle: 'italic',
                    color: '#666',
                    fontSize: '14px'
                }}>Brought with love by VanishHive devs</p>
            </div>
        </div>
    );
}