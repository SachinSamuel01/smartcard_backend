const axios = require('axios');
const cheerio = require('cheerio');

const crawlWeb = async (urls) => {
  try {
    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const { data } = await axios.get(url);
          const $ = cheerio.load(data);
          const content = $('body').text().replace(/\s+/g, ' ').trim();
          return { url, content };
        } catch (error) {
          console.error(`Error fetching URL ${url}:`, error);
          return { url, content: `Error fetching URL: ${error.message}` };
        }
      })
    );
    return results;
  } catch (error) {
    throw new Error(`Error crawling URLs: ${error.message}`);
  }
};

module.exports = { crawlWeb };