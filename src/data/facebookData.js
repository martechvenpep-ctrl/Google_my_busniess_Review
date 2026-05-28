// High-Fidelity Dataset containing mock Meta API responses for Facebook Pages & Reviews (Ratings)

export const facebookPagesMock = [
  {
    id: "694955550368673",
    name: "SAAS GAMA",
    access_token: "EAACEdEose0cBAK2ZBzZCpZAzZC110256327",
    category: "Software",
    tasks: ["MODERATE", "MESSAGING"]
  },
  {
    id: "825801386910318",
    name: "Venpep Digital Solutions",
    access_token: "EAACEdEose0cBA825801386910318",
    category: "Marketing Agency",
    tasks: ["MODERATE", "MESSAGING"]
  },
  {
    id: "951048627103818",
    name: "AI ReviewPilot Support Page",
    access_token: "EAACEdEose0cBA951048627103818",
    category: "Consulting Agency",
    tasks: ["MODERATE", "MESSAGING", "ANALYZE"]
  }
];

export const facebookReviewsMock = [
  {
    reviewId: "fb-rev-101",
    reviewer: {
      displayName: "John Doe",
      profilePhotoUrl: null
    },
    recommendation_type: "positive",
    review_text: "Absolutely love the review automation features! It makes managing customer relations a breeze.",
    created_time: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    reply_message: "",
    synced_at: ""
  },
  {
    reviewId: "fb-rev-102",
    reviewer: {
      displayName: "Sarah Jenkins",
      profilePhotoUrl: null
    },
    recommendation_type: "negative",
    review_text: "I experienced a login issue where the oauth token expired, and it took a long time to reconnect. Need better handling.",
    created_time: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
    reply_message: "",
    synced_at: ""
  },
  {
    reviewId: "fb-rev-103",
    reviewer: {
      displayName: "Michael Chang",
      profilePhotoUrl: null
    },
    recommendation_type: "positive",
    review_text: "Great dashboard support and analytics widgets. Very premium UI aesthetics!",
    created_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    reply_message: "Thank you for your feedback! We are thrilled that you like the UI.",
    synced_at: new Date(Date.now() - 86000000).toISOString()
  },
  {
    reviewId: "fb-rev-104",
    reviewer: {
      displayName: "Emily Watson",
      profilePhotoUrl: null
    },
    recommendation_type: "positive",
    review_text: "AI reply helper is highly professional. Deducts hours of copy-pasting for my team daily.",
    created_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    reply_message: "",
    synced_at: ""
  }
];
