import React, { useState, useEffect } from 'react';

export default function VirusCheck() {
    const [apiKey, setApiKey] = useState('');
    const [url, setUrl] = useState('');
    const [scanResults, setScanResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [scanType, setScanType] = useState('url'); // 'url' or 'file'
    const [savedApiKey, setSavedApiKey] = useState('');
    const [scanHistory, setScanHistory] = useState([]);

    // Load saved API key on component mount
    useEffect(() => {
        const savedKey = localStorage.getItem('virusTotalApiKey');
        if (savedKey) {
            setSavedApiKey(savedKey);
            setApiKey(savedKey);
        }

        const history = localStorage.getItem('scanHistory');
        if (history) {
            setScanHistory(JSON.parse(history));
        }
    }, []);

    // Save API key
    const saveApiKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('virusTotalApiKey', apiKey);
            setSavedApiKey(apiKey);
            setError('');
        } else {
            setError('Please enter a valid API key');
        }
    };

    // Clear API key
    const clearApiKey = () => {
        localStorage.removeItem('virusTotalApiKey');
        setSavedApiKey('');
        setApiKey('');
    };

    // Scan URL with VirusTotal API
    const scanUrl = async () => {
        if (!savedApiKey) {
            setError('Please save your VirusTotal API key first');
            return;
        }

        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        setIsLoading(true);
        setError('');
        setScanResults(null);

        try {
            // Step 1: Submit URL for scanning
            const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
                method: 'POST',
                headers: {
                    'x-apikey': savedApiKey,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `url=${encodeURIComponent(url)}`,
            });

            if (!submitResponse.ok) {
                throw new Error('Failed to submit URL for scanning');
            }

            const submitData = await submitResponse.json();
            const analysisId = submitData.data.id;

            // Step 2: Get scan results (with delay to allow scanning)
            setTimeout(async () => {
                try {
                    const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                        headers: {
                            'x-apikey': savedApiKey,
                        },
                    });

                    if (!analysisResponse.ok) {
                        throw new Error('Failed to retrieve scan results');
                    }

                    const analysisData = await analysisResponse.json();
                    setScanResults(analysisData);

                    // Add to scan history
                    const newHistoryItem = {
                        type: 'url',
                        content: url,
                        date: new Date().toLocaleString(),
                        result: analysisData.data.attributes.stats
                    };

                    const updatedHistory = [newHistoryItem, ...scanHistory].slice(0, 10);
                    setScanHistory(updatedHistory);
                    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));

                    setIsLoading(false);
                } catch (err) {
                    setError('Error retrieving scan results: ' + err.message);
                    setIsLoading(false);
                }
            }, 5000); // 5 second delay to allow scanning
        } catch (err) {
            setError('Error scanning URL: ' + err.message);
            setIsLoading(false);
        }
    };

    // Handle file scanning
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!savedApiKey) {
            setError('Please save your VirusTotal API key first');
            return;
        }

        setIsLoading(true);
        setError('');
        setScanResults(null);

        try {
            // Step 1: Get upload URL
            const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
                headers: {
                    'x-apikey': savedApiKey,
                },
            });

            if (!urlResponse.ok) {
                throw new Error('Failed to get upload URL');
            }

            const urlData = await urlResponse.json();
            const uploadUrl = urlData.data;

            // Step 2: Upload file
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'x-apikey': savedApiKey,
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file');
            }

            const uploadData = await uploadResponse.json();
            const analysisId = uploadData.data.id;

            // Step 3: Get scan results (with delay to allow scanning)
            setTimeout(async () => {
                try {
                    const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                        headers: {
                            'x-apikey': savedApiKey,
                        },
                    });

                    if (!analysisResponse.ok) {
                        throw new Error('Failed to retrieve scan results');
                    }

                    const analysisData = await analysisResponse.json();
                    setScanResults(analysisData);

                    // Add to scan history
                    const newHistoryItem = {
                        type: 'file',
                        content: file.name,
                        date: new Date().toLocaleString(),
                        result: analysisData.data.attributes.stats
                    };

                    const updatedHistory = [newHistoryItem, ...scanHistory].slice(0, 10);
                    setScanHistory(updatedHistory);
                    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));

                    setIsLoading(false);
                } catch (err) {
                    setError('Error retrieving scan results: ' + err.message);
                    setIsLoading(false);
                }
            }, 10000); // 10 second delay to allow scanning
        } catch (err) {
            setError('Error scanning file: ' + err.message);
            setIsLoading(false);
        }
    };

    // Handle the file input click specifically for Firefox extension
    const handleFileInputClick = (e) => {
        // Prevent default to stop immediate window loss of focus
        e.preventDefault();

        // Create a temporary file input outside the extension popup
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // Listen for file selection
        fileInput.addEventListener('change', (event) => {
            handleFileUpload(event);
            // Clean up
            document.body.removeChild(fileInput);
        });

        // Listen for cancel
        fileInput.addEventListener('cancel', () => {
            document.body.removeChild(fileInput);
        });

        // Open file dialog
        fileInput.click();
    };

    // Clear scan history
    const clearHistory = () => {
        setScanHistory([]);
        localStorage.removeItem('scanHistory');
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{
                color: 'white',
                textAlign: 'center',
                margin: '0 0 20px 0'
            }}>
                <span style={{ fontSize: '24px' }}>🔍</span> Virus Checker
            </h2>

            {/* API Key Section */}
            <div style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#d98505' }}>VirusTotal API Key</h3>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your VirusTotal API key"
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                    />
                    <button
                        onClick={saveApiKey}
                        style={{
                            marginLeft: '10px',
                            padding: '8px 12px',
                            backgroundColor: '#d98505',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Save Key
                    </button>
                </div>

                {savedApiKey && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'green', marginRight: '10px' }}>✓ API Key saved</span>
                        <button
                            onClick={clearApiKey}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#fb857f',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Clear
                        </button>
                    </div>
                )}

                <p style={{ fontSize: '12px', color: '#666', margin: '10px 0 0 0' }}>
                    <a href="https://www.virustotal.com/gui/join-us" target="_blank" rel="noopener noreferrer"
                       style={{ color: '#d98505' }}>
                        Get a free VirusTotal API key
                    </a>
                </p>
            </div>

            {/* Scan Type Toggle */}
            <div style={{
                display: 'flex',
                marginBottom: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <button
                    onClick={() => setScanType('url')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: 'none',
                        backgroundColor: scanType === 'url' ? '#d98505' : '#f5f5f5',
                        color: scanType === 'url' ? 'black' : 'gray',
                        cursor: 'pointer',
                        fontWeight: scanType === 'url' ? 'bold' : 'normal'
                    }}
                >
                    URL Check
                </button>
                <button
                    onClick={() => setScanType('file')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: 'none',
                        backgroundColor: scanType === 'file' ? '#d98505' : '#f5f5f5',
                        color: scanType === 'file' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontWeight: scanType === 'file' ? 'bold' : 'normal'
                    }}
                >
                    File Check
                </button>
            </div>

            {/* Scan Input */}
            <div style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#d98505' }}>
                    {scanType === 'url' ? 'Check Website URL' : 'Check File'}
                </h3>

                {scanType === 'url' ? (
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter website URL (e.g., https://example.com)"
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <button
                            onClick={scanUrl}
                            disabled={isLoading || !savedApiKey}
                            style={{
                                marginLeft: '10px',
                                padding: '8px 12px',
                                backgroundColor: isLoading || !savedApiKey ? '#ccc' : '#c6ae1e',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading || !savedApiKey ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Scanning...' : 'Scan URL'}
                        </button>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={handleFileInputClick}
                            disabled={isLoading || !savedApiKey}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: isLoading || !savedApiKey ? '#ccc' : '#c6ae1e',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading || !savedApiKey ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ marginRight: '5px' }}>📄</span>
                            {isLoading ? 'Scanning...' : 'Select File to Scan'}
                        </button>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                            Note: For Firefox extensions, the file dialog may appear behind the extension popup.
                        </p>
                    </div>
                )}

                {error && (
                    <p style={{
                        color: '#f44336',
                        margin: '10px 0 0 0',
                        padding: '8px',
                        backgroundColor: '#ffebee',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </p>
                )}
            </div>

            {/* Scan Results */}
            {isLoading && (
                <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: 'black',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⌛</div>
                    <p>Scanning in progress. This may take a few moments...</p>
                </div>
            )}

            {scanResults && (
                <div style={{
                    backgroundColor: 'black',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#d98505' }}>Scan Results</h3>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px',
                        backgroundColor: '#fff',
                        color: "black",
                        padding: '10px',
                        borderRadius: '4px'
                    }}>
                        <div>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                                {scanType === 'url' ? 'URL:' : 'File:'}
                            </p>
                            <p style={{ margin: '0', wordBreak: 'break-all' }}>
                                {scanType === 'url' ? url : scanResults.meta?.file_info?.name || 'Unknown file'}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Scan Date:</p>
                            <p style={{ margin: '0' }}>
                                {new Date(scanResults.data?.attributes?.date * 1000).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#fff',
                        color: "black",
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>Detection Summary:</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{
                                flex: 1,
                                backgroundColor: '#e8f5e9',
                                padding: '10px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                margin: '0 5px'
                            }}>
                                <p style={{ margin: '0', color: 'green', fontWeight: 'bold' }}>
                                    {scanResults.data?.attributes?.stats?.harmless || 0}
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Harmless</p>
                            </div>
                            <div style={{
                                flex: 1,
                                backgroundColor: '#fff3e0',
                                padding: '10px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                margin: '0 5px'
                            }}>
                                <p style={{ margin: '0', color: '#ff9800', fontWeight: 'bold' }}>
                                    {scanResults.data?.attributes?.stats?.suspicious || 0}
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Suspicious</p>
                            </div>
                            <div style={{
                                flex: 1,
                                backgroundColor: '#ffebee',
                                padding: '10px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                margin: '0 5px'
                            }}>
                                <p style={{ margin: '0', color: '#f44336', fontWeight: 'bold' }}>
                                    {scanResults.data?.attributes?.stats?.malicious || 0}
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Malicious</p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        backgroundColor: scanResults.data?.attributes?.stats?.malicious > 0 ? '#ffebee' :
                            scanResults.data?.attributes?.stats?.suspicious > 0 ? '#fff3e0' : '#e8f5e9',
                        padding: '10px',
                        color: "black",
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        {scanResults.data?.attributes?.stats?.malicious > 0 ?
                            '❌ This might be dangerous! Use caution.' :
                            scanResults.data?.attributes?.stats?.suspicious > 0 ?
                                '⚠️ This looks suspicious. Proceed with caution.' :
                                '✅ This appears to be safe.'}
                    </div>
                </div>
            )}

            <div style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                color: "black",
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <h3 style={{ margin: '0', color: '#d98505' }}>Recent Scans</h3>
                    {scanHistory.length > 0 && (
                        <button
                            onClick={clearHistory}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#f44336',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Clear History
                        </button>
                    )}
                </div>

                {scanHistory.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>No scan history yet</p>
                ) : (
                    <ul style={{
                        listStyleType: 'none',
                        padding: '0',
                        margin: '0',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {scanHistory.map((item, index) => (
                            <li key={index} style={{
                                backgroundColor: '#fff',
                                padding: '10px',
                                borderRadius: '4px',
                                marginBottom: '8px',
                                fontSize: '14px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        {item.type === 'url' ? '🌐' : '📄'} {item.content}
                                    </span>
                                    <span style={{
                                        color: item.result?.malicious > 0 ? '#f44336' :
                                            item.result?.suspicious > 0 ? '#ff9800' : '#4caf50',
                                        fontWeight: 'bold'
                                    }}>
                                        {item.result?.malicious > 0 ? 'Malicious' :
                                            item.result?.suspicious > 0 ? 'Suspicious' : 'Safe'}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginTop: '5px'
                                }}>
                                    {item.date}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}