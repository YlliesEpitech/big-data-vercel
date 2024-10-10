import express from 'express';
const app = express();
import { fetchData } from './utils/functions/AllExports.js';

app.get("/", async (req, res) => {

  const data = await fetchData();
  res.json({ data: data });
});


app.listen(3000, () => {
  console.log("Server has started");
});
