export const initialLocations = [];

export const initialReviews = [];

export const initialTeam = [
  { id: 'usr-1', name: 'James Carter', email: 'james@areviewpilot.com', role: 'Admin', status: 'ACTIVE', avatar: 'JC' },
  { id: 'usr-2', name: 'Elena Rostova', email: 'elena@areviewpilot.com', role: 'Manager', status: 'ACTIVE', avatar: 'ER' },
  { id: 'usr-3', name: 'David Kim', email: 'david@areviewpilot.com', role: 'Support Agent', status: 'ACTIVE', avatar: 'DK' },
  { id: 'usr-4', name: 'Sophia Loren', email: 'sophia@areviewpilot.com', role: 'Support Agent', status: 'PENDING', avatar: 'SL' }
];

export const initialIntegrations = [
  { id: 'google', name: 'Google Business Profile', description: 'Fetch business locations and automatically sync reviews.', status: 'DISCONNECTED', icon: 'Google' }
];

export const initialAutomations = {
  autoReplyEnabled: true,
  autoReplyMinRating: 4,
  autoReplyDelayMinutes: 5,
  defaultTone: 'friendly',
  useEmojis: true,
  negativeEscalationEnabled: true,
  escalationEmail: 'escalations@areviewpilot.com',
  escalationChannels: ['slack', 'email'],
  customInstructions: 'Always mention the reviewer name. Emphasize our commitment to 100% customer satisfaction. Keep responses under 4 sentences.',
  bannedWords: ['perfect', 'cheap', 'no problem']
};

export const initialSystemStats = {
  tokensUsed: 142850,
  apiCalls: 4890,
  autoRepliesPosted: 34,
  totalTenantCost: 14.28,
  auditLogs: [
    { id: 'log-1', timestamp: '2026-05-18T09:12:00Z', action: 'Auto-Reply Posted', user: 'AI Pilot', details: 'Replied to Alexander Wright (5 stars)' },
    { id: 'log-2', timestamp: '2026-05-18T08:45:00Z', action: 'OAuth Connection Refreshed', user: 'James Carter', details: 'Google Business Profile tokens renewed.' },
    { id: 'log-3', timestamp: '2026-05-18T07:15:00Z', action: 'Negative Review Escalated', user: 'AI Engine', details: 'Review from Sarah Jenkins flagged and escalated.' },
    { id: 'log-4', timestamp: '2026-05-17T20:30:00Z', action: 'Settings Updated', user: 'Elena Rostova', details: 'Changed default tone of Main Street Cafe to friendly.' }
  ]
};

export const initialBilling = {
  plan: 'Growth Pro',
  price: '$149/mo',
  status: 'Active',
  trialEnds: null,
  usageLimits: {
    locations: { used: 4, limit: 10 },
    reviewsSynced: { used: 1208, limit: 5000 },
    aiTokens: { used: 142850, limit: 1000000 },
    teamMembers: { used: 4, limit: 15 }
  },
  invoices: [
    { id: 'inv-101', date: '2026-05-01', amount: '$149.00', status: 'Paid' },
    { id: 'inv-100', date: '2026-04-01', amount: '$149.00', status: 'Paid' }
  ]
};
