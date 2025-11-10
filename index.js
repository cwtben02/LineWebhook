const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);
const app = express();

app.use(express.json());

// ✅ 接收系統重設通知的 API
app.post('/api/send-reset', async (req, res) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).send('Missing userId or code');
  }

  try {
    await client.pushMessage(userId, {
      type: 'text',
      text: `已收到申請重設通知，重設碼：${code}\n請於時限2分鐘內完成(請注意您重設次數已達上限)`
    });

    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('❌ LINE pushMessage error:', error);
    res.status(500).send('Failed to send LINE message');
  }
});

// ✅ health check（Render 用）
app.get('/healthz', (req, res) => res.status(200).send('OK'));

// ✅ 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
