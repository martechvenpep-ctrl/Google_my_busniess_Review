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

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all GET requests to index.html for React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
