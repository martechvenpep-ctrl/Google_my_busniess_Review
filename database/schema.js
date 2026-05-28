/**
 * Database Schema Definition for Facebook Page Review Automation
 * Technology: MongoDB with Mongoose
 * Multi-tenant isolation is enforced using the `tenantId` field and compound indexes.
 */

import mongoose from 'mongoose';

// 1. User/Tenant Meta Credentials & OAuth Tokens Collection
const FacebookAccountSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    unique: true, // One Meta connection per tenant
    ref: 'Tenant'
  },
  facebookUserId: { 
    type: String, 
    required: true 
  },
  userAccessToken: { 
    type: String, 
    required: true // Encrypted using AES-256-GCM in production middleware
  },
  connectedEmail: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['CONNECTED', 'EXPIRED', 'REVOKED'], 
    default: 'CONNECTED' 
  },
  scopes: [{ 
    type: String // pages_show_list, pages_read_engagement, pages_manage_metadata, pages_manage_engagement, public_profile
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound Index to guarantee single user metadata lookup per tenant
FacebookAccountSchema.index({ tenantId: 1 });
FacebookAccountSchema.index({ facebookUserId: 1 });


// 2. Connected Facebook Pages Collection (Pages linked to review sync engine)
const FacebookPageSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Tenant' 
  },
  facebookAccountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'FacebookAccount' 
  },
  pageId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String 
  },
  pageAccessToken: { 
    type: String, 
    required: true // Encrypted using AES-256-GCM (Page-level tasks API authentication)
  },
  isActive: { 
    type: Boolean, 
    default: true // User-defined sync status toggle
  },
  lastSyncedAt: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index page lookup per tenant
FacebookPageSchema.index({ tenantId: 1, pageId: 1 }, { unique: true });
FacebookPageSchema.index({ isActive: 1 });


// 3. Facebook Reviews / Ratings Synced Collection
const FacebookReviewSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Tenant' 
  },
  pageId: { 
    type: String, 
    required: true, 
    ref: 'FacebookPage' 
  },
  reviewId: { 
    type: String, 
    required: true, 
    unique: true // Meta Ratings Unique ID
  },
  reviewerName: { 
    type: String, 
    required: true 
  },
  reviewerAvatar: { 
    type: String 
  },
  recommendationType: { 
    type: String, 
    enum: ['positive', 'negative'], 
    required: true 
  },
  comment: { 
    type: String, 
    default: '' 
  },
  sentiment: { 
    type: String, 
    enum: ['Positive', 'Neutral', 'Negative'], 
    default: 'Neutral' 
  },
  sentimentScore: { 
    type: Number, 
    min: 0, 
    max: 100 
  },
  replyStatus: { 
    type: String, 
    enum: ['none', 'pending_approval', 'posted'], 
    default: 'none' 
  },
  replyText: { 
    type: String 
  },
  repliedAt: { 
    type: Date 
  },
  postedCommentId: { 
    type: String // Comment ID returned by Facebook Graph API after replying
  },
  createdTime: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound indexing for page filtering and reviews querying speed
FacebookReviewSchema.index({ tenantId: 1, pageId: 1 });
FacebookReviewSchema.index({ replyStatus: 1 });
FacebookReviewSchema.index({ createdTime: -1 });

export const FacebookAccount = mongoose.model('FacebookAccount', FacebookAccountSchema);
export const FacebookPage = mongoose.model('FacebookPage', FacebookPageSchema);
export const FacebookReview = mongoose.model('FacebookReview', FacebookReviewSchema);
