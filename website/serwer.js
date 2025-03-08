const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads

const app = express();
const PORT = 5000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON and form data
app.use(express.json());
const upload = multer(); // For handling multipart/form-data

// VirusTotal API key
const API_KEY = 'ebc3aa96b22e1cb1c1223acb0c72ddc09f766720cdfc580f0b514ec136161b5a'; // Replace with your VirusTotal API key

// Proxy endpoint for scanning a URL
app.post('/scan-url', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await axios.post(
      'https://www.virustotal.com/vtapi/v2/url/scan',
      null,
      {
        params: {
          apikey: API_KEY,
          url: url,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error scanning URL:', error);
    res.status(500).json({ error: 'Failed to scan URL' });
  }
});

// Proxy endpoint for scanning a file
app.post('/scan-file', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'File is required' });
  }

  try {
    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });

    const response = await axios.post(
      'https://www.virustotal.com/vtapi/v2/file/scan',
      formData,
      {
        params: {
          apikey: API_KEY,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error scanning file:', error);
    res.status(500).json({ error: 'Failed to scan file' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});