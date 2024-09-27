const express = require("express");
const app = express();
const cheerio = require("cheerio");

app.get("/", async (req, res) => {
  const fetchData = async () => {
    // Récupère l'html de la page
    const url = "https://www.coingecko.com/";
    const response = await fetch(url);
    const data = await response.text();

    // Récupère les valeurs que je souhaite de la page.
    getQuestions(data);
  };

  // Fonction pour récuperer les valeurs que je souhaite
  const getQuestions = async (html) => {
    const $ = cheerio.load(html);
    $(
      ".tw-cursor-pointer.tw-relative.tw-inline-flex.tw-items-center.tw-rounded-lg.tw-px-4.tw-py-1\\.5.tw-text-sm.tw-font-semibold.\\!tw-text-gray-900.hover\\:tw-bg-gray-50.dark\\:\\!tw-text-moon-50.dark\\:hover\\:tw-bg-moon-700",

      html
    ).each(function () {
      console.log($(this).text());
    });
  };

  const data = await fetchData();

  res.json({ data: data });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

app.listen(3000, () => {
  console.log("Server has started");
});
