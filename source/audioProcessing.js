const { spawn } = require("child_process");
const { Readable } = require("stream");

const command = process.platform === "darwin" ? "rec" : "arecord";
const args = process.platform === "darwin"
  ? ["-r", "44100", "-b", "16", "-c", "1", "-e", "signed-integer", "-t", "raw", "-"]
  : ["-c", "1", "-r", "44100", "-f", "S16_LE", "-"];

let audioProcess = spawn(command, args);

const audioStream = new Readable({
  read() { },
});

audioProcess.stdout.on("data", (data) => {
  audioStream.push(data);
  console.log(data)
});

audioProcess.on("exit", (code, signal) => {
  console.log(`Child process exited with code ${code} and signal ${signal}`);
  startAudioProcess();
});

audioProcess.on("error", (err) => {
  console.error("Child process error:", err);
});

audioProcess.on("close", (code) => {
  console.log(`Child process closed with code ${code}`);
});

function startAudioProcess() {
  audioProcess = spawn(command, args);
}

startAudioProcess();
module.exports = { audioStream, startAudioProcess };
