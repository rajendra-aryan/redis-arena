import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT || 3000);

const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/health', (_req, res) => {
    res.json({status: 'ok', service: 'live-admin-notification-pub-sub'});
});

app.post('/notifications', async (req, res) => {
    const payload = {
        title: req.body.title || 'No title',
        createdAt: new Date().toISOString(),
    }
    const receivers = await publisher.publish('notifications', JSON.stringify(payload));
    res.json({message: `Notification sent to ${receivers} subscribers`, payload});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});