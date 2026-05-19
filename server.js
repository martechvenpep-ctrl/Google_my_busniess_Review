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
