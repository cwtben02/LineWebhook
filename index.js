const express = require('express');
const line = require('@line/bot-sdk');

// 設定 LINE Channel 金鑰（從環境變數讀取）
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();
app.use(express.json()); // ← 重要！讓 Express 能解析 LINE 傳來的 JSON

// LINE Webhook 接收事件
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log('Received events:', req.body.events);
  res.status(200).end();
});

// Render 的健康檢查路徑
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// 使用 Render 提供的 PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is running and listening on port ${port}`);
});
