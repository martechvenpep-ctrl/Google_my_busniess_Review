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

// ─── Constants ────────────────────────────────────────────────────────────────
const FB_APP_ID     = '825801386910318';
const FB_CONFIG_ID  = '966098999669245';
const FB_GRAPH_VER  = 'v25.0';

// Read secret from any of the common Railway variable names
const getFbSecret = () =>
  process.env.FACEBOOK_CLIENT_SECRET ||
  process.env.FACEBOOK_APP_SECRET    ||
  process.env.FB_APP_SECRET          ||
  process.env.META_APP_SECRET        ||
  null;

// Build the redirect URI from the incoming request host
const getRedirectUri = (req) => {
  const host     = req.get('host') || '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}/api/facebook/callback`;
};

// ─── Health / ping ────────────────────────────────────────────────────────────
app.get('/api/ping', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ─── Debug: show which env vars are present (no secrets exposed) ──────────────
app.get('/api/facebook/debug', (req, res) => {
  const secret = getFbSecret();
  res.json({
    app_id          : FB_APP_ID,
    has_secret      : !!secret,
    secret_length   : secret ? secret.length : 0,
    secret_preview  : secret ? secret.substring(0, 4) + '...' + secret.slice(-4) : 'NOT SET',
    redirect_uri    : getRedirectUri(req),
    env_fb_keys     : Object.keys(process.env).filter(k =>
      k.toLowerCase().includes('facebook') ||
      k.toLowerCase().includes('fb_')      ||
      k.toLowerCase().includes('meta')
    ),
    node_env        : process.env.NODE_ENV || 'not set'
  });
});

// ─── Step 1: Initiate Facebook OAuth (server-side, code flow) ─────────────────
app.get('/api/facebook/login', (req, res) => {
  const redirectUri = getRedirectUri(req);

  const params = new URLSearchParams({
    client_id     : FB_APP_ID,
    redirect_uri  : redirectUri,
    scope         : 'pages_show_list,pages_read_engagement,pages_manage_metadata,pages_manage_engagement,public_profile',
    config_id     : FB_CONFIG_ID,
    response_type : 'code',
    state         : 'facebook'
  });

  const loginUrl = `https://www.facebook.com/${FB_GRAPH_VER}/dialog/oauth?${params.toString()}`;
  console.log('[Meta OAuth] Initiating login → redirectUri:', redirectUri);
  console.log('[Meta OAuth] Full login URL:', loginUrl);
  res.redirect(loginUrl);
});

// ─── Step 2: Receive auth code and exchange for access token ──────────────────
app.get('/api/facebook/callback', async (req, res) => {
  const { code, error, error_description, state } = req.query;
  const redirectUri = getRedirectUri(req);
  const appSecret   = getFbSecret();

  console.log('[Meta Callback] Received query:', JSON.stringify({ code: code ? '***' : undefined, error, state }));

  // Facebook returned an error (user denied, misconfigured app, etc.)
  if (error) {
    const msg = encodeURIComponent(error_description || error || 'unknown_error');
    console.error('[Meta Callback] Facebook returned error:', error, error_description);
    return res.redirect(`/#error=${error}&details=${msg}`);
  }

  if (!code) {
    console.warn('[Meta Callback] No code received.');
    return res.redirect('/#error=missing_code');
  }

  // If App Secret is missing, activate developer sandbox mode
  if (!appSecret) {
    console.warn('[Meta Callback] FACEBOOK_CLIENT_SECRET not set — using sandbox mode.');
    const sandboxToken = `SANDBOX_TOKEN_${Date.now()}`;
    return res.redirect(`/#access_token=${sandboxToken}&state=facebook`);
  }

  // Exchange authorization code → user access token
  try {
    const tokenParams = new URLSearchParams({
      client_id     : FB_APP_ID,
      client_secret : appSecret,
      redirect_uri  : redirectUri,
      code          : code
    });

    const tokenUrl = `https://graph.facebook.com/${FB_GRAPH_VER}/oauth/access_token?${tokenParams.toString()}`;
    console.log('[Meta Callback] Exchanging code for token…');

    const tokenRes = await fetch(tokenUrl);
    const tokenText = await tokenRes.text();

    if (!tokenRes.ok) {
      console.error('[Meta Callback] Token exchange failed:', tokenText);
      return res.redirect(`/#error=exchange_failed&details=${encodeURIComponent(tokenText)}`);
    }

    const tokenData = JSON.parse(tokenText);
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[Meta Callback] No access_token in response:', tokenText);
      return res.redirect(`/#error=no_token&details=${encodeURIComponent(tokenText)}`);
    }

    console.log('[Meta Callback] Token acquired. Fetching pages…');

    // Optional: log how many pages this token has access to
    try {
      const pagesRes  = await fetch(`https://graph.facebook.com/${FB_GRAPH_VER}/me/accounts?access_token=${accessToken}`);
      const pagesData = await pagesRes.json();
      console.log(`[Meta Callback] Pages found: ${pagesData?.data?.length ?? 0}`);
    } catch (e) {
      console.warn('[Meta Callback] Pages pre-fetch failed (non-fatal):', e.message);
    }

    // Redirect back to SPA with token in hash
    return res.redirect(`/#access_token=${accessToken}&state=facebook`);

  } catch (err) {
    console.error('[Meta Callback] Unexpected error:', err.message);
    return res.redirect(`/#error=server_error&details=${encodeURIComponent(err.message)}`);
  }
});

// ─── Proxy: Fetch connected Facebook Pages (avoids CORS in browser) ───────────
app.get('/api/facebook/pages', async (req, res) => {
  const { accessToken } = req.query;

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing accessToken' });
  }

  // Sandbox mode
  if (accessToken.startsWith('SANDBOX_TOKEN_')) {
    return res.json({ data: [], sandbox: true });
  }

  try {
    const url = `https://graph.facebook.com/${FB_GRAPH_VER}/me/accounts?access_token=${accessToken}`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!response.ok) {
      console.error('[Pages API] Graph error:', JSON.stringify(data));
      return res.status(response.status).json({ error: 'Graph API error', details: data });
    }

    return res.json(data);
  } catch (err) {
    console.error('[Pages API] Internal error:', err.message);
    return res.status(500).json({ error: 'Internal server error fetching pages' });
  }
});

// ─── Proxy: Fetch Facebook Page Ratings/Reviews ───────────────────────────────
app.get('/api/facebook/ratings', async (req, res) => {
  const { pageId, accessToken } = req.query;

  if (!pageId || !accessToken) {
    return res.status(400).json({ error: 'Missing pageId or accessToken' });
  }

  if (accessToken.startsWith('SANDBOX_TOKEN_')) {
    return res.json({ data: [], sandbox: true });
  }

  try {
    const url = `https://graph.facebook.com/${FB_GRAPH_VER}/${pageId}/ratings?fields=review_text,recommendation_type,created_time,reviewer,open_graph_story&access_token=${accessToken}`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!response.ok) {
      console.error('[Ratings API] Graph error:', JSON.stringify(data));
      return res.status(response.status).json({ error: 'Graph API error', details: data });
    }

    return res.json(data);
  } catch (err) {
    console.error('[Ratings API] Internal error:', err.message);
    return res.status(500).json({ error: 'Internal server error fetching ratings' });
  }
});

// ─── Proxy: Post a reply comment to a Facebook review ────────────────────────
// Facebook Graph API requires x-www-form-urlencoded and cannot be called from
// the browser due to CORS restrictions — so we proxy it here on the server.
app.post('/api/facebook/reply', async (req, res) => {
  const { reviewId, message, pageAccessToken } = req.body;

  if (!reviewId || !message || !pageAccessToken) {
    return res.status(400).json({ error: 'Missing reviewId, message, or pageAccessToken' });
  }

  if (pageAccessToken.startsWith('SANDBOX_TOKEN_') || pageAccessToken === 'MOCK_PAGE_TOKEN') {
    console.log('[Reply Proxy] Sandbox mode — simulating successful reply.');
    return res.json({ id: `sandbox_comment_${Date.now()}`, sandbox: true });
  }

  try {
    const url = `https://graph.facebook.com/${FB_GRAPH_VER}/${reviewId}/comments`;
    const body = new URLSearchParams({ message, access_token: pageAccessToken });

    console.log(`[Reply Proxy] Posting reply to review ${reviewId}…`);

    const fbRes  = await fetch(url, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
      body    : body.toString()
    });

    const fbData = await fbRes.json();

    if (!fbRes.ok) {
      console.error('[Reply Proxy] Facebook API error:', JSON.stringify(fbData));
      return res.status(fbRes.status).json({ error: 'Facebook API error', details: fbData });
    }

    console.log('[Reply Proxy] Reply posted successfully:', fbData.id);
    return res.json(fbData); // { "id": "comment_id" }
  } catch (err) {
    console.error('[Reply Proxy] Internal error:', err.message);
    return res.status(500).json({ error: 'Internal server error posting reply' });
  }
});

// ─── Token exchange endpoint (called from frontend) ───────────────────────────
app.post('/api/facebook-token', async (req, res) => {
  const { code, redirectUri } = req.body;
  const appSecret = getFbSecret();

  if (!appSecret) {
    return res.status(400).json({ error: 'FACEBOOK_CLIENT_SECRET is not configured on the server.' });
  }

  try {
    const params = new URLSearchParams({
      client_id     : FB_APP_ID,
      client_secret : appSecret,
      redirect_uri  : redirectUri,
      code          : code
    });

    const url      = `https://graph.facebook.com/${FB_GRAPH_VER}/oauth/access_token?${params.toString()}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }

    const errText = await response.text();
    return res.status(response.status).json({ error: 'Graph API error', details: errText });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error during token exchange' });
  }
});

// ─── Facebook Webhook ─────────────────────────────────────────────────────────
const WEBHOOK_VERIFY_TOKEN = 'my_facebook_webhook_verify_token_12345';

app.get('/api/facebook-webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('[Webhook] Verified successfully.');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post('/api/facebook-webhook', (req, res) => {
  const body = req.body;
  console.log('[Webhook] Event received:', JSON.stringify(body, null, 2));

  if (body.object === 'page') {
    body.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        if (change.field === 'ratings') {
          console.log(`[Webhook] New rating for page ${entry.id}:`, change.value);
        }
      });
    });
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(200).send('EVENT_RECEIVED');
});

// ─── Facebook Data Deletion Callback ─────────────────────────────────────────
app.post('/api/facebook-data-deletion', (_req, res) => {
  res.json({
    url               : 'https://googlemybusniessreview-production.up.railway.app/data-deletion.html',
    confirmation_code : 'del_' + Math.random().toString(36).substring(2, 15)
  });
});

// ─── Serve Vite SPA ───────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const secret = getFbSecret();
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔑 Facebook App ID  : ${FB_APP_ID}`);
  console.log(`🔐 FB Secret loaded : ${secret ? 'YES (' + secret.length + ' chars)' : '❌ NOT SET — set FACEBOOK_CLIENT_SECRET in Railway!'}`);
  console.log(`🌍 NODE_ENV         : ${process.env.NODE_ENV || 'development'}`);
});
