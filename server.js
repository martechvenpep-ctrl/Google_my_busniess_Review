import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', true);
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

// Secure Backend Route to initiate Meta Login using response_type=code
app.get('/api/facebook/login', (req, res) => {
  const host = req.get('host');
  const protocol = host.includes('localhost') ? req.protocol : 'https';
  const redirectUri = `${protocol}://${host}/api/facebook/callback`;
  const appId = '825801386910318';
  const configId = '966098999669245';
  
  const loginUrl = `https://www.facebook.com/v25.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_show_list,pages_read_engagement,pages_manage_metadata,pages_manage_engagement,public_profile&config_id=${configId}&response_type=code&state=facebook`;
  
  console.log('[Meta OAuth] Redirecting to:', loginUrl);
  res.redirect(loginUrl);
});

// Secure Backend Callback Route to handle temporary OAuth authorization code
app.get('/api/facebook/callback', async (req, res) => {
  const code = req.query.code;
  const host = req.get('host');
  const protocol = host.includes('localhost') ? req.protocol : 'https';
  const redirectUri = `${protocol}://${host}/api/facebook/callback`;
  const appId = '825801386910318';
  const appSecret = process.env.FACEBOOK_CLIENT_SECRET;

  if (!code) {
    console.warn('[Meta OAuth] Authorization code is missing.');
    return res.redirect('/#error=missing_code');
  }

  // Sandbox fallback flow if App Secret is not configured in environment variables
  if (!appSecret) {
    console.warn('[Meta OAuth] FACEBOOK_CLIENT_SECRET environment variable is missing. Activating Sandbox flow.');
    const sandboxToken = 'EAAO825801386910318_SANDBOX_TOKEN_12345';
    return res.redirect(`/#access_token=${sandboxToken}&state=facebook`);
  }

  try {
    const tokenUrl = `https://graph.facebook.com/v25.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;
    const tokenResponse = await fetch(tokenUrl);
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      // Query Meta's Graph API to fetch pages securely in the backend
      try {
        const pagesUrl = `https://graph.facebook.com/v25.0/me/accounts?access_token=${accessToken}`;
        const pagesResponse = await fetch(pagesUrl);
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          console.log(`[Meta OAuth] Successfully connected and retrieved ${pagesData.data?.length || 0} pages securely.`);
        }
      } catch (pagesErr) {
        console.error('[Meta OAuth] Error fetching connected pages inside callback:', pagesErr);
      }

      return res.redirect(`/#access_token=${accessToken}&state=facebook`);
    } else {
      const errText = await tokenResponse.text();
      console.error('[Meta OAuth] Code exchange failed:', errText);
      return res.redirect('/#error=exchange_failed');
    }
  } catch (err) {
    console.error('[Meta OAuth] Internal error during callback exchange:', err);
    return res.redirect('/#error=server_error');
  }
});

// Fetch connected Facebook Pages securely via backend proxy (avoids browser CORS issues)
app.get('/api/facebook/pages', async (req, res) => {
  const { accessToken } = req.query;
  if (!accessToken) {
    return res.status(400).json({ error: 'Missing accessToken' });
  }

  // Sandbox fallback if using mock sandbox token
  if (accessToken.includes('SANDBOX_TOKEN')) {
    console.log('[Meta Graph API] Loading sandbox pages mock dataset.');
    // Return standard mock pages for previewing
    return res.json({
      data: [
        { id: '694955550368673', name: 'SAAS GAMA', access_token: accessToken, category: 'Software' },
        { id: '825801386910318', name: 'Venpep Digital Solutions', access_token: accessToken, category: 'Marketing Agency' },
        { id: '951048627103818', name: 'AI ReviewPilot Support Page', access_token: accessToken, category: 'Consulting Agency' }
      ]
    });
  }

  try {
    const url = `https://graph.facebook.com/v25.0/me/accounts?access_token=${accessToken}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    const errText = await response.text();
    return res.status(response.status).json({ error: 'Graph API error', details: errText });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error fetching pages' });
  }
});

// Fetch Facebook Page Ratings/Reviews securely via backend proxy (avoids browser CORS issues)
app.get('/api/facebook/ratings', async (req, res) => {
  const { pageId, accessToken } = req.query;
  if (!pageId || !accessToken) {
    return res.status(400).json({ error: 'Missing pageId or accessToken' });
  }

  // Sandbox fallback if using mock sandbox token
  if (accessToken.includes('SANDBOX_TOKEN')) {
    console.log('[Meta Graph API] Loading sandbox ratings mock dataset.');
    // Returns mock reviews for previewing
    return res.json({
      data: [
        {
          reviewId: "fb-rev-101",
          reviewer: { displayName: "John Doe", profilePhotoUrl: null },
          recommendation_type: "positive",
          review_text: "Absolutely love the review automation features! It makes managing customer relations a breeze.",
          created_time: new Date(Date.now() - 3600000 * 2).toISOString(),
          reply_message: "",
          synced_at: ""
        },
        {
          reviewId: "fb-rev-102",
          reviewer: { displayName: "Sarah Jenkins", profilePhotoUrl: null },
          recommendation_type: "negative",
          review_text: "I experienced a login issue where the oauth token expired, and it took a long time to reconnect. Need better handling.",
          created_time: new Date(Date.now() - 3600000 * 6).toISOString(),
          reply_message: "",
          synced_at: ""
        },
        {
          reviewId: "fb-rev-103",
          reviewer: { displayName: "Michael Chang", profilePhotoUrl: null },
          recommendation_type: "positive",
          review_text: "Great dashboard support and analytics widgets. Very premium UI aesthetics!",
          created_time: new Date(Date.now() - 86400000).toISOString(),
          reply_message: "Thank you for your feedback! We are thrilled that you like the UI.",
          synced_at: new Date(Date.now() - 86000000).toISOString()
        },
        {
          reviewId: "fb-rev-104",
          reviewer: { displayName: "Emily Watson", profilePhotoUrl: null },
          recommendation_type: "positive",
          review_text: "AI reply helper is highly professional. Deducts hours of copy-pasting for my team daily.",
          created_time: new Date(Date.now() - 172800000).toISOString(),
          reply_message: "",
          synced_at: ""
        }
      ]
    });
  }

  try {
    const url = `https://graph.facebook.com/v25.0/${pageId}/ratings?fields=review_text,recommendation_type,created_time,reviewer,open_graph_story&access_token=${accessToken}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    const errText = await response.text();
    return res.status(response.status).json({ error: 'Graph API error', details: errText });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error fetching ratings' });
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
