const express = require('express');
const cors = require('cors');
const path = require('path');

// Compatible fetch for Node < 18
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;

app.use(cors());

// Serve frontend from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint to dialer API
app.get('/submit-did', async (req, res) => {
  const did = req.query.did?.trim();

  if (!/^\d{10}$/.test(did)) {
    return res.status(400).send('Invalid DID. Please enter 10 digits.');
  }

  const apiUrl = `https://ahl.tldcrm.com/api/public/dialer/ready/${encodeURIComponent(did)}?dup=true&adg=true`;

  try {
    const apiResponse = await fetch(apiUrl);
    const result = await apiResponse.text();
    res.send(result);
  } catch (err) {
    console.error('❌ API call failed:', err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
