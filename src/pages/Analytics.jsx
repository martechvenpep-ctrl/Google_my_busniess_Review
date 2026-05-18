import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import AreaChart from '../components/AreaChart';
import BarChart from '../components/BarChart';
import CircleChart from '../components/CircleChart';
import { TrendingUp, Award, Clock, Sparkles, Filter, ChevronDown } from 'lucide-react';

export default function Analytics() {
  const { reviews, activeLocationId } = useContext(AppContext);

  // Filter reviews by location
  const filteredReviews = reviews.filter(rev => 
    activeLocationId === 'all' || rev.locationId === activeLocationId
  );

  const totalReviews = filteredReviews.length;
  
  // Rating math
  const fiveStars = filteredReviews.filter(r => r.rating === 5).length;
  const fourStars = filteredReviews.filter(r => r.rating === 4).length;
  const threeStars = filteredReviews.filter(r => r.rating === 3).length;
  const twoStars = filteredReviews.filter(r => r.rating === 2).length;
  const oneStars = filteredReviews.filter(r => r.rating === 1).length;

  const totalReplied = filteredReviews.filter(r => r.replyStatus === 'posted').length;
  const responseRate = totalReviews > 0 ? Math.round((totalReplied / totalReviews) * 100) : 0;

  // Sentiment distributions
  const positive = filteredReviews.filter(r => r.sentiment === 'Positive').length;
  const neutral = filteredReviews.filter(r => r.sentiment === 'Neutral').length;
  const negative = filteredReviews.filter(r => r.sentiment === 'Negative').length;

  const positiveShare = totalReviews > 0 ? Math.round((positive / totalReviews) * 100) : 0;
  const neutralShare = totalReviews > 0 ? Math.round((neutral / totalReviews) * 100) : 0;
  const negativeShare = totalReviews > 0 ? Math.round((negative / totalReviews) * 100) : 0;

  return (
    <div className="analytics-page animate-fade-in">
      <Header title="Executive Analytics" />

      {/* Analytics Mini KPIs Header */}
      <section className="analytics-kpi-summary-row">
        <div className="mini-summary-card glass-panel">
          <div className="card-lbl">Automated Success Rate</div>
          <div className="card-val-group">
            <span className="card-val">{responseRate}%</span>
            <span className="card-trend upward">+4.2%</span>
          </div>
        </div>

        <div className="mini-summary-card glass-panel">
          <div className="card-lbl">Average AI Response Time</div>
          <div className="card-val-group">
            <span className="card-val">4.5m</span>
            <span className="card-trend upward">-12m faster</span>
          </div>
        </div>

        <div className="mini-summary-card glass-panel">
          <div className="card-lbl">Reputation Net Promoter (NPS)</div>
          <div className="card-val-group">
            <span className="card-val">76</span>
            <span className="card-trend upward">Excellent</span>
          </div>
        </div>

        <div className="mini-summary-card glass-panel">
          <div className="card-lbl">Total AI Tokens Saved</div>
          <div className="card-val-group">
            <span className="card-val">142,850</span>
            <span className="card-trend neutral">4.8M Max</span>
          </div>
        </div>
      </section>

      {/* Analytics Graph Grid */}
      <div className="analytics-charts-grid">
        
        {/* Graph 1: Reviews Growth trend Area chart */}
        <div className="analytics-chart-full-card glass-panel col-span-2">
          <div className="card-header-with-actions">
            <div>
              <h3>Reputation Scale Growth over Time</h3>
              <p>Weekly review volume comparing synced vs responded rates</p>
            </div>
            <div className="chart-legend-row">
              <div className="legend-item"><span className="legend-dot dot-blue"></span><span>Reviews Recieved</span></div>
              <div className="legend-item"><span className="legend-dot dot-green"></span><span>AI Replied</span></div>
            </div>
          </div>
          <div className="chart-wrapper-box">
            <AreaChart 
              data={activeLocationId === 'all' ? [14, 22, 19, 32, 45, 38, 55, 62, 58, 75] : [6, 12, 8, 15, 20, 16, 25, 28, 22, 34]} 
              labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10']}
              strokeColor="var(--primary)"
              fillColorId="cyan-grad"
              height={200}
            />
          </div>
        </div>

        {/* Graph 2: Donut circle for customer experience sentiments */}
        <div className="analytics-chart-half-card glass-panel">
          <div className="card-header-with-actions">
            <h3>Net Sentiment Distribution</h3>
            <p>Overall customer mood segmentation</p>
          </div>
          <div className="circle-chart-flex">
            <CircleChart 
              percentage={positiveShare}
              label={`${positiveShare}%`}
              subLabel="NPS Positive"
              color="var(--accent-success)"
              size={140}
              strokeWidth={12}
            />
            <div className="donut-stats-legend-grid">
              <div className="d-stat-row">
                <span className="legend-dot dot-green"></span>
                <span className="d-label">Positive Sentiment</span>
                <span className="d-val">{positiveShare}%</span>
              </div>
              <div className="d-stat-row">
                <span className="legend-dot dot-yellow"></span>
                <span className="d-label">Neutral Sentiment</span>
                <span className="d-val">{neutralShare}%</span>
              </div>
              <div className="d-stat-row">
                <span className="legend-dot dot-red"></span>
                <span className="d-label">Negative Dissatisfaction</span>
                <span className="d-val">{negativeShare}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graph 3: Ratings distribution comparing star counts (Bar Chart) */}
        <div className="analytics-chart-half-card glass-panel">
          <div className="card-header-with-actions">
            <h3>Rating Stars Distribution</h3>
            <p>Count breakdown of 1-5 star reviews</p>
          </div>
          <div className="bar-chart-wrapper-box">
            <BarChart 
              data={[fiveStars, fourStars, threeStars, twoStars, oneStars]}
              labels={['5★', '4★', '3★', '2★', '1★']}
              barColor="var(--accent-warning)"
              height={180}
            />
          </div>
        </div>

        {/* Graph 4: Dynamic bar comparison of auto reply tones (Bar Chart) */}
        <div className="analytics-chart-half-card glass-panel">
          <div className="card-header-with-actions">
            <h3>AI Reply Tones Preferred</h3>
            <p>Most frequently dispatched response tones</p>
          </div>
          <div className="bar-chart-wrapper-box">
            <BarChart 
              data={[18, 12, 5, 2]}
              labels={['Friendly', 'Professional', 'Premium', 'Casual']}
              barColor="hsl(252, 90%, 65%)"
              height={180}
            />
          </div>
        </div>

        {/* Word Keywords analysis table */}
        <div className="analytics-chart-half-card glass-panel">
          <div className="card-header-with-actions">
            <h3>Keyword Semantic Wordcloud Frequency</h3>
            <p>Common themes mined by AI review categorization</p>
          </div>

          <div className="keywords-frequency-table-wrapper">
            <table className="custom-dashboard-table">
              <thead>
                <tr>
                  <th>Topic Keyword</th>
                  <th>Occurrences</th>
                  <th>Topic Impact</th>
                  <th>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="table-topic-bold">Great Service</span></td>
                  <td>142 times</td>
                  <td><span className="topic-trend-pill positive-impact">Positive Impact</span></td>
                  <td>4.8 ★</td>
                </tr>
                <tr>
                  <td><span className="table-topic-bold">Staff Service</span></td>
                  <td>98 times</td>
                  <td><span className="topic-trend-pill positive-impact">Positive Impact</span></td>
                  <td>4.7 ★</td>
                </tr>
                <tr>
                  <td><span className="table-topic-bold">Defective Product</span></td>
                  <td>22 times</td>
                  <td><span className="topic-trend-pill negative-impact">Negative Risk</span></td>
                  <td>1.8 ★</td>
                </tr>
                <tr>
                  <td><span className="table-topic-bold">Double Charged</span></td>
                  <td>12 times</td>
                  <td><span className="topic-trend-pill negative-impact">Critical Alert</span></td>
                  <td>1.1 ★</td>
                </tr>
                <tr>
                  <td><span className="table-topic-bold">High Wi-Fi Speed</span></td>
                  <td>8 times</td>
                  <td><span className="topic-trend-pill neutral-impact">Neutral Impact</span></td>
                  <td>5.0 ★</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
