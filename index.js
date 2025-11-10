const express = require('express');
const line = require('@line/bot-sdk');

// 🧩 1️⃣ 讀取環境變數
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// 🧩 2️⃣ 防呆：檢查變數是否存在
if (!config.channelAccessToken || !config.channelSecret) {
  console.error('❌ Missing LINE channel credentials. Please check environment variables.');
  process.exit(1);
}

const app = express();
app.use(express.json()); // 讓 Express 解析 JSON

// 🧩 3️⃣ LINE Webhook 接收事件
app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    console.log('✅ Received events:', JSON.stringify(req.body.events, null, 2));
    res.status(200).end(); // 回應 200 給 LINE（必要）
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    res.status(500).end();
  }
});

// 🧩 4️⃣ Render 健康檢查用
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// 🧩 5️⃣ 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
