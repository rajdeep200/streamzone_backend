const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { spawn } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

const options = [
  "-i",
  "-",
  "-c:v",
  "libx264",
  "-preset",
  "ultrafast",
  "-tune",
  "zerolatency",
  "-r",
  `${25}`,
  "-g",
  `${25 * 2}`,
  "-keyint_min",
  25,
  "-crf",
  "25",
  "-pix_fmt",
  "yuv420p",
  "-sc_threshold",
  "0",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-ar",
  128000 / 4,
  "-f",
  "flv",
  `rtmp://a.rtmp.youtube.com/live2/kq3k-r88a-3mg5-8598-e7mz`,
];

const ffmpegProcess = spawn("ffmpeg", options);

ffmpegProcess.stdout.on('data', (data: any) => {
    console.log(`ffmpeg DATA :: ${data}` )
})

io.on("connection", (socket: any) => {
  console.log(`New client connected`, socket.id);

  socket.on("binarydata", (data: any) => {
    console.log("Binary Data incoming...", data);
    ffmpegProcess.stdin.write(data, (error: any) => {
        console.log('ffmpegProcess.stdin Error: ', error)
    });
  });
});

app.use("/", (req: Request, res: Response) => {
  console.log("Hello World");
  res.json()
});

const PORT = 4040;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
