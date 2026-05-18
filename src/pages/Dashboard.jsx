import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import AreaChart from '../components/AreaChart';
import CircleChart from '../components/CircleChart';
import { 
  Star, 
  MessageSquare, 
  Bot, 
  Percent, 
  Activity, 
  AlertTriangle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const { 
    reviews, 
    locations, 
    activeLocationId, 
    setSelectedReview, 
    setActivePage 
  } = useContext(AppContext);

  // Filter reviews by selected location
  const filteredReviews = reviews.filter(rev => 
    activeLocationId === 'all' || rev.locationId === activeLocationId
  );

  // Dynamic calculations based on current location
  const totalReviews = filteredReviews.length;
  
  const avgRating = totalReviews > 0
    ? (filteredReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const reviewsWithReplies = filteredReviews.filter(r => r.replyStatus === 'posted').length;
  const responseRate = totalReviews > 0
    ? Math.round((reviewsWithReplies / totalReviews) * 100)
    : 0;

  const reviewsWithAiReplies = filteredReviews.filter(r => r.replyStatus === 'posted' && r.replyTone).length;
  const aiReplyRate = reviewsWithReplies > 0
    ? Math.round((reviewsWithAiReplies / reviewsWithReplies) * 100)
    : 0;

  const avgSentiment = totalReviews > 0
    ? Math.round(filteredReviews.reduce((acc, r) => acc + r.sentimentScore, 0) / totalReviews)
    : 0;

  const escalatedReviews = filteredReviews.filter(r => r.isEscalated).length;

  // Chart data setup based on reviews
  const chartReviewsData = activeLocationId === 'all' ? [12, 19, 15, 25, 32, 28, 45, 52, 48, 62] : [8, 12, 10, 18, 22, 19, 28, 30, 25, 35];
  const chartReviewsLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

  // Sentiment distributions
  const positiveCount = filteredReviews.filter(r => r.sentiment === 'Positive').length;
  const neutralCount = filteredReviews.filter(r => r.sentiment === 'Neutral').length;
  const negativeCount = filteredReviews.filter(r => r.sentiment === 'Negative').length;
  
  const positiveShare = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;

  return (
    <div className="dashboard-page animate-fade-in">
      <Header title="Dashboard" />

      {/* Overview KPI Cards Grid */}
      <section className="kpi-grid">
        {/* KPI Card 1 */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper kpi-blue">
            <MessageSquare size={20} />
          </div>
          <div className="kpi-details">
            <h3>Total Reviews</h3>
            <h2>{totalReviews}</h2>
            <p className="kpi-stat-good">
              <TrendingUp size={12} />
              <span>+18% this month</span>
            </p>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper kpi-yellow">
            <Star size={20} />
          </div>
          <div className="kpi-details">
            <h3>Average Rating</h3>
            <h2>{avgRating} <span className="star-unit">★</span></h2>
            <div className="rating-stars-row">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < Math.round(avgRating) ? 'var(--accent-warning)' : 'none'} 
                  stroke="var(--accent-warning)" 
                />
              ))}
            </div>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper kpi-green">
            <Percent size={20} />
          </div>
          <div className="kpi-details">
            <h3>Response Rate</h3>
            <h2>{responseRate}%</h2>
            <p className="kpi-stat-good">
              <span>Goal: 95%</span>
            </p>
          </div>
        </div>

        {/* KPI Card 4 */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper kpi-purple">
            <Bot size={20} />
          </div>
          <div className="kpi-details">
            <h3>AI Reply Rate</h3>
            <h2>{aiReplyRate}%</h2>
            <p className="kpi-stat-brand">
              <span>Automated Engine active</span>
            </p>
          </div>
        </div>

        {/* KPI Card 5 */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper kpi-cyan">
            <Activity size={20} />
          </div>
          <div className="kpi-details">
            <h3>Reputation Score</h3>
            <h2>{avgSentiment}/100</h2>
            <p className={avgSentiment > 70 ? 'kpi-stat-good' : 'kpi-stat-warn'}>
              <span>{avgSentiment > 70 ? 'Excellent Health' : 'Needs attention'}</span>
            </p>
          </div>
        </div>

        {/* KPI Card 6 */}
        <div className={`kpi-card glass-panel ${escalatedReviews > 0 ? 'kpi-alert-border' : ''}`}>
          <div className={`kpi-icon-wrapper ${escalatedReviews > 0 ? 'kpi-red' : 'kpi-muted'}`}>
            <AlertTriangle size={20} />
          </div>
          <div className="kpi-details">
            <h3>Urgent Alerts</h3>
            <h2>{escalatedReviews}</h2>
            <p className={escalatedReviews > 0 ? 'kpi-stat-bad' : 'kpi-stat-good'}>
              <span>{escalatedReviews > 0 ? 'Escalations pending' : 'Zero threats'}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Visual Charts Grid Section */}
      <section className="dashboard-charts-row">
        {/* Chart Card 1: Area Chart */}
        <div className="chart-card-main glass-panel col-span-2">
          <div className="chart-card-header">
            <div>
              <h3>Reviews Performance Trend</h3>
              <p>Google Business Profile customer acquisition metrics</p>
            </div>
            <div className="chart-legend-row">
              <span className="legend-dot dot-blue"></span>
              <span>Reviews synced</span>
            </div>
          </div>
          <div className="chart-card-body">
            <AreaChart 
              data={chartReviewsData} 
              labels={chartReviewsLabels} 
              strokeColor="#3b82f6" 
              fillColorId="cyan-grad" 
            />
          </div>
        </div>

        {/* Chart Card 2: Circle Donut Chart */}
        <div className="chart-card-donut glass-panel">
          <div className="chart-card-header">
            <h3>Sentiment Share</h3>
            <p>Overall customer opinion distribution</p>
          </div>
          <div className="chart-card-body donut-body">
            <CircleChart 
              percentage={positiveShare} 
              label={`${positiveShare}%`} 
              subLabel="Positive" 
              color="var(--accent-success)" 
              size={130}
              strokeWidth={12}
            />
            <div className="donut-legend-breakdown">
              <div className="legend-breakdown-item">
                <span className="legend-dot dot-green"></span>
                <span>Positive ({positiveCount})</span>
              </div>
              <div className="legend-breakdown-item">
                <span className="legend-dot dot-yellow"></span>
                <span>Neutral ({neutralCount})</span>
              </div>
              <div className="legend-breakdown-item">
                <span className="legend-dot dot-red"></span>
                <span>Negative ({negativeCount})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lower Dashboard Tables Row */}
      <section className="dashboard-lists-grid">
        {/* Latest Syncing Reviews Feed */}
        <div className="list-card glass-panel col-span-2">
          <div className="list-card-header">
            <div>
              <h3>Pending Action Reviews</h3>
              <p>Reviews requiring direct responses or approval updates</p>
            </div>
            <button 
              className="view-all-text-btn"
              onClick={() => setActivePage('reviews')}
            >
              <span>Go to Inbox</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="list-card-body">
            {filteredReviews.length === 0 ? (
              <div className="empty-state-card">
                <p>No reviews found matching this filter.</p>
              </div>
            ) : (
              <div className="dashboard-reviews-list-compact">
                {filteredReviews.slice(0, 3).map(rev => (
                  <div key={rev.id} className="compact-review-row">
                    <div className="compact-reviewer-avatar" style={{ backgroundColor: rev.avatarColor }}>
                      {rev.authorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="compact-review-info">
                      <div className="compact-review-top-row">
                        <h4>{rev.authorName}</h4>
                        <span className="compact-location-tag">{rev.locationName}</span>
                      </div>
                      <div className="compact-review-stars-row">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={11} 
                            fill={i < rev.rating ? 'var(--accent-warning)' : 'none'} 
                            stroke="var(--accent-warning)" 
                          />
                        ))}
                        <span className="compact-time-ago">
                          {new Date(rev.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="compact-review-comment">{rev.comment}</p>
                      
                      {/* AI Badges status */}
                      <div className="compact-badges-row">
                        <span className={`sentiment-badge sentiment-${rev.sentiment.toLowerCase()}`}>
                          {rev.sentiment} ({rev.sentimentScore}%)
                        </span>
                        {rev.isEscalated && (
                          <span className="status-pill status-escalated">Escalated</span>
                        )}
                        {rev.replyStatus === 'posted' && (
                          <span className="status-pill status-posted">Posted</span>
                        )}
                        {rev.replyStatus === 'pending_approval' && (
                          <span className="status-pill status-pending">AI Pending Approval</span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      className="compact-row-action-btn"
                      onClick={() => {
                        setSelectedReview(rev);
                        setActivePage('reviews');
                      }}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Complaints Analysis Breakdown Card */}
        <div className="list-card glass-panel">
          <div className="list-card-header">
            <h3>Reputation Analytics Summary</h3>
            <p>Topic classification & AI tags detection</p>
          </div>
          <div className="list-card-body">
            <div className="dashboard-stats-rows">
              <div className="stat-row-item">
                <div className="stat-row-label">
                  <span>Customer Support (Staff)</span>
                  <span>{filteredReviews.filter(r => r.type === 'Staff appreciation' || r.type === 'Complaint').length} reviews</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill fill-blue" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="stat-row-item">
                <div className="stat-row-label">
                  <span>Product Quality issues</span>
                  <span>{filteredReviews.filter(r => r.type === 'Refund issue' || r.type === 'Service quality').length} reviews</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill fill-yellow" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="stat-row-item">
                <div className="stat-row-label">
                  <span>Logistics & Shipping</span>
                  <span>{filteredReviews.filter(r => r.type === 'Delivery issue').length} reviews</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill fill-purple" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div className="stat-row-item">
                <div className="stat-row-label">
                  <span>Spam Bot / Fake attempts</span>
                  <span>{filteredReviews.filter(r => r.type === 'Fake/spam review').length} reviews</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill fill-red" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
