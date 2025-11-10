const express = require('express');
const line = require('@line/bot-sdk');

// 設定 LINE Channel 金鑰（從環境變數讀取）
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();

// ✅ 重要：LINE middleware 要放在 JSON parser 之前！
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log('✅ Received events:', req.body.events);
  res.status(200).end();
});

// 其他路由可以再加 JSON parser
app.use(express.json());

// Render 的健康檢查路徑
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// 使用 Render 提供的 PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is running and listening on port ${port}`);
});
