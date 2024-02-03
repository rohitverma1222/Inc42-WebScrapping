import express from "express";
import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import cron from "node-cron";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Add the stealth plugin
puppeteerExtra.use(stealthPlugin());

let data = {
  trendingData: [
    {
      text: "Amazon Seller Appario Retail’s FY23 Revenue Falls 8.2% To INR 14,604.2 Cr But Profit Rises",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Appario-Retail-ftr.jpg",
    },
    {
      text: "Lessons From BYJU’S",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Weekly-NL-Lessons-From-BYJUS.png",
    },
    {
      text: "Peak XV-Backed CarDekho Buys Into Revv To Venture Into Shared Mobility Space",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Revv-Cardekho-Web.jpg",
    },
    {
      text: "Here’s How DrinkPrime Is Quenching The Thirst Of Indians For Safe Drinking Water",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/11/DrinkPrime.png",
    },
    {
      text: "Tax Filing Platform Clear’s FY23 Revenue Jumps Over 85% To Cross INR 100 Cr Mark",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Clear-FY23.png",
    },
    {
      text: "Startup Realm’s Changing Guard: Founders & CEOs Who Bid Farewell In 2023",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/FEATURE-2.jpg",
    },
    {
      text: "Ninjacart’s Rathnam Joins IAMAI To Chair Agri Panel; WhatsLoan’s Gouda As Co-Chair",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-design-83.png",
    },
    {
      text: "From EMotorad To PhiCommerce — Indian Startups Raised $62 Mn This Week",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Funding-Glore-dec.png",
    },
    {
      text: "Viacom18, Netflix, Other OTT Platforms To Challenge New Broadcasting Bill",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-design-85.png",
    },
    {
      text: "Jio, TM Forum Open Innovation Hub In Mumbai To Step Up Gen AI, LLM Play In Telecom Space",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Open-Forum-Web.jpg",
    },
    {
      text: "GVFL Partners With Brinc To Launch Multi-Stage Startup Accelerator",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Startup-Grant-Web.jpg",
    },
    {
      text: "Deepfakes Averse To Our Interests: YouTube India Head",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/youtube-depfakes-featured-.png",
    },
    {
      text: "New-Age Tech Stocks See A Mixed Week Despite Bull Run In Broader Market; Mamaearth Plunges",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Feature-11.jpg",
    },
    {
      text: "Yatra IPO: Issue Subscribed 0.31X On Day 3, Retail Portion Oversubscribed",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/09/yatra-IPO-featured-1.png",
    },
    {
      text: "From Data To Decisions: How Data Visualisation Drives Business Growth",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-2023-12-01T135810.271.jpeg",
    },
    {
      text: "What Metrics Indicate Healthy Growth For A Business?",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-2023-12-01T142455.785.jpeg",
    },
    {
      text: "How The Smartphone Will Change Indian Agriculture In 2024",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/11/Untitled-2023-11-25T230846.884.jpeg",
    },
    {
      text: "Games24x7 Partners Karnataka Govt To Launch Accelerator For Indian Gaming Startups",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/games24x7-kataka-featured-1.png",
    },
    {
      text: "Actor Ranveer Singh Joins D2C Sexual Wellness Brand Bold Care As New Co-Owner",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/boldcare-ranveer-singh-featured-.png",
    },
    {
      text: "UPI Transactions Cross 11 Bn Mark For Second Month In A Row In November",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/10/UPI-ft-2.png",
    },
    {
      text: "StrideOne Acquires Stake In Emobility Startup MoEVing To Offer New EV Financing Products",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Moeving-Web.jpg",
    },
    {
      text: "Titan-Owned CaratLane’s FY23 Sales Jump To INR 2,169 Cr, Profit Dips To INR 82 Cr",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/CaratLane-FY23.png",
    },
    {
      text: "The Big Moves Of 2023: A Look Back At The Biggest Acquisitions In The Startup Ecosystem",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/startup-acquisitions-india.jpg",
    },
    {
      text: "Zyla Health Bags $4 Mn To Boost Personalised Offerings For Chronic Patients",
      href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Zyla-Web.jpg",
    },
  ],
};
// Your Puppeteer script
const browser = await puppeteerExtra.launch({
  args: [
    "--disable-setuid-sandbox",
    "--no-sandbox",
    "--single-process",
    "--no-zygote",
  ],
  executablePath:
    process.env.NODE_ENV === "production"
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : puppeteer.executablePath(),
});

const page = await browser.newPage();
const getQuotes = async () => {

  // const page = await browser.newPage();
  try {
    await page.goto("https://inc42.com/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".main-menu-align-right", { visible: true });
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
      const trendingData = [
        {
          text: "Amazon Seller Appario Retail’s FY23 Revenue Falls 8.2% To INR 14,604.2 Cr But Profit Rises",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Appario-Retail-ftr.jpg",
        },
        {
          text: "Lessons From BYJU’S",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Weekly-NL-Lessons-From-BYJUS.png",
        },
        {
          text: "Peak XV-Backed CarDekho Buys Into Revv To Venture Into Shared Mobility Space",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Revv-Cardekho-Web.jpg",
        },
        {
          text: "Here’s How DrinkPrime Is Quenching The Thirst Of Indians For Safe Drinking Water",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/11/DrinkPrime.png",
        },
        {
          text: "Tax Filing Platform Clear’s FY23 Revenue Jumps Over 85% To Cross INR 100 Cr Mark",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Clear-FY23.png",
        },
        {
          text: "Startup Realm’s Changing Guard: Founders & CEOs Who Bid Farewell In 2023",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/FEATURE-2.jpg",
        },
        {
          text: "Ninjacart’s Rathnam Joins IAMAI To Chair Agri Panel; WhatsLoan’s Gouda As Co-Chair",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-design-83.png",
        },
        {
          text: "From EMotorad To PhiCommerce — Indian Startups Raised $62 Mn This Week",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Funding-Glore-dec.png",
        },
        {
          text: "Viacom18, Netflix, Other OTT Platforms To Challenge New Broadcasting Bill",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-design-85.png",
        },
        {
          text: "Jio, TM Forum Open Innovation Hub In Mumbai To Step Up Gen AI, LLM Play In Telecom Space",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Open-Forum-Web.jpg",
        },
        {
          text: "GVFL Partners With Brinc To Launch Multi-Stage Startup Accelerator",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Startup-Grant-Web.jpg",
        },
        {
          text: "Deepfakes Averse To Our Interests: YouTube India Head",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/youtube-depfakes-featured-.png",
        },
        {
          text: "New-Age Tech Stocks See A Mixed Week Despite Bull Run In Broader Market; Mamaearth Plunges",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Feature-11.jpg",
        },
        {
          text: "Yatra IPO: Issue Subscribed 0.31X On Day 3, Retail Portion Oversubscribed",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/09/yatra-IPO-featured-1.png",
        },
        {
          text: "From Data To Decisions: How Data Visualisation Drives Business Growth",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-2023-12-01T135810.271.jpeg",
        },
        {
          text: "What Metrics Indicate Healthy Growth For A Business?",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Untitled-2023-12-01T142455.785.jpeg",
        },
        {
          text: "How The Smartphone Will Change Indian Agriculture In 2024",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/11/Untitled-2023-11-25T230846.884.jpeg",
        },
        {
          text: "Games24x7 Partners Karnataka Govt To Launch Accelerator For Indian Gaming Startups",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/games24x7-kataka-featured-1.png",
        },
        {
          text: "Actor Ranveer Singh Joins D2C Sexual Wellness Brand Bold Care As New Co-Owner",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/boldcare-ranveer-singh-featured-.png",
        },
        {
          text: "UPI Transactions Cross 11 Bn Mark For Second Month In A Row In November",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/10/UPI-ft-2.png",
        },
        {
          text: "StrideOne Acquires Stake In Emobility Startup MoEVing To Offer New EV Financing Products",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Moeving-Web.jpg",
        },
        {
          text: "Titan-Owned CaratLane’s FY23 Sales Jump To INR 2,169 Cr, Profit Dips To INR 82 Cr",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/CaratLane-FY23.png",
        },
        {
          text: "The Big Moves Of 2023: A Look Back At The Biggest Acquisitions In The Startup Ecosystem",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/startup-acquisitions-india.jpg",
        },
        {
          text: "Zyla Health Bags $4 Mn To Boost Personalised Offerings For Chronic Patients",
          href: "https://cdn.inc42.com/cdn-cgi/image/width=210,height=158,fit=crop,quality=80/wp-content/uploads/2023/12/Zyla-Web.jpg",
        },
      ]
      return { headline, slickData, smallheadlineData, trendingData };
    });
    // Save data to a file
    data = quotes;
    return quotes;
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    // await browser.close();
  }
};
const getVideo = async () => {
  await page.goto("https://inc42.com/videos/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".main-menu-align-right", { visible: true });
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

    return { headline, slickData, smallheadlineData };
  });
  // Save data to a file
  data = quotes;
  return quotes;
};

const getNews = async () => {
  await page.goto("https://inc42.com/buzz/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".main-menu-align-right", { visible: true });
    const quotes = await page.evaluate(() => {
      
      const smallHeadline = document.querySelectorAll(".horizontal-card");
      const smallheadlineData = [];
      smallHeadline.forEach((news) => {
        const quoteElements = news.querySelectorAll(".card-image");
        // const resultArray = [];
        let text="";
        let href=""
        quoteElements.forEach((newsdata) => {
          text = newsdata.querySelector("a").getAttribute("title");
          href = newsdata.querySelector("a").getAttribute("href"); // Corrected line
          // resultArray.push({ text, href });
        });
        smallheadlineData.push({text,href});
      });

      
      return { smallheadlineData };
    });
    return quotes;
};
const getInDepth = async () => {
  await page.goto("https://inc42.com/features/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".main-menu-align-right", { visible: true });
    const quotes = await page.evaluate(() => {
      
      const smallHeadline = document.querySelectorAll(".horizontal-card");
      const smallheadlineData = [];
      smallHeadline.forEach((news) => {
        const quoteElements = news.querySelectorAll(".card-image");
        let text="";
        let href=""
        quoteElements.forEach((newsdata) => {
          text = newsdata.querySelector("a").getAttribute("title");
          href = newsdata.querySelector("a").getAttribute("href"); // Corrected line
          // resultArray.push({ text, href });
        });
        smallheadlineData.push({text,href});
      });

      
      return { smallheadlineData };
    });
    return quotes;
};
const getStartup = async () => {
  await page.goto("https://inc42.com/startups/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".main-menu-align-right", { visible: true });
    const quotes = await page.evaluate(() => {
      
      const smallHeadline = document.querySelectorAll(".horizontal-card");
      const smallheadlineData = [];
      smallHeadline.forEach((news) => {
        let text="";
        let href=""
        quoteElements.forEach((newsdata) => {
          text = newsdata.querySelector("a").getAttribute("title");
          href = newsdata.querySelector("a").getAttribute("href"); // Corrected line
          // resultArray.push({ text, href });
        });
        smallheadlineData.push({text,href});
      });

      
      return { smallheadlineData };
    });
    return quotes;
};
const getResources = async () => {
  await page.goto("https://inc42.com/resources/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".main-menu-align-right", { visible: true });
    const quotes = await page.evaluate(() => {
      
      const smallHeadline = document.querySelectorAll(".horizontal-card");
      const smallheadlineData = [];
      smallHeadline.forEach((news) => {
        const quoteElements = news.querySelectorAll(".card-image");
        let text="";
        let href=""
        quoteElements.forEach((newsdata) => {
          text = newsdata.querySelector("a").getAttribute("title");
          href = newsdata.querySelector("a").getAttribute("href"); // Corrected line
          // resultArray.push({ text, href });
        });
        smallheadlineData.push({text,href});
      });

      
      return { smallheadlineData };
    });
    return quotes;
};

// cron.schedule("0 * * * *", async () => { // Every hour at minute 0
//   await getQuotes();
// });
app.get("/", async (req, res) => {
  try {
    const quotesData = await getQuotes(); // Assuming getQuotes now returns data
    res.json(quotesData); // Send the data as JSON
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});

app.get("/video", async (req, res) => {
  try {
    const videoData = await getVideo(); // Use the correct function to fetch video data
    res.json(videoData); // Assuming this function returns the video data directly
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).json({ error: "Failed to fetch video data" });
  }
});
app.get("/news", async (req, res) => {
  try {
    const currData = await getNews();
    res.json(currData); 
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).json({ error: "Failed to fetch video data" });
  }
});
app.get("/indepth", async (req, res) => {
  try {
    const currData = await getInDepth();
    res.json(currData); 
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).json({ error: "Failed to fetch video data" });
  }
});
app.get("/startup", async (req, res) => {
  try {
    const currData = await getStartup();
    res.json(currData); 
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).json({ error: "Failed to fetch video data" });
  }
});
app.get("/resources", async (req, res) => {
  try {
    const currData = await getResources();
    res.json(currData); 
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).json({ error: "Failed to fetch video data" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
