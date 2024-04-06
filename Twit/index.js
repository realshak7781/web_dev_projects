import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { TwitterApi } from 'twitter-api-v2';



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





async function postTweet() {
    try {
        const twitterClient = new TwitterApi({
            appKey: 'ephNtAW7WFOLHsERn8o1At2TV',
            appSecret: 'T19hd1MQOmM3Wj4PejoBvhWPfS5TbRcL1ws2hnBj316VLJhLBM',
            accessToken: '1526942432276914177-Z6F5kOqGEFSbqLSMonszJuFj0aH15O',
            accessSecret: '1AyKwFVnilqPVe1cb1zx2vb15T9RKQ1zCJLGMuLNEIKrk',
        });

        const postTweet = await twitterClient.tweets.createTweet({
            // The text of the Tweet
            text: "Are you excited for the weekend?",

            // Options for a Tweet with a poll
            poll: {
                options: ["Yes", "Maybe", "No"],
                duration_minutes: 120,
            },
        });
        console.dir(postTweet.data, {
            depth: null,
        });
    } catch (error) {
        console.log(error);
    }
}

// Route for posting a tweet
app.post('/tweet', async (req, res) => {
    try {
        await postTweet();
        res.status(200).json({ success: true, message: 'Tweet posted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

