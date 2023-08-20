const express = require("express");
const app = express();
const audioProcessing = require("./audioProcessing");
require('dotenv').config();

audioProcessing.startAudioProcess()

const eventsRoute = require("./routes/events");
const homeRoute = require("./routes/home");

app.use("/events", eventsRoute);
app.use("/", homeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});