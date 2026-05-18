import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Code2, Key, Terminal, RefreshCw, Play, Check } from 'lucide-react';

export default function APIDocs() {
  const { addToast } = useContext(AppContext);
  const [apiKey, setApiKey] = useState('rp_live_4f923b7e8d1a6c029f5d3e7b');
  const [keyHidden, setKeyHidden] = useState(true);

  // Mock Request Tester states
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET_LOCATIONS');
  const [requestBody, setRequestBody] = useState(
    JSON.stringify({ locationId: "loc-1", rating: 5, comment: "Amazing!" }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleGenerateKey = () => {
    const chars = '0123456789abcdef';
    let newKey = 'rp_live_';
    for (let i = 0; i < 24; i++) {
      newKey += chars[Math.floor(Math.random() * 16)];
    }
    setApiKey(newKey);
    addToast('New developer API Key generated!', 'success');
  };

  const handleEndpointChange = (endpoint) => {
    setSelectedEndpoint(endpoint);
    if (endpoint === 'GET_LOCATIONS') {
      setRequestBody('// Query Parameters\n?limit=10&status=CONNECTED');
    } else if (endpoint === 'GET_REVIEWS') {
      setRequestBody('// Query Parameters\n?locationId=loc-1&rating=5');
    } else {
      setRequestBody(JSON.stringify({
        reviewId: "rev-2",
        replyText: "Dear Sarah, we sincerely apologize for the torn sleeve dress. We want to issue a full replacement immediately...",
        tone: "premium"
      }, null, 2));
    }
  };

  const handleRunTest = () => {
    setIsRunning(true);
    setApiResponse('Sending request to server...');
    
    setTimeout(() => {
      let responseObj = {};
      if (selectedEndpoint === 'GET_LOCATIONS') {
        responseObj = {
          success: true,
          count: 4,
          data: [
            { id: "loc-1", name: "Main Street Cafe", address: "124 Main St, Austin, TX", rating: 4.6 },
            { id: "loc-2", name: "Broadway Boutique", address: "1542 Broadway, New York, NY", rating: 4.8 }
          ]
        };
      } else if (selectedEndpoint === 'GET_REVIEWS') {
        responseObj = {
          success: true,
          count: 1,
          data: [
            { id: "rev-1", author: "Alexander Wright", rating: 5, comment: "Absolutely love the ambiance!" }
          ]
        };
      } else {
        responseObj = {
          success: true,
          status: "published",
          replyId: "rep-98a21b",
          postedAt: new Date().toISOString(),
          googleResponse: {
            code: 200,
            status: "OK",
            details: "Reply successfully pushed to GMB API."
          }
        };
      }
      setApiResponse(JSON.stringify(responseObj, null, 2));
      setIsRunning(false);
      addToast('Mock API request completed successfully.', 'success');
    }, 1000);
  };

  return (
    <div className="api-docs-page animate-fade-in">
      <Header title="Developer API Console" />

      <div className="api-docs-grid">
        
        {/* API Credentials */}
        <div className="api-main-card glass-panel col-span-2">
          <div className="card-top-header">
            <Key className="glow-brand-icon" size={22} />
            <div>
              <h3>Workspace Authorization Credentials</h3>
              <p>Configure secure Bearer tokens to build custom integrations with CRM systems</p>
            </div>
          </div>

          <div className="card-body-form">
            <div className="api-key-generation-row">
              <div className="key-input-wrapper">
                <input 
                  type={keyHidden ? 'password' : 'text'} 
                  value={apiKey} 
                  readOnly 
                  className="api-key-textbox"
                />
                <button 
                  type="button" 
                  className="hide-reveal-key-btn"
                  onClick={() => setKeyHidden(!keyHidden)}
                >
                  {keyHidden ? 'Reveal Key' : 'Hide Key'}
                </button>
              </div>

              <button className="generate-new-key-btn" onClick={handleGenerateKey}>
                <RefreshCw size={14} />
                <span>Regenerate API Key</span>
              </button>
            </div>
          </div>
        </div>

        {/* API Endpoint Documentation & Interactive Request Console */}
        <div className="api-tester-card glass-panel">
          <div className="card-top-header">
            <Terminal className="glow-brand-icon" size={22} />
            <h3>Endpoint Request Tester</h3>
          </div>

          <div className="card-body-form">
            {/* Endpoint select dropdown */}
            <div className="form-control-item">
              <label>Choose API Endpoint:</label>
              <div className="endpoint-selector-pills">
                <button 
                  className={`endpoint-pill get ${selectedEndpoint === 'GET_LOCATIONS' ? 'active' : ''}`}
                  onClick={() => handleEndpointChange('GET_LOCATIONS')}
                >
                  <span>GET</span> /v1/locations
                </button>
                <button 
                  className={`endpoint-pill get ${selectedEndpoint === 'GET_REVIEWS' ? 'active' : ''}`}
                  onClick={() => handleEndpointChange('GET_REVIEWS')}
                >
                  <span>GET</span> /v1/reviews
                </button>
                <button 
                  className={`endpoint-pill post ${selectedEndpoint === 'POST_REPLY' ? 'active' : ''}`}
                  onClick={() => handleEndpointChange('POST_REPLY')}
                >
                  <span>POST</span> /v1/reviews/reply
                </button>
              </div>
            </div>

            {/* Request editor */}
            <div className="form-control-item">
              <label>{selectedEndpoint === 'POST_REPLY' ? 'Request JSON Body payload:' : 'Query Parameters Console:'}</label>
              <textarea 
                className="api-json-textarea"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
              />
            </div>

            <button 
              className={`run-api-test-btn ${isRunning ? 'running' : ''}`}
              onClick={handleRunTest}
              disabled={isRunning}
            >
              <Play size={14} />
              <span>{isRunning ? 'Running test...' : 'Send API Request'}</span>
            </button>
          </div>
        </div>

        {/* API Console Response Log Terminal */}
        <div className="api-response-card glass-panel">
          <div className="card-top-header">
            <Code2 className="glow-brand-icon" size={22} />
            <h3>Console Response Payload</h3>
          </div>
          <div className="api-terminal-body">
            {apiResponse ? (
              <pre className="terminal-pre-code"><code>{apiResponse}</code></pre>
            ) : (
              <div className="terminal-empty-state">
                <span>Waiting for request trigger...</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
