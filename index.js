const express = require('express');
const line = require('@line/bot-sdk');

// === LINE Bot 設定 ===
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();

// ⚠️ 重要：LINE middleware 要在 express.json() 之前處理 LINE 的驗證
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log('✅ Received LINE events:', req.body.events);
  res.status(200).end();
});

// === 其他 API 要用 JSON Parser ===
app.use(express.json());

// === 忘記密碼 API ===
app.post('/api/password/forgot', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: '缺少 username 參數' });
  }

  console.log(`🔐 收到忘記密碼請求：${username}`);

  // 👉 這裡可以加入實際邏輯，例如寄信、更新資料庫
  res.json({
    message: `已收到使用者 ${username} 的密碼重設請求（目前為模擬回覆）`,
  });
});

// === Render 健康檢查 ===
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// === 啟動伺服器 ===
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is running and listening on port ${port}`);
});
