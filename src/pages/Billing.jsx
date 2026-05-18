import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { CreditCard, Check, Sparkles, AlertCircle } from 'lucide-react';

export default function Billing() {
  const { billing, upgradePlan } = useContext(AppContext);

  // Math percentages
  const pctLocations = Math.round((billing.usageLimits.locations.used / billing.usageLimits.locations.limit) * 100);
  const pctReviews = Math.round((billing.usageLimits.reviewsSynced.used / billing.usageLimits.reviewsSynced.limit) * 100);
  const pctTokens = Math.round((billing.usageLimits.aiTokens.used / billing.usageLimits.aiTokens.limit) * 100);
  const pctTeam = Math.round((billing.usageLimits.teamMembers.used / billing.usageLimits.teamMembers.limit) * 100);

  const plans = [
    {
      name: 'Starter Trial',
      price: '$0',
      period: '14-Day Trial',
      desc: 'Perfect for single location local stores testing automated review helpers.',
      features: ['1 Location max', '200 Synced Reviews/mo', '10,000 AI Tokens', '1 User seat', 'Basic Email Support']
    },
    {
      name: 'Growth Pro',
      price: '$149',
      period: 'per month',
      desc: 'Best for rapidly growing local businesses managing multiple store branches.',
      features: ['Up to 10 Locations', '5,000 Synced Reviews/mo', '3,000,000 AI Tokens', '15 Team seats', 'Slack & Email alerts integration', 'Priority Support']
    },
    {
      name: 'Enterprise VIP',
      price: '$499',
      period: 'per month',
      desc: 'Designed for retail chains, franchises, and reputation management agencies.',
      features: ['Up to 100 Locations', '50,000 Synced Reviews/mo', '10,000,000 AI Tokens', '50 Team seats', 'WhatsApp escalations integration', 'Dedicated Client Success partner', 'Super Admin Auditing Panel', 'White Label Capability']
    }
  ];

  return (
    <div className="billing-page animate-fade-in">
      <Header title="SaaS Subscriptions" />

      {/* Main Billing Layout Grid */}
      <div className="billing-workspace-grid-layout">
        
        {/* LEFT COLUMN: Resource Limits Gauges */}
        <div className="billing-gauges-card glass-panel col-span-2">
          <div className="card-top-header">
            <CreditCard size={22} className="glow-brand-icon" />
            <div>
              <h3>Workspace Subscription Limits</h3>
              <p>Current resource usage metrics on the <strong>{billing.plan} Plan</strong></p>
            </div>
          </div>

          <div className="billing-gauges-usage-grids">
            
            {/* Limit Item 1 */}
            <div className="gauge-progress-box">
              <div className="gauge-label-row">
                <span>Managed GBP Locations</span>
                <span>{billing.usageLimits.locations.used} / {billing.usageLimits.locations.limit} synced</span>
              </div>
              <div className="progress-bar-track">
                <div className={`progress-bar-fill ${pctLocations > 80 ? 'fill-red' : 'fill-blue'}`} style={{ width: `${pctLocations}%` }}></div>
              </div>
              <p className="gauge-percentage-label">{pctLocations}% Capacity utilized</p>
            </div>

            {/* Limit Item 2 */}
            <div className="gauge-progress-box">
              <div className="gauge-label-row">
                <span>Monthly Synced Reviews</span>
                <span>{billing.usageLimits.reviewsSynced.used} / {billing.usageLimits.reviewsSynced.limit} reviews</span>
              </div>
              <div className="progress-bar-track">
                <div className={`progress-bar-fill ${pctReviews > 80 ? 'fill-red' : 'fill-green'}`} style={{ width: `${pctReviews}%` }}></div>
              </div>
              <p className="gauge-percentage-label">{pctReviews}% Capacity utilized</p>
            </div>

            {/* Limit Item 3 */}
            <div className="gauge-progress-box">
              <div className="gauge-label-row">
                <span>AI GPT Tokens Consumed</span>
                <span>{billing.usageLimits.aiTokens.used.toLocaleString()} / {billing.usageLimits.aiTokens.limit.toLocaleString()} tokens</span>
              </div>
              <div className="progress-bar-track">
                <div className={`progress-bar-fill ${pctTokens > 80 ? 'fill-red' : 'fill-purple'}`} style={{ width: `${pctTokens}%` }}></div>
              </div>
              <p className="gauge-percentage-label">{pctTokens}% Capacity utilized</p>
            </div>

            {/* Limit Item 4 */}
            <div className="gauge-progress-box">
              <div className="gauge-label-row">
                <span>Team Members Invited</span>
                <span>{billing.usageLimits.teamMembers.used} / {billing.usageLimits.teamMembers.limit} seats</span>
              </div>
              <div className="progress-bar-track">
                <div className={`progress-bar-fill ${pctTeam > 80 ? 'fill-red' : 'fill-yellow'}`} style={{ width: `${pctTeam}%` }}></div>
              </div>
              <p className="gauge-percentage-label">{pctTeam}% Capacity utilized</p>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Subscription pricing selector */}
        <section className="billing-plans-comparison-wrapper col-span-2">
          <div className="comparison-header">
            <Sparkles size={20} className="glow-brand-icon" />
            <h3>Choose the Plan That Grows with Your Brand</h3>
          </div>

          <div className="pricing-cards-flex-row">
            {plans.map(plan => {
              const isActivePlan = billing.plan === plan.name;
              
              return (
                <div key={plan.name} className={`pricing-tier-card glass-panel ${isActivePlan ? 'active-tier-glow' : ''}`}>
                  {isActivePlan && <span className="active-tag-bubble">ACTIVE PLAN</span>}
                  
                  <div className="tier-header">
                    <h4>{plan.name}</h4>
                    <div className="tier-price-group">
                      <h2>{plan.price}</h2>
                      <span>{plan.period}</span>
                    </div>
                    <p className="tier-desc">{plan.desc}</p>
                  </div>

                  <div className="tier-body">
                    <ul>
                      {plan.features.map((feat, i) => (
                        <li key={i}>
                          <Check size={14} className="feature-check-icon" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="tier-footer">
                    {isActivePlan ? (
                      <button className="current-plan-disabled-btn" disabled>Current Selection</button>
                    ) : (
                      <button 
                        className="upgrade-action-btn"
                        onClick={() => upgradePlan(plan.name, `${plan.price}/mo`)}
                      >
                        Upgrade to {plan.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Past invoices */}
        <section className="past-invoices-card glass-panel col-span-2">
          <div className="invoice-header">
            <h3>Past Payment Invoices</h3>
            <p>Download billing reports powered securely by Stripe</p>
          </div>

          <div className="invoices-list-table">
            <table className="custom-dashboard-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Billing Date</th>
                  <th>Total Amount</th>
                  <th>Stripe Status</th>
                  <th>Receipt Download</th>
                </tr>
              </thead>
              <tbody>
                {billing.invoices.map(inv => (
                  <tr key={inv.id}>
                    <td><strong>INV-{inv.id}</strong></td>
                    <td>{new Date(inv.date).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td>{inv.amount}</td>
                    <td><span className="status-teammate-pill stat-active">{inv.status}</span></td>
                    <td><button className="download-receipt-link">Download PDF Receipt</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
