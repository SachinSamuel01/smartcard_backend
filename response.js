const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { crawlWeb } = require('./webCrawler'); // Import the web crawling component
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/query', async (req, res) => {
  const { query } = req.body;

  try {
    const result = await model.generateContent([query]);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/crawl', async (req, res) => {
  const { urls } = req.body;

  if (!urls || urls.length === 0) {
    return res.status(400).json({ error: 'URLs are required' });
  }

  try {
    const results = await crawlWeb(urls);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// app.post('/query', async (req, res) => {
//   const { query } = req.body;

//   try {
//     const result = await model.generateContent([query]);
//     const responseText = result.response.text();

//     res.json({ response: responseText });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/crawl', async (req, res) => {
//   const { urls } = req.body;

//   try {
//     const results = await Promise.all(
//       urls.map(async (url) => {
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);
//         const content = $('body').text().replace(/\s+/g, ' ').trim();
//         return { url, content };
//       })
//     );

//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });