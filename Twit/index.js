import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

import Twitter from "twitter-lite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const client = new Twitter({
  consumer_key: '5J5IrvHAKKdKkaWzGOd9RpABs',
  consumer_secret: 'a6HzyUSiKTvRpQky0it60ROhOY6rf4nFcr5mZ4N3q1CKddf8Ml',
  access_token_key: '1526942432276914177-d49mL878LqFwNx3vNiru8hRu35SziA',
  access_token_secret: 'naNU2b74bJff67igPuamBiaEQ2lbf8bO0G76DM3RJjOff'
});



app.post("/submit", async (req, res) => {
  const tweetText = req.body.post; // Assuming the textarea name is 'post'

  try {
    // Send tweet using Twitter API
    const tweet = await client.post("statuses/update", {
      status: tweetText
    });

    console.log("Tweet published:", tweet);
    res.send("Tweet published successfully!");
  } catch (error) {
    console.error("Error publishing tweet:", error);
    res.status(500).send("Error publishing tweet!");
  }
});