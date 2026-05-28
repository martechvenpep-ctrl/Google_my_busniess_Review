import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle Facebook Data Deletion Callback (POST)
app.post('/api/facebook-data-deletion', (req, res) => {
  res.json({
    url: 'https://googlemybusniessreview-production.up.railway.app/data-deletion.html',
    confirmation_code: 'del_' + Math.random().toString(36).substring(2, 15)
  });
});

// Exchange Facebook Authorization Code for Access Token securely
app.post('/api/facebook-token', async (req, res) => {
  const { code, redirectUri } = req.body;
  const appId = '825801386910318';
  const appSecret = process.env.FACEBOOK_CLIENT_SECRET;

  if (!appSecret) {
    return res.status(400).json({ error: 'FACEBOOK_CLIENT_SECRET environment variable is not configured.' });
  }

  try {
    const url = `https://graph.facebook.com/v25.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    const errText = await response.text();
    return res.status(response.status).json({ error: 'Graph API error', details: errText });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error during exchange' });
  }
});

// Facebook Webhook Verification (GET) and Event Receiver (POST)
app.get('/api/facebook-webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = 'my_facebook_webhook_verify_token_12345';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
});

app.post('/api/facebook-webhook', (req, res) => {
  const body = req.body;
  console.log('Received Webhook Event:', JSON.stringify(body, null, 2));

  // Process Facebook Page Webhook payload (subscription to the 'ratings' field)
  if (body.object === 'page') {
    body.entry?.forEach(entry => {
      const pageId = entry.id;
      entry.changes?.forEach((change) => {
        if (change.field === 'ratings') {
          const ratingEvent = change.value;
          console.log(`[Meta Webhook] New page rating received for page ${pageId}:`, {
            reviewer: ratingEvent.reviewer_name || 'Facebook User',
            recommendation: ratingEvent.recommendation_type,
            comment: ratingEvent.review_text
          });
          // Process event:
          // 1. Deduplicate & save review in Database (facebook_reviews)
          // 2. Query AI review processor (check sentiment score & brand tone)
          // 3. If auto-reply is active, trigger POST https://graph.facebook.com/v25.0/{comment_id}/comments
        }
      });
    });
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(200).send('EVENT_RECEIVED');
});

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all GET requests to index.html for React SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
