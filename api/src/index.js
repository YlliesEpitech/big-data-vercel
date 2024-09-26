const express = require("express");
const app = express();
const cheerio = require("cheerio");

app.get("/", async (req, res) => {
  const fetchData = async () => {
    const url = "https://www.coingecko.com/";
    const response = await fetch(url);
    const data = await response.text();
    return data;
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
