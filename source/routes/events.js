const express = require("express");
const router = express.Router();
const {client, request} = require("../transcription")

let dynamicVariable = ""
client.send(request).then(async (response) => {
    for await (const event of response.TranscriptResultStream) {
        if (event.TranscriptEvent) {
            const message = event.TranscriptEvent;
            const results = event.TranscriptEvent.Transcript.Results;
            results.map((result) => {
                (result.Alternatives || []).map((alternative) => {
                    const transcript = alternative.Items.map((item) => item.Content).join(" ");
                    dynamicVariable = transcript;
                });
            });
        }
    }
}).catch((error) => {
    console.error(error);
});

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.write(`data: ${dynamicVariable}\n\n`);

  const interval = setInterval(() => {
    res.write(`data: ${dynamicVariable}\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

module.exports = router;
