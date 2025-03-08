// Create this file: extension/components/networkTraffic/NetworkTrafficVisualizer.js
import { useState, useEffect, useRef } from 'react';

export default function NetworkTrafficVisualizer() {
    const [connections, setConnections] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        domains: new Set(),
        byType: {},
        potentialIssues: 0
    });
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const nodes = useRef([]);
    const newConnections = useRef([]);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [lastOffsetX, setLastOffsetX] = useState(0);
    const [lastOffsetY, setLastOffsetY] = useState(0);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setDragStartX(e.clientX - offsetX);
            setDragStartY(e.clientY - offsetY);
            canvas.style.cursor = 'grabbing';
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setLastOffsetX(offsetX);
            setLastOffsetY(offsetY);
            canvas.style.cursor = 'grab';
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const newOffsetX = e.clientX - dragStartX;
            const newOffsetY = e.clientY - dragStartY;
            setOffsetX(newOffsetX);
            setOffsetY(newOffsetY);
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);

        // Set initial cursor style
        canvas.style.cursor = 'grab';

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, dragStartX, dragStartY, offsetX, offsetY]);

    // Mock connections for demonstration (in a real extension, this would use chrome.webRequest API)
    useEffect(() => {
        if (isMonitoring) {
            const mockTrafficInterval = setInterval(() => {
                const types = ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'websocket'];
                const methods = ['GET', 'POST'];
                const domains = [
                    'example.com', 'cdn.example.com', 'api.example.com',
                    'analytics.tracking.com', 'ads.tracker.net', 'google.com',
                    'facebook.com', 'amazonaws.com', 'github.com', 'unknown-tracker.net'
                ];

                const newConnection = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    url: `https://${domains[Math.floor(Math.random() * domains.length)]}/path/resource${Math.floor(Math.random() * 100)}`,
                    type: types[Math.floor(Math.random() * types.length)],
                    method: methods[Math.floor(Math.random() * methods.length)],
                    timestamp: Date.now(),
                    size: Math.floor(Math.random() * 500000),
                    status: Math.random() > 0.9 ? 404 : 200,
                    initiator: 'https://example.com',
                    isSuspicious: Math.random() > 0.8
                };

                newConnections.current.push(newConnection);

                setConnections(prev => {
                    const updated = [newConnection, ...prev].slice(0, 100);

                    // Update stats
                    const updatedStats = {
                        total: prev.length + 1,
                        domains: new Set([...Array.from(stats.domains), new URL(newConnection.url).hostname]),
                        byType: {...stats.byType},
                        potentialIssues: stats.potentialIssues + (newConnection.isSuspicious ? 1 : 0)
                    };

                    if (!updatedStats.byType[newConnection.type]) {
                        updatedStats.byType[newConnection.type] = 0;
                    }
                    updatedStats.byType[newConnection.type]++;

                    setStats(updatedStats);
                    return updated;
                });
            }, 1000);

            return () => clearInterval(mockTrafficInterval);
        }
    }, [isMonitoring, stats]);

    // Canvas visualization
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Initialize nodessssss
        if (nodes.current.length === 0) {
            // Central node (user)
            nodes.current.push({
                x: centerX,
                y: centerY,
                radius: 20,
                color: '#d98505',
                label: 'YOU',
                type: 'user'
            });

            // Create some initial domain nodes
            const domains = ['example.com', 'cdn.example.com', 'api.analytics.com'];
            domains.forEach((domain, i) => {
                const angle = (i * (2 * Math.PI / domains.length));
                nodes.current.push({
                    x: centerX + Math.cos(angle) * 150,
                    y: centerY + Math.sin(angle) * 150,
                    radius: 15,
                    color: '#2c7fb8',
                    label: domain,
                    type: 'domain',
                    connections: 0
                });
            });
        }

        // Animationeeee
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(offsetX, offsetY);

            const adjustedCenterX = centerX - offsetX;
            const adjustedCenterY = centerY - offsetY;

            // Draw da connections!
            for (const node of nodes.current) {
                if (node.type === 'domain') {
                    ctx.beginPath();
                    ctx.strokeStyle = node.isSuspicious ? 'rgba(255, 0, 0, 0.5)' : 'rgba(150, 150, 150, 0.3)';
                    ctx.lineWidth = Math.log(node.connections + 1) + 1;
                    ctx.moveTo(adjustedCenterX, adjustedCenterY);  // Use adjusted center
                    ctx.lineTo(node.x, node.y);
                    ctx.stroke();
                }
            }

            // Draw nodes
            for (const node of nodes.current) {
                ctx.beginPath();
                ctx.fillStyle = node.color;
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();

                // Draw node label
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + node.radius + 12);

                // For domains, show connection count
                if (node.type === 'domain' && node.connections > 0) {
                    ctx.fillStyle = '#fff';
                    ctx.fillText(node.connections, node.x, node.y + 4);
                }
            }

            // Process new connections
            if (newConnections.current.length > 0) {
                const connection = newConnections.current.shift();
                const domain = new URL(connection.url).hostname;

                // Find if we already have this domain
                let domainNode = nodes.current.find(n => n.type === 'domain' && n.label === domain);

                // If not, create a new domain node
                if (!domainNode) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 120 + Math.random() * 80;
                    domainNode = {
                        x: adjustedCenterX + Math.cos(angle) * distance,  // Use adjusted center
                        y: adjustedCenterY + Math.sin(angle) * distance,  // Use adjusted center
                        radius: 12,
                        color: connection.isSuspicious ? '#d32f2f' : '#2c7fb8',
                        label: domain,
                        type: 'domain',
                        connections: 0,
                        isSuspicious: connection.isSuspicious
                    };
                    nodes.current.push(domainNode);
                }

                domainNode.connections++;

                const packet = {
                    x: adjustedCenterX,
                    y: adjustedCenterY,
                    targetX: domainNode.x,
                    targetY: domainNode.y,
                    progress: 0,
                    color: connection.method === 'POST' ? '#ff9800' : '#4caf50'
                };

                const animatePacket = () => {
                    packet.progress += 0.05;
                    if (packet.progress >= 1) return;

                    const x = adjustedCenterX + (packet.targetX - adjustedCenterX) * packet.progress;
                    const y = adjustedCenterY + (packet.targetY - adjustedCenterY) * packet.progress;

                    ctx.beginPath();
                    ctx.fillStyle = packet.color;
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fill();

                    requestAnimationFrame(animatePacket);
                };

                animatePacket();
            }

            ctx.restore();

            animationFrameId.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [offsetX, offsetY]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    // Handle canvas resize
    useEffect(() => {
        if (!canvasRef.current) return;

        const handleResize = () => {
            const container = canvasRef.current.parentElement;
            canvasRef.current.width = container.clientWidth;
            canvasRef.current.height = 400;
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Format file size
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get filtered connections
    const getFilteredConnections = () => {
        if (filterType === 'all') return connections;
        if (filterType === 'suspicious') return connections.filter(conn => conn.isSuspicious);
        return connections.filter(conn => conn.type === filterType);
    };

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#d98505', margin: 0 }}>Network Traffic Visualizer</h2>
                <button
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: isMonitoring ? '#f44336' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </button>
            </div>

            <div style={{
                backgroundColor: 'black',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                }}>
                    <div style={{
                        backgroundColor: '#222',
                        padding: '10px',
                        borderRadius: '4px',
                        width: '23%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d98505' }}>
                            {stats.total}
                        </div>
                        <div style={{ fontSize: '14px' }}>Total Requests</div>
                    </div>
                    <div style={{
                        backgroundColor: '#222',
                        padding: '10px',
                        borderRadius: '4px',
                        width: '23%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d98505' }}>
                            {stats.domains.size}
                        </div>
                        <div style={{ fontSize: '14px' }}>Unique Domains</div>
                    </div>
                    <div style={{
                        backgroundColor: '#222',
                        padding: '10px',
                        borderRadius: '4px',
                        width: '23%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d98505' }}>
                            {Object.keys(stats.byType).length}
                        </div>
                        <div style={{ fontSize: '14px' }}>Request Types</div>
                    </div>
                    <div style={{
                        backgroundColor: '#222',
                        padding: '10px',
                        borderRadius: '4px',
                        width: '23%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: stats.potentialIssues > 0 ? '#f44336' : '#4caf50' }}>
                            {stats.potentialIssues}
                        </div>
                        <div style={{ fontSize: '14px' }}>Potential Issues</div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#222',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '15px',
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    <canvas
                        ref={canvasRef}
                        style={{ width: '100%', height: '400px' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: '6px 10px',
                            backgroundColor: '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="all">All Requests</option>
                        <option value="suspicious">Suspicious Only</option>
                        <option value="script">Scripts</option>
                        <option value="image">Images</option>
                        <option value="xmlhttprequest">XHR/Fetch</option>
                        <option value="stylesheet">Stylesheets</option>
                    </select>
                </div>
            </div>

            <div style={{
                backgroundColor: 'black',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                <h3 style={{ color: '#d98505', margin: '0 0 15px 0' }}>Request Log</h3>
                {getFilteredConnections().length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        {isMonitoring
                            ? 'Waiting for network activity...'
                            : 'Click "Start Monitoring" to begin capturing network traffic.'}
                    </div>
                ) : (
                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        backgroundColor: '#222',
                        borderRadius: '4px',
                        padding: '5px'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#333' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>URL</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Type</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Method</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Size</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {getFilteredConnections().map((conn) => (
                                <tr
                                    key={conn.id}
                                    style={{
                                        backgroundColor: conn.isSuspicious ? 'rgba(244, 67, 54, 0.2)' : 'transparent',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #333'
                                    }}
                                    onClick={() => setSelectedConnection(conn)}
                                >
                                    <td style={{ padding: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                                        {conn.isSuspicious && <span style={{ color: '#f44336', marginRight: '5px' }}>⚠️</span>}
                                        {new URL(conn.url).hostname}
                                    </td>
                                    <td style={{ padding: '8px' }}>{conn.type}</td>
                                    <td style={{ padding: '8px', color: conn.method === 'POST' ? '#ff9800' : 'inherit' }}>{conn.method}</td>
                                    <td style={{ padding: '8px' }}>{formatBytes(conn.size)}</td>
                                    <td style={{
                                        padding: '8px',
                                        color: conn.status >= 400 ? '#f44336' : conn.status >= 300 ? '#ff9800' : '#4caf50'
                                    }}>
                                        {conn.status}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedConnection && (
                <div style={{
                    backgroundColor: 'black',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: '#d98505', margin: 0 }}>Request Details</h3>
                        <button
                            onClick={() => setSelectedConnection(null)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}
                        >×</button>
                    </div>

                    <div style={{ backgroundColor: '#222', borderRadius: '4px', padding: '15px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: selectedConnection.isSuspicious ? 'rgba(244, 67, 54, 0.2)' : '#333',
                            borderRadius: '4px'
                        }}>
                            <div style={{ fontWeight: 'bold' }}>Safety Status:</div>
                            <div style={{ color: selectedConnection.isSuspicious ? '#f44336' : '#4caf50' }}>
                                {selectedConnection.isSuspicious ? '⚠️ Potentially Suspicious' : '✓ Appears Safe'}
                            </div>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Full URL:</div>
                            <div style={{
                                padding: '8px',
                                backgroundColor: '#333',
                                borderRadius: '4px',
                                wordBreak: 'break-all'
                            }}>
                                {selectedConnection.url}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Request Type:</div>
                                <div style={{ padding: '8px', backgroundColor: '#333', borderRadius: '4px' }}>
                                    {selectedConnection.type}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Method:</div>
                                <div style={{
                                    padding: '8px',
                                    backgroundColor: '#333',
                                    borderRadius: '4px',
                                    color: selectedConnection.method === 'POST' ? '#ff9800' : 'inherit'
                                }}>
                                    {selectedConnection.method}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Size:</div>
                                <div style={{ padding: '8px', backgroundColor: '#333', borderRadius: '4px' }}>
                                    {formatBytes(selectedConnection.size)}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Status:</div>
                                <div style={{
                                    padding: '8px',
                                    backgroundColor: '#333',
                                    borderRadius: '4px',
                                    color: selectedConnection.status >= 400 ? '#f44336' :
                                        selectedConnection.status >= 300 ? '#ff9800' : '#4caf50'
                                }}>
                                    {selectedConnection.status}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Timestamp:</div>
                                <div style={{ padding: '8px', backgroundColor: '#333', borderRadius: '4px' }}>
                                    {new Date(selectedConnection.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Initiator:</div>
                                <div style={{
                                    padding: '8px',
                                    backgroundColor: '#333',
                                    borderRadius: '4px',
                                    wordBreak: 'break-all'
                                }}>
                                    {selectedConnection.initiator}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}