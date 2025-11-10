const express = require('express');
const line = require('@line/bot-sdk');

// 設定 LINE Channel 金鑰（從環境變數讀取）
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();

// ✅ LINE Webhook 路由（必須使用 raw parser）
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // 保留原始資料供 LINE 驗簽名
  line.middleware(config),
  (req, res) => {
    console.log('✅ Received events:', req.body.events);
    res.status(200).end();
  }
);

// 其他一般路由再用 JSON parser
app.use(express.json());

// Render 健康檢查
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// 使用 Render 提供的 PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is running and listening on port ${port}`);
});
