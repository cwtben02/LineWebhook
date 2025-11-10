const express = require('express');
const line = require('@line/bot-sdk');

// === 設定 LINE Channel 金鑰（從 Render 環境變數讀取） ===
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();
const client = new line.Client(config);

// === 讓 Express 可解析 JSON（放在 LINE middleware 之後） ===
app.use(express.json());

// === Webhook 端點（LINE 官方事件會送來這裡） ===
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log('✅ Received webhook events:', req.body.events);
  res.status(200).end();
});

// === 自訂 API：讓系統可呼叫這個端點發送通知 ===
// 例如你的 LeaveVB 系統忘記密碼、重設通知
app.post('/api/send-reset', async (req, res) => {
  const { userId, code } = req.body;

  // 驗證輸入
  if (!userId || !code) {
    console.warn('⚠️ Missing userId or code in request:', req.body);
    return res.status(400).json({ error: 'Missing userId or code' });
  }

  try {
    // 傳送文字訊息
    await client.pushMessage(userId, {
      type: 'text',
      text: `已收到申請重設通知，重設碼：${code}\n請於2分鐘內完成(請注意您重設次數已達上限)`
    });

    console.log(`📩 Sent reset message to ${userId} with code ${code}`);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('❌ LINE pushMessage error:', error.originalError?.response?.data || error);
    res.status(500).json({ error: 'Failed to send LINE message' });
  }
});

// === Render 健康檢查（Render 平台用） ===
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// === 啟動伺服器 ===
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running and listening on port ${port}`);
});
