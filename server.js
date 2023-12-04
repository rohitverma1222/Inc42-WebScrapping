import express from "express";
import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Add the stealth plugin
puppeteerExtra.use(stealthPlugin());

let data = {
  headline: [
    {
      text: "What Metrics Indicate Healthy Growth For A Business?",
      href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Untitled-2023-12-01T142455.785-490x360.jpeg",
    },
    {
      text: "From Data To Decisions: How Data Visualisation Drives Business Growth",
      href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Untitled-2023-12-01T135810.271-490x360.jpeg",
    },
    {
      text: "New-Age Tech Stocks See A Mixed Week Despite Bull Run In Broader Market; Mamaearth Plunges",
      href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Feature-11-490x360.jpg",
    },
  ],
  slickData: [
    [
      {
        text: "VCs Now Avoid Founders Who Chase Growth At All Costs: Prime Venture Partners’ Sanjay Swamy",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/07/Moneyball-Prime-Venture-Partners-ftr-490x367.png",
      },
      {
        text: "Decoding Bharat Innovation Fund’s $100 Mn Deeptech Investment Play In India",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/06/Moneyball-space-tech-ftr-490x367.png",
      },
      {
        text: "Avaana Capital On Its Sustainability Thesis And India’s Climate Tech Investment Opportunity",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/06/MOneyball-Avaana-Capital-ftr-490x367.png",
      },
      {
        text: "RTP Global’s Nishit Garg On The VC Firm’s Fund IV, India Thesis, Exits & More",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/RTP-Global-ftr-490x367.jpg",
      },
      {
        text: "Deepak Padaki On Catamaran Ventures’ India Investment Playbook",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/10/feature-1-490x367.jpg",
      },
      {
        text: "Wipro Consumer Care Ventures’ Sumit Keshan On Growth Of Indian CVCs, D2C Ecosystem And More",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/09/Moneyball-Ankur-Pahwa-ftr-490x367.png",
      },
    ],
    [
      {
        text: "How Third-Party Logistics Players Are Changing The Face Of Traditional Enterprises",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/Emiza_Feature-1-490x367.jpg",
      },
      {
        text: "Build Or Buy? How Tech Startups Can Collaborate And Customise To Corner Success",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/Build-to-Buy_Feature-490x367.jpg",
      },
      {
        text: "How WhatsApp Commerce Is Enabling Traveltech Startups To Rewrite Their Communication Playbook",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/Karix-Traveltech-ftr-490x367.jpg",
      },
      {
        text: "Here’s How DrinkPrime Is Quenching The Thirst Of Indians For Safe Drinking Water",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/DrinkPrime-490x367.png",
      },
      {
        text: "CoLab Showcase 2023 Brings Together D2C Stakeholders To Discuss The Future Of F&B Brands In India",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Post-Event_Feature-Image-490x367.jpg",
      },
      {
        text: "How ShakeDeal’s Tech Transformed Industrial Procurement For 10K+ MSMEs, 250+ Enterprises",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/ShakeDeal-ftr-490x367.png",
      },
      {
        text: "How Sarathi Healthcare’s Holistic Care Approach Is Elevating The Lives of Senior Citizens In Rajasthan",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/Sarathi_Feature-Image-490x367.jpg",
      },
      {
        text: "How CarDekho’s Rupyy Is Democratising India’s Auto Loans Landscape",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/Rupyy-profile-01-490x367.jpg",
      },
    ],
    [
      {
        text: "HealthTech",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/healthtech.png",
      },
      {
        text: "AgriTech",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/agritech.png",
      },
      {
        text: "IT",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/it.png",
      },
      {
        text: "Ecommerce",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/ecommerce.png",
      },
      {
        text: "Electric Vehicles",
        href: "https://cdn.inc42.com/wp-content/uploads/2022/05/electric.png",
      },
      {
        text: "FinTech",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/fintech.png",
      },
      {
        text: "Consumer Internet",
        href: "https://cdn.inc42.com/wp-content/uploads/2022/05/consumer-internet.png",
      },
      {
        text: "Retail",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/Retail.png",
      },
      {
        text: "EdTech",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/edtech.png",
      },
      {
        text: "EnterpriseTech",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/enterprisetech.png",
      },
      {
        text: "Logistics",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/logistics.png",
      },
      {
        text: "CleanTech",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/cleantech.png",
      },
      {
        text: "TravelTech",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/05/traveltech.png",
      },
    ],
  ],
  smallheadlineData: [
    [
      {
        text: "Lessons From BYJU’S",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Weekly-NL-Lessons-From-BYJUS-490x367.png",
      },
      {
        text: "Amazon Seller Appario Retail’s FY23 Revenue Falls 8.2% To INR 14,604.2 Cr But Profit Rises",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Appario-Retail-ftr-490x367.jpg",
      },
      {
        text: "GVFL Partners With Brinc To Launch Multi-Stage Startup Accelerator",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Startup-Grant-Web-490x367.jpg",
      },
      {
        text: "Here’s How DrinkPrime Is Quenching The Thirst Of Indians For Safe Drinking Water",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/DrinkPrime-490x367.png",
      },
    ],
    [
      {
        text: "Jio, TM Forum Open Innovation Hub In Mumbai To Step Up Gen AI, LLM Play In Telecom Space",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Open-Forum-Web-490x367.jpg",
      },
      {
        text: "Indian Startup FY23 Financials Tracker: Tracking The Financial Performance Of Top Startups",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/feature-17-490x367.jpg",
      },
      {
        text: "Tax Filing Platform Clear’s FY23 Revenue Jumps Over 85% To Cross INR 100 Cr Mark",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Clear-FY23-490x367.png",
      },
      {
        text: "Viacom18, Netflix, Other OTT Platforms To Challenge New Broadcasting Bill",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Untitled-design-85-490x367.png",
      },
    ],
    [
      {
        text: "CarDekho Acquires A Majority Stake In Revv To Venture Into Shared Mobility Space",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Revv-Cardekho-Web-490x367.jpg",
      },
      {
        text: "From EMotorad To PhiCommerce — Indian Startups Raised $62 Mn This Week",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Funding-Glore-dec-490x367.png",
      },
      {
        text: "Ninjacart’s Rathnam Joins IAMAI To Chair Agri Panel; WhatsLoan’s Gouda As Co-Chair",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/Untitled-design-83-490x367.png",
      },
      {
        text: "Startup Realm’s Changing Guard: Founders & CEOs Who Bid Farewell In 2023",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/FEATURE-2-490x367.jpg",
      },
    ],
    [
      {
        text: "Deepfakes Averse To Our Interests: YouTube India Head",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/youtube-depfakes-featured--490x367.png",
      },
      {
        text: "How The Smartphone Will Change Indian Agriculture In 2024",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/11/Untitled-2023-11-25T230846.884-490x367.jpeg",
      },
      {
        text: "Games24x7 Partners Karnataka Govt To Launch Accelerator For Indian Gaming Startups",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/games24x7-kataka-featured-1-490x367.png",
      },
      {
        text: "Actor Ranveer Singh Joins D2C Sexual Wellness Brand Bold Care As New Co-Owner",
        href: "https://cdn.inc42.com/wp-content/uploads/2023/12/boldcare-ranveer-singh-featured--490x367.png",
      },
    ],
  ],
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
const getQuotes = async () => {
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

  try {
    await page.goto("https://inc42.com/", { waitUntil: "domcontentloaded" });

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
    data = quotes;
    // fs.writeFileSync("db.json", JSON.stringify(quotes, null, 2));
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
};

// Schedule the scraping task using cron
cron.schedule("* * * * *", () => {
  getQuotes();
});

// Set up a simple endpoint to trigger the scraping manually (optional)
app.get("/", (req, res) => {
  res.send(data)
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
