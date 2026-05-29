import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { 
  Star, 
  Search, 
  SlidersHorizontal, 
  Bot, 
  Send, 
  Trash2, 
  Check, 
  Mail, 
  UserPlus, 
  FileText, 
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Flag,
  ArrowRight,
  TrendingDown,
  UserCheck,
  RefreshCw
} from 'lucide-react';

export default function ReviewsInbox() {
  const { 
    reviews, 
    locations, 
    activeLocationId, 
    setActiveLocationId, 
    searchQuery, 
    setSearchQuery,
    selectedRating, 
    setSelectedRating,
    selectedSentiment, 
    setSelectedSentiment,
    selectedReview, 
    setSelectedReview,
    autoGenerateReplyText,
    postReply,
    rejectReply,
    approveReply,
    escalateReview,
    addInternalNote,
    assignTeamMember,
    toggleStarred,
    team,
    // Google GMB OAuth integration state
    integrations,
    googleAccounts,
    googleLocations,
    googleSelectedAccount,
    fetchGmbLocations,
    syncSelectedGbpLocations,
    // Facebook OAuth integration state
    facebookPages,
    syncSelectedFacebookPages
  } = useContext(AppContext);

  // Draft overrides states
  const [draftText, setDraftText] = useState('');
  const [activeTone, setActiveTone] = useState('friendly');
  const [useEmojis, setUseEmojis] = useState(true);
  const [replyLength, setReplyLength] = useState('medium');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateNote, setEscalateNote] = useState('');

  // GMB state hooks for inbox sync
  const [selectedGbpLocations, setSelectedGbpLocations] = useState([]);
  const [isGmbSyncing, setIsGmbSyncing] = useState(false);

  // Facebook state hooks for inbox sync
  const [selectedFbPages, setSelectedFbPages] = useState([]);
  const [isFbSyncing, setIsFbSyncing] = useState(false);

  const isGoogleConnected = integrations.find(i => i.id === 'google')?.status === 'CONNECTED';
  const isFacebookConnected = integrations.find(i => i.id === 'facebook')?.status === 'CONNECTED';

  // Automatically check the first location if locations are loaded
  React.useEffect(() => {
    if (googleLocations.length > 0 && selectedGbpLocations.length === 0) {
      const mainLoc = googleLocations.find(l => l.title === "VenPep Solutions Private Limited" || l.name.includes("12239355840863335762"));
      if (mainLoc) {
        setSelectedGbpLocations([mainLoc.name]);
      } else {
        setSelectedGbpLocations([googleLocations[0]?.name]);
      }
    }
  }, [googleLocations]);

  React.useEffect(() => {
    if (facebookPages && facebookPages.length > 0 && selectedFbPages.length === 0) {
      setSelectedFbPages([facebookPages[0]?.id]);
    }
  }, [facebookPages]);

  const handleGmbAccountChange = async (accountId) => {
    if (!accountId) return;
    await fetchGmbLocations(accountId);
  };

  const handleToggleGbpLocation = (id) => {
    if (selectedGbpLocations.includes(id)) {
      setSelectedGbpLocations(selectedGbpLocations.filter(loc => loc !== id));
    } else {
      setSelectedGbpLocations([...selectedGbpLocations, id]);
    }
  };

  const handleGmbSyncClick = async () => {
    setIsGmbSyncing(true);
    await syncSelectedGbpLocations(selectedGbpLocations);
    setIsGmbSyncing(false);
  };

  const handleToggleFbPage = (id) => {
    if (selectedFbPages.includes(id)) {
      setSelectedFbPages(selectedFbPages.filter(p => p !== id));
    } else {
      setSelectedFbPages([...selectedFbPages, id]);
    }
  };

  const handleFbSyncClick = async () => {
    setIsFbSyncing(true);
    await syncSelectedFacebookPages(selectedFbPages);
    setIsFbSyncing(false);
  };

  // Handle setting a selected review and copying its active reply to the draft editor
  const handleSelectReview = (rev) => {
    setSelectedReview(rev);
    setDraftText(rev.reply || '');
    setActiveTone(rev.replyTone || 'friendly');
    setInternalNoteText(rev.internalNotes || '');
  };

  // Sync draft field if review status changes
  React.useEffect(() => {
    if (selectedReview) {
      setDraftText(selectedReview.reply || '');
      setInternalNoteText(selectedReview.internalNotes || '');
    }
  }, [selectedReview]);

  // Filter reviews based on search & sidebar parameters
  const filteredReviews = reviews.filter(rev => {
    // Location Filter
    if (activeLocationId !== 'all' && rev.locationId !== activeLocationId) return false;
    
    // Rating Filter
    if (selectedRating !== 'all' && rev.rating !== parseInt(selectedRating)) return false;

    // Sentiment Filter
    if (selectedSentiment !== 'all' && rev.sentiment.toLowerCase() !== selectedSentiment.toLowerCase()) return false;

    // Search Query (Text or Author)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAuthor = rev.authorName.toLowerCase().includes(q);
      const matchComment = rev.comment.toLowerCase().includes(q);
      return matchAuthor || matchComment;
    }

    return true;
  });

  return (
    <div className="inbox-page animate-fade-in">
      <Header title="Reviews Inbox" />

      <div className="inbox-workspace-grid">
        {/* LEFT COLUMN: Sidebar Filters & Review Feed list */}
        <div className="inbox-left-sidebar glass-panel">

          {/* GOOGLE BUSINESS PROFILE SYNC CONSOLE */}
          {isGoogleConnected && (
            <div className="sidebar-gmb-control-card">
              <div className="sidebar-gmb-header">
                <span className="gmb-g-icon-small">G</span>
                <h3>Google My Business</h3>
              </div>
              
              <div className="sidebar-gmb-select-row">
                <label>GMB Account:</label>
                <select 
                  value={googleSelectedAccount} 
                  onChange={(e) => handleGmbAccountChange(e.target.value)}
                  className="sidebar-gmb-dropdown"
                >
                  <option value="">-- Choose Account --</option>
                  {googleAccounts.map(acc => (
                    <option key={acc.name} value={acc.name}>
                      {acc.accountName}
                    </option>
                  ))}
                </select>
              </div>

              {googleSelectedAccount && (
                <div className="sidebar-gmb-sync-panel animate-fade-in">
                  <label className="sidebar-gmb-sublabel">Select Stores to Sync:</label>
                  
                  {googleLocations.length > 0 ? (
                    <div className="sidebar-gmb-checkboxes-list">
                      {googleLocations.map(loc => {
                        const isChecked = selectedGbpLocations.includes(loc.name);
                        return (
                          <div 
                            key={loc.name}
                            className={`sidebar-loc-checkbox-row ${isChecked ? 'active' : ''}`}
                            onClick={() => handleToggleGbpLocation(loc.name)}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={() => {}} // Row click handles state
                            />
                            <span className="sidebar-loc-title-text" title={loc.title || loc.name}>
                              {loc.title || loc.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="sidebar-gmb-loading-box">
                      <RefreshCw size={12} className="spinner" />
                      <span>Loading stores...</span>
                    </div>
                  )}

                  <button 
                    className="sidebar-gmb-sync-btn"
                    onClick={handleGmbSyncClick}
                    disabled={selectedGbpLocations.length === 0 || isGmbSyncing}
                  >
                    {isGmbSyncing ? (
                      <>
                        <RefreshCw size={12} className="spinner" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={12} />
                        <span>Sync Google Reviews</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FACEBOOK SYNC CONSOLE */}
          {isFacebookConnected && (
            <div className="sidebar-gmb-control-card" style={{ borderLeft: '4px solid #1877f2', marginTop: '12px' }}>
              <div className="sidebar-gmb-header">
                <span className="gmb-g-icon-small" style={{ backgroundColor: '#1877f2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</span>
                <h3>Facebook Pages</h3>
              </div>
              
              <div className="sidebar-gmb-sync-panel animate-fade-in" style={{ marginTop: '10px' }}>
                <label className="sidebar-gmb-sublabel">Select Pages to Sync:</label>
                
                {facebookPages === null ? (
                  <div className="sidebar-gmb-loading-box">
                    <RefreshCw size={12} className="spinner" />
                    <span>Loading pages...</span>
                  </div>
                ) : facebookPages.length > 0 ? (
                  <div className="sidebar-gmb-checkboxes-list">
                    {facebookPages.map(page => {
                      const isChecked = selectedFbPages.includes(page.id);
                      return (
                        <div 
                          key={page.id}
                          className={`sidebar-loc-checkbox-row ${isChecked ? 'active' : ''}`}
                          onClick={() => handleToggleFbPage(page.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => {}} // Row click handles state
                          />
                          <span className="sidebar-loc-title-text" title={page.name}>
                            {page.name} ({page.category || 'Page'})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="sidebar-gmb-loading-box" style={{ flexDirection: 'column', textAlign: 'center', padding: '15px 10px', gap: '8px' }}>
                    <span style={{ fontSize: '12px', lineHeight: '1.4', color: 'rgba(255, 255, 255, 0.6)' }}>
                      No connected pages found. Make sure to configure the <strong>FACEBOOK_CLIENT_SECRET</strong> in your Railway dashboard variables to complete a live connection.
                    </span>
                  </div>
                )}

                <button 
                  className="sidebar-gmb-sync-btn"
                  onClick={handleFbSyncClick}
                  disabled={selectedFbPages.length === 0 || isFbSyncing}
                  style={{ backgroundColor: '#1877f2' }}
                >
                  {isFbSyncing ? (
                    <>
                      <RefreshCw size={12} className="spinner" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={12} />
                      <span>Sync Facebook Reviews</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Search Header */}
          <div className="sidebar-filter-header">
            <div className="search-box-wrapper">
              <Search size={16} className="search-icon-svg" />
              <input 
                type="text" 
                placeholder="Search reviews or authors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tab Filters Row */}
          <div className="sidebar-filter-controls">
            <div className="filter-select-group">
              <label>Stars:</label>
              <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
                <option value="all">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label>Sentiment:</label>
              <select value={selectedSentiment} onChange={(e) => setSelectedSentiment(e.target.value)}>
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Reviews Stream Feed */}
          <div className="sidebar-reviews-stream">
            {filteredReviews.length === 0 ? (
              <div className="stream-empty-state">
                <SlidersHorizontal size={28} className="empty-icon-svg" />
                <p>No matching reviews found.</p>
              </div>
            ) : (
              filteredReviews.map(rev => {
                const isSelected = selectedReview && selectedReview.id === rev.id;
                return (
                  <div 
                    key={rev.id} 
                    className={`stream-review-card ${isSelected ? 'stream-active-card' : ''}`}
                    onClick={() => handleSelectReview(rev)}
                  >
                    <div className="stream-card-top-row">
                      <div className="stream-card-author-group">
                        <div className="stream-author-avatar" style={{ backgroundColor: rev.avatarColor }}>
                          {rev.authorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="stream-author-meta">
                          <h4>{rev.authorName}</h4>
                          <span className="stream-location-label">{rev.locationName}</span>
                        </div>
                      </div>
                      <span className="stream-date">
                        {new Date(rev.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="stream-rating-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          fill={i < rev.rating ? 'var(--accent-warning)' : 'none'} 
                          stroke="var(--accent-warning)" 
                        />
                      ))}
                      
                      {/* Review Sentiment Badge */}
                      <span className={`stream-sentiment-badge s-badge-${rev.sentiment.toLowerCase()}`}>
                        {rev.sentiment}
                      </span>
                    </div>

                    <p className="stream-snippet">{rev.comment}</p>

                    {/* Status Indicators Row */}
                    <div className="stream-status-row">
                      {rev.isEscalated && <span className="p-badge status-escalated">Escalated</span>}
                      {rev.replyStatus === 'posted' && <span className="p-badge status-posted">Posted</span>}
                      {rev.replyStatus === 'pending_approval' && <span className="p-badge status-pending">AI Pending</span>}
                      {rev.replyStatus === 'none' && <span className="p-badge status-unanswered">Unanswered</span>}
                      {rev.assignedAgent && (
                        <span className="p-badge status-assigned">
                          <UserCheck size={10} style={{ marginRight: '3px' }} />
                          {rev.assignedAgent.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive CRM Workspace Card */}
        <div className="inbox-main-detail glass-panel">
          {selectedReview ? (
            <div className="detail-workspace-scroll animate-fade-in">
              
              {/* Workspace Header */}
              <div className="workspace-card-header">
                <div className="workspace-header-left">
                  <div className="workspace-avatar" style={{ backgroundColor: selectedReview.avatarColor }}>
                    {selectedReview.authorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2>{selectedReview.authorName}</h2>
                    <div className="workspace-location-meta">
                      <span>{selectedReview.locationName}</span>
                      <span className="meta-dot">•</span>
                      <span>Synced via {selectedReview.source}</span>
                    </div>
                  </div>
                </div>

                <div className="workspace-header-actions">
                  <button 
                    className={`star-flag-btn ${selectedReview.isStarred ? 'starred' : ''}`}
                    onClick={() => toggleStarred(selectedReview.id)}
                  >
                    <Star size={16} fill={selectedReview.isStarred ? 'var(--accent-warning)' : 'none'} />
                    <span>{selectedReview.isStarred ? 'Starred' : 'Star Review'}</span>
                  </button>
                  <span className="workspace-timestamp">
                    {new Date(selectedReview.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Review Stars Display */}
              <div className="workspace-rating-row">
                <div className="stars-wrapper">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < selectedReview.rating ? 'var(--accent-warning)' : 'none'} 
                      stroke="var(--accent-warning)" 
                    />
                  ))}
                </div>
                <span className="rating-text-label">{selectedReview.rating} out of 5 Stars</span>
              </div>

              {/* Core Customer Comments */}
              <div className="workspace-comment-bubble">
                <p>"{selectedReview.comment}"</p>
                <div className="comment-bubble-footer">
                  <Sparkles size={14} className="glow-brand-icon" />
                  <span>AI Summary: High reliability intent detected.</span>
                </div>
              </div>

              {/* AI ANALYTICS DISCOVERY RADAR PANEL */}
              <div className="workspace-ai-analysis-radar">
                <div className="analysis-radar-header">
                  <Bot size={18} className="glow-brand-icon" />
                  <h3>AI Engine Discovery Insight</h3>
                </div>

                <div className="analysis-radar-metrics-grid">
                  <div className="radar-metric-item">
                    <h4>Sentiment Score</h4>
                    <div className="radial-metric-row">
                      <div className={`sentiment-score-badge val-${selectedReview.sentiment.toLowerCase()}`}>
                        {selectedReview.sentimentScore}%
                      </div>
                      <span className="metric-desc">Overall {selectedReview.sentiment}</span>
                    </div>
                  </div>

                  <div className="radar-metric-item">
                    <h4>Urgency Score</h4>
                    <div className="radial-metric-row">
                      <div className={`metric-bar-fill val-urgency ${selectedReview.urgencyScore > 75 ? 'c-red' : selectedReview.urgencyScore > 40 ? 'c-yellow' : 'c-blue'}`}>
                        {selectedReview.urgencyScore}/100
                      </div>
                      <span className="metric-desc">{selectedReview.urgencyScore > 70 ? 'Immediate Action' : 'Routine priority'}</span>
                    </div>
                  </div>

                  <div className="radar-metric-item">
                    <h4>Threat & Risk Score</h4>
                    <div className="radial-metric-row">
                      <div className={`metric-bar-fill val-risk ${selectedReview.riskScore > 70 ? 'c-red' : 'c-blue'}`}>
                        {selectedReview.riskScore}/100
                      </div>
                      <span className="metric-desc">{selectedReview.riskScore > 70 ? 'High Churn Risk' : 'Zero Threat'}</span>
                    </div>
                  </div>

                  <div className="radar-metric-item">
                    <h4>Review Category</h4>
                    <div className="radial-metric-row">
                      <span className="radar-category-pill">{selectedReview.type}</span>
                      <span className="metric-desc">Intent: {selectedReview.intent}</span>
                    </div>
                  </div>
                </div>

                <div className="analysis-radar-tags">
                  <h4>Smart Tag Extraction:</h4>
                  <div className="extracted-tags-row">
                    {selectedReview.tags.map((tag, i) => (
                      <span key={i} className="extracted-tag-pill">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* INTERACTIVE AI REPLY EDITOR WORKSPACE */}
              <div className="workspace-ai-reply-card">
                <div className="reply-card-header">
                  <div className="reply-header-title">
                    <Sparkles size={18} className="glow-brand-icon" />
                    <h3>AI Smart Reply Assistant</h3>
                  </div>
                  <span className="reply-ai-model-tag">GPT-4 Omni Engine</span>
                </div>

                {/* AI Tuning Dashboard Controls */}
                <div className="reply-tuning-controls">
                  <div className="control-group">
                    <label>Reply Tone:</label>
                    <div className="tone-toggle-row">
                      {['friendly', 'professional', 'premium', 'casual'].map(t => (
                        <button 
                          key={t} 
                          className={`tone-toggle-btn ${activeTone === t ? 'active' : ''}`}
                          onClick={() => setActiveTone(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="control-group-row">
                    <div className="control-group">
                      <label>Length:</label>
                      <div className="length-toggle-row">
                        {['short', 'medium', 'long'].map(len => (
                          <button 
                            key={len} 
                            className={`length-toggle-btn ${replyLength === len ? 'active' : ''}`}
                            onClick={() => setReplyLength(len)}
                          >
                            {len}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="emoji-checkbox-group">
                      <input 
                        type="checkbox" 
                        id="emoji-toggle" 
                        checked={useEmojis}
                        onChange={(e) => setUseEmojis(e.target.checked)}
                      />
                      <label htmlFor="emoji-toggle">Use Emojis</label>
                    </div>
                  </div>
                </div>

                {/* Textbox Draft Editor */}
                <div className="reply-editor-textarea-wrapper">
                  <textarea
                    className="reply-draft-textarea"
                    placeholder="AI generated response text will appear here. You can manually edit or override this copy before publishing..."
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                  />
                  <div className="reply-textarea-footer">
                    <span>Characters: {draftText.length}</span>
                    <button 
                      className="regenerate-draft-btn"
                      onClick={() => autoGenerateReplyText(selectedReview.id, activeTone, useEmojis, replyLength)}
                    >
                      <Bot size={14} />
                      <span>{draftText ? 'Regenerate Draft' : 'Generate Smart Draft'}</span>
                    </button>
                  </div>
                </div>

                {/* Reply Actions Row */}
                <div className="reply-actions-row">
                  <div className="actions-row-left">
                    {selectedReview.replyStatus === 'pending_approval' && (
                      <button 
                        className="approve-ai-btn"
                        onClick={() => approveReply(selectedReview.id)}
                      >
                        <Check size={16} />
                        <span>Approve Auto-Reply</span>
                      </button>
                    )}
                    <button 
                      className="publish-reply-btn"
                      onClick={() => postReply(selectedReview.id, draftText)}
                      disabled={!draftText}
                    >
                      <Send size={16} />
                      <span>Publish Response</span>
                    </button>
                  </div>

                  <div className="actions-row-right">
                    {draftText && (
                      <button 
                        className="reject-draft-btn"
                        onClick={() => rejectReply(selectedReview.id)}
                      >
                        <Trash2 size={16} />
                        <span>Clear Draft</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* COLLABORATIVE UTILITIES AND ACTIONS PANEL */}
              <div className="workspace-collaboration-panel">
                {/* Section A: Team Assignee */}
                <div className="collab-assignee-card">
                  <div className="collab-sub-header">
                    <UserPlus size={16} />
                    <h4>Assign Support Agent</h4>
                  </div>
                  <select 
                    value={selectedReview.assignedAgent || ''} 
                    className="collab-select-input"
                    onChange={(e) => assignTeamMember(selectedReview.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {team.map(member => (
                      <option key={member.id} value={member.name}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section B: Internal Note */}
                <div className="collab-notes-card">
                  <div className="collab-sub-header">
                    <FileText size={16} />
                    <h4>Internal Notes (Team Log)</h4>
                  </div>
                  <div className="collab-notes-box">
                    <input 
                      type="text" 
                      placeholder="Add private note for team members..." 
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                    />
                    <button 
                      className="save-note-btn"
                      onClick={() => addInternalNote(selectedReview.id, internalNoteText)}
                    >
                      Save Note
                    </button>
                  </div>
                </div>

                {/* Section C: Threat Escalation Portal */}
                <div className="collab-escalate-card">
                  <div className="collab-sub-header">
                    <AlertTriangle size={16} />
                    <h4>Escalate & Ticket</h4>
                  </div>
                  <button 
                    className={`escalate-action-btn ${selectedReview.isEscalated ? 'already-escalated' : ''}`}
                    onClick={() => setShowEscalateModal(true)}
                  >
                    <Mail size={16} />
                    <span>{selectedReview.isEscalated ? 'Ticket Escalated' : 'Escalate Ticket'}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="workspace-empty-view">
              <Bot size={54} className="empty-bot-icon" />
              <h3>No Review Selected</h3>
              <p>Select a review from the stream on the left to start analyzing customer feedback and generating AI automated replies.</p>
            </div>
          )}
        </div>
      </div>

      {/* Escalation Overlay Modal */}
      {showEscalateModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass-panel">
            <div className="modal-header">
              <h3>Escalate Poor Reputation Review</h3>
              <button className="close-modal-btn" onClick={() => setShowEscalateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>This will flag this review and alert your customer success supervisor team, sending an email log and pushing a critical alert ticket to your configured Slack channels.</p>
              
              <div className="input-group">
                <label>Add Escalation Context / Notes:</label>
                <textarea 
                  className="modal-textarea"
                  placeholder="Explain why this requires supervisor action..."
                  value={escalateNote}
                  onChange={(e) => setEscalateNote(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-secondary-btn" onClick={() => setShowEscalateModal(false)}>Cancel</button>
              <button 
                className="modal-primary-btn" 
                onClick={() => {
                  escalateReview(selectedReview.id, escalateNote);
                  setShowEscalateModal(false);
                  setEscalateNote('');
                }}
              >
                Trigger Supervisor Escalation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
