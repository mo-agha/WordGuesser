require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/check-word", async (req, res) => {
  const word = req.query.word;
  try {
    const response = await axios.get(
      `https://wordsapiv1.p.rapidapi.com/words/${word}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching word data" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
