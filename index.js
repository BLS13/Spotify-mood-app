
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUrl = process.env.SPOTIFY_REDIRECT_URI;

app.get("/get-token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.log("error getting token", err.message);
    res.status(500).send("Something went wrong");
  }
});


app.post("/get-playlist", async (req, res) => {
  const userMood = req.body.mood;

  if (!userMood) {
    return res.status(400).send("Please send a mood");
  }

  try {
   
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

   
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(userMood)}&type=track&limit=10`,
      { headers: { Authorization: "Bearer " + accessToken } }
    );

    const trackList = searchResponse.data.tracks.items.map((track) => {
      return {
        name: track.name,
        artist: track.artists[0].name,
        url: track.external_urls.spotify,
        image: track.album.images[0]?.url || "",
      };
    });

    res.json(trackList);
  } catch (err) {
    console.log("error getting playlist", err.message);
    res.status(500).send("Something went wrong");
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});




