// server.js

import express from 'express';
import puppeteer from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import cron from 'node-cron';

const app = express();
const port = process.env.PORT || 3000;

// Add the stealth plugin
puppeteerExtra.use(stealthPlugin());

// Your Puppeteer script
const getQuotes = async () => {
  const browser = await puppeteerExtra.launch({
    headless: "new", // Set to false for debugging
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://inc42.com/', { waitUntil: 'domcontentloaded' });

    // Rest of your scraping logic
    await page.waitForSelector(".wru-image-box", { visible: true });
    const quotes = await page.evaluate(() => {
      const firstData = document.querySelector(".row");
      const bigcardData = firstData.querySelectorAll(".card-image");
      const headline = [];
      bigcardData.forEach((news) => {
        const text = news.querySelector("a").getAttribute("title");
        const href = news.querySelector("img").getAttribute("data-src"); // Corrected line

        headline.push({ text, href });
      });

      const slick = document.querySelectorAll(".slick-track");
      const slickData = [];
      slick.forEach((newsdata) => {
        const bigcardData = newsdata.querySelectorAll(".card-image");
        const headline = new Set(); // Use a Set to store unique values
        const uniqueheadlin = [];

        bigcardData.forEach((news) => {
          const text = news.querySelector("a").getAttribute("title");
          const href = news.querySelector("img").getAttribute("data-src");

          // Check if the combination of text and href is already in the Set
          const uniqueKey = `${text}-${href}`;

          if (!headline.has(uniqueKey)) {
            headline.add(uniqueKey);
            uniqueheadlin.push({ text, href });
          }
        });
        const uniqueHeadlineArray = [...headline];

        slickData.push(uniqueheadlin);
      });
      const smallHeadline = document.querySelectorAll(".inc42-feed-content");
      const smallheadlineData = [];
      smallHeadline.forEach((news) => {
        const quoteElements = news.querySelectorAll(".card-image");
        const resultArray = [];
        quoteElements.forEach((newsdata) => {
          const text = newsdata.querySelector("a").getAttribute("title");
          const href = newsdata.querySelector("img").getAttribute("data-src"); // Corrected line
          resultArray.push({ text, href });
        });
        smallheadlineData.push(resultArray);
      });

      const trendingTag = document.querySelectorAll(".wru-image-box");
      const trendingData = [];

      trendingTag.forEach((news) => {
        const text = news.querySelector("img").getAttribute("alt");
        const href = news.querySelector("img").getAttribute("src"); // Corrected line
        trendingData.push({ text, href });
      });
      return { headline, slickData, smallheadlineData, trendingData };
    });
    // Save data to a file
    fs.writeFileSync('db.json', JSON.stringify(quotes, null, 2));
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
};

// Schedule the scraping task using cron
cron.schedule('* * * * *', () => {
  getQuotes();
});

// Set up a simple endpoint to trigger the scraping manually (optional)
app.get('/scrape', (req, res) => {
  getQuotes();
  // res.send('Scraping initiated.');

  try {
    const data = fs.readFileSync('db.json', 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error('Error reading the file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
