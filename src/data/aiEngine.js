// Sophisticated client-side AI analysis and response generator engine

const SENTIMENT_KEYWORDS = {
  positive: ['love', 'great', 'excellent', 'amazing', 'perfect', 'wonderful', 'delicious', 'friendly', 'best', 'outstanding', 'clean', 'happy', 'fantastic', 'top-tier', 'elite', 'elite', 'stunning', 'solid', 'good', 'superb'],
  negative: ['bad', 'poor', 'terrible', 'worst', 'unacceptable', 'rude', 'double charged', 'charge', 'stole', 'theft', 'ripped off', 'waiter', 'slow', 'cold', 'broken', 'defect', 'damaged', 'tear', 'crap', 'garbage', 'broken', 'horrible', 'refund', 'failed', 'never', 'avoid']
};

const TYPE_KEYWORDS = {
  staff: ['staff', 'waiter', 'service', 'personnel', 'team', 'consultant', 'manager', 'rude', 'friendly', 'welcoming'],
  product: ['dress', 'keyboard', 'keycap', 'fabric', 'product', 'item', 'device', 'material', 'quality', 'defective'],
  shipping: ['delivery', 'overnight', 'shipping', 'shipped', 'arrived', 'delay', 'took longer', 'tracking', 'post office'],
  finance: ['charge', 'double charged', 'bank', 'theft', 'card', 'billing', 'invoice', 'receipt', 'overcharge', 'refund', 'money'],
  spam: ['telegram', 'crypto', 'whatsapp', 'trade', 'investment', 'academy', 'join group', 'money easily', 'signals', 'bot']
};

export function analyzeReviewText(comment, rating) {
  const text = comment.toLowerCase();
  
  // Calculate Sentiment Score
  let positiveMatches = 0;
  let negativeMatches = 0;
  
  SENTIMENT_KEYWORDS.positive.forEach(word => {
    if (text.includes(word)) positiveMatches++;
  });
  
  SENTIMENT_KEYWORDS.negative.forEach(word => {
    if (text.includes(word)) negativeMatches++;
  });
  
  let sentimentScore = 50; // Neutral default
  if (rating > 3) {
    sentimentScore = 70 + (rating - 4) * 15 + Math.min(positiveMatches * 3 - negativeMatches * 2, 15);
  } else if (rating < 3) {
    sentimentScore = 30 - (3 - rating) * 10 - Math.min(negativeMatches * 4 - positiveMatches * 1, 20);
  } else {
    sentimentScore = 50 + (positiveMatches - negativeMatches) * 5;
  }
  sentimentScore = Math.max(0, Math.min(100, Math.round(sentimentScore)));
  
  // Determine Sentiment Label
  let sentiment = 'Neutral';
  if (sentimentScore >= 65) sentiment = 'Positive';
  else if (sentimentScore <= 35) sentiment = 'Negative';
  
  // Determine Risk and Urgency
  let riskScore = 0;
  let urgencyScore = 0;
  
  if (rating === 1) {
    riskScore = 80 + Math.min(negativeMatches * 5, 20);
    urgencyScore = 85 + Math.min(negativeMatches * 3, 15);
  } else if (rating === 2) {
    riskScore = 60 + Math.min(negativeMatches * 5, 25);
    urgencyScore = 65 + Math.min(negativeMatches * 3, 20);
  } else if (rating === 3) {
    riskScore = 30 + Math.min(negativeMatches * 3, 20);
    urgencyScore = 40 + Math.min(negativeMatches * 3, 15);
  } else {
    riskScore = Math.max(1, 10 - positiveMatches * 2);
    urgencyScore = Math.max(1, 15 - positiveMatches * 3);
  }
  
  // High risk keywords increase values
  if (text.includes('double charged') || text.includes('theft') || text.includes('stole') || text.includes('sue') || text.includes('lawyer')) {
    riskScore = Math.min(99, riskScore + 20);
    urgencyScore = Math.min(99, urgencyScore + 25);
  }
  
  riskScore = Math.round(riskScore);
  urgencyScore = Math.round(urgencyScore);
  
  // Classify Review Type
  let type = 'Positive';
  let intent = 'Praise experience';
  
  if (rating <= 3) {
    if (text.includes('telegram') || text.includes('crypto') || text.includes('group') || text.includes('signals')) {
      type = 'Fake/spam review';
      intent = 'Promote spam service';
    } else if (text.includes('double charged') || text.includes('refund') || text.includes('charge') || text.includes('bank')) {
      type = 'Refund issue';
      intent = 'Demand monetary correction';
    } else if (text.includes('delivery') || text.includes('shipping') || text.includes('delay') || text.includes('ship')) {
      type = 'Delivery issue';
      intent = 'Resolve shipping delay';
    } else if (text.includes('rude') || text.includes('waiter') || text.includes('staff') || text.includes('manager')) {
      type = 'Complaint';
      intent = 'Report bad employee conduct';
    } else {
      type = 'Service quality';
      intent = 'Report product/service dissatisfaction';
    }
  } else {
    if (text.includes('staff') || text.includes('waiter') || text.includes('consultant') || text.includes('service')) {
      type = 'Staff appreciation';
      intent = 'Praise helpful customer support';
    } else if (text.includes('ambiance') || text.includes('environment') || text.includes('place') || text.includes('wifi')) {
      type = 'Positive';
      intent = 'Appreciate atmosphere';
    } else {
      type = 'Positive';
      intent = 'Recommend products or brand';
    }
  }
  
  // Extract Keywords and Smart Tags
  const possibleTags = [];
  if (text.includes('coffee')) possibleTags.push('Coffee Quality');
  if (text.includes('service') || text.includes('staff')) possibleTags.push('Staff Service');
  if (text.includes('wifi') || text.includes('internet')) possibleTags.push('High-speed Wi-Fi');
  if (text.includes('dress') || text.includes('fabric')) possibleTags.push('Apparel Quality');
  if (text.includes('keyboard') || text.includes('rgb')) possibleTags.push('Hardware Design');
  if (text.includes('delivery') || text.includes('shipping')) possibleTags.push('Logistics');
  if (text.includes('charged') || text.includes('card')) possibleTags.push('Billing Defect');
  if (text.includes('crypto') || text.includes('@')) possibleTags.push('Promotional Spam');
  
  if (possibleTags.length === 0) {
    if (rating >= 4) possibleTags.push('Customer Delight');
    else possibleTags.push('General Complaint');
  }
  
  // Emotion Detection
  let emotion = 'Neutral';
  if (rating === 5) emotion = 'Delighted';
  else if (rating === 4) emotion = 'Satisfied';
  else if (rating === 3) emotion = 'Indifferent';
  else if (rating === 2) emotion = 'Frustrated';
  else if (rating === 1) {
    if (text.includes('double charged') || text.includes('rude') || text.includes('stole') || text.includes('hate')) {
      emotion = 'Angry';
    } else {
      emotion = 'Extremely Dissatisfied';
    }
  }
  
  // Action recommendation
  let suggestedAction = 'Auto-post AI Reply';
  let escalationRecommended = false;
  
  if (rating <= 2) {
    suggestedAction = 'Escalate to Support Queue';
    escalationRecommended = true;
  } else if (rating === 3) {
    suggestedAction = 'Hold in Manual Review';
  } else if (type === 'Fake/spam review') {
    suggestedAction = 'Report to Google for Deletion';
  }
  
  return {
    sentimentScore,
    sentiment,
    riskScore,
    urgencyScore,
    type,
    intent,
    tags: possibleTags,
    emotion,
    suggestedAction,
    escalationRecommended,
    brandReputationScore: Math.round(sentimentScore * 0.9 + (5 - riskScore/20) * 2)
  };
}

export function generateSmartReply(reviewerName, comment, rating, tone = 'friendly', useEmojis = true, length = 'medium', customInstructions = '') {
  const name = reviewerName || 'Customer';
  const text = comment.toLowerCase();
  
  let greeting = 'Hello ' + name + ',';
  let body = '';
  let closing = 'Warm regards, The Team';
  
  // Establish greeting by tone
  if (tone === 'premium') {
    greeting = 'Dear ' + name + ',';
    closing = 'Sincerely, Customer Experience Lounge';
  } else if (tone === 'professional') {
    greeting = 'Dear ' + name + ',';
    closing = 'Best regards, Client Relations Team';
  } else if (tone === 'casual') {
    greeting = 'Hey ' + name + '!';
    closing = 'Cheers, Your Friends';
  }
  
  // Positive response generation
  if (rating >= 4) {
    if (tone === 'friendly') {
      const emojiCoffee = useEmojis ? ' ☕✨' : '';
      const emojiHeart = useEmojis ? ' ❤️' : '';
      body = `Thank you so much for the review! We are absolutely thrilled you enjoyed your experience with us.${emojiHeart} We work hard to create a wonderful environment, and we’re so glad it showed.${emojiCoffee}`;
    } else if (tone === 'premium') {
      const emojiGold = useEmojis ? ' ✨💎' : '';
      body = `We appreciate your feedback and thank you for taking the time to share your review. We are delighted that your time with us was flawless and aligned with our commitment to exceptional standards.${emojiGold} We look forward to welcoming you back.`;
    } else if (tone === 'professional') {
      body = `Thank you for your rating and comments. We appreciate your patronage and are pleased to know you had an excellent experience. Your feedback serves as a key motivation for our entire team.`;
    } else { // casual
      const emojiRock = useEmojis ? ' 🤘🔥' : '';
      body = `Thanks for the awesome review! You made our day. Stoked to hear that you had a great time here. Catch you again next time!${emojiRock}`;
    }
  } 
  // Neutral response generation
  else if (rating === 3) {
    if (tone === 'friendly') {
      body = `Thank you for sharing your thoughts! We appreciate the constructive feedback. We are glad you found aspects of your visit good, but we want to make it perfect next time. We’ll look into how we can improve our operations.`;
    } else if (tone === 'professional') {
      body = `We appreciate your honest feedback. A neutral review indicates we met some expectations but have room to grow. We will communicate your comments to our department heads to refine our customer satisfaction metrics.`;
    } else {
      body = `Thanks for letting us know! We’re happy you liked it overall, but we know we can do better. If you have any extra tips, hit us up!`;
    }
  } 
  // Negative response generation
  else {
    if (text.includes('telegram') || text.includes('crypto')) {
      return 'This review has been identified as automated promotion spam. Our automated system has flagged this with Google Support. No reply will be posted.';
    }
    
    if (tone === 'premium') {
      body = `We sincerely apologize for the inconvenience experienced during your recent engagement with our establishment. This is far from the premium standards we uphold. We wish to resolve this directly. Please contact our Client Relations Director so we may address this personally.`;
    } else if (tone === 'professional') {
      body = `We regret to read that you were dissatisfied with your experience. We take all feedback seriously and apologize for falling short. We would appreciate the opportunity to investigate this issue further. Please contact our support team at care@ai-reviewpilot.com.`;
    } else if (tone === 'friendly') {
      const emojiSad = useEmojis ? ' 🙏🥺' : '';
      body = `We are so incredibly sorry that we let you down! This is definitely not the standard we aim for.${emojiSad} We want to make this right immediately. Please reach out to us at support@ai-reviewpilot.com so we can help resolve this!`;
    } else { // casual
      body = `Oh no, really sorry about that. That's definitely not how we roll. Let us make this up to you – drop us an email and our team will get it sorted out asap!`;
    }
  }
  
  // Custom instructions parsing
  if (customInstructions) {
    if (customInstructions.toLowerCase().includes('satisfaction')) {
      body += ' We are 100% committed to your satisfaction.';
    }
    if (customInstructions.toLowerCase().includes('under 4 sentences') || customInstructions.toLowerCase().includes('short')) {
      // Keep it naturally concise
    }
  }
  
  // Handle reply length adjustments
  let finalReply = `${greeting}\n\n${body}\n\n${closing}`;
  
  if (length === 'short') {
    finalReply = `${greeting} Thank you for your review. We ${rating >= 4 ? 'are delighted you had a great experience!' : 'sincerely apologize for falling short and hope to make it right.'} ${closing}`;
  } else if (length === 'long') {
    let extraText = '';
    if (rating >= 4) {
      extraText = ' Customer feedback is the lifeblood of our business, and knowing that we succeeded in making your day bright is the absolute best reward we could ask for. We have shared your encouraging words with our entire staff, who were all smiles!';
    } else {
      extraText = ' Our management team meets weekly to review our operational guidelines and customer feedback. Your comments will be on our next agenda so we can put steps in place to ensure this issue is permanently corrected for all future guests.';
    }
    finalReply = `${greeting}\n\n${body}${extraText}\n\n${closing}`;
  }
  
  return finalReply;
}
