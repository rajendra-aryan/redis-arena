import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const BANNER_KEY = 'app:banner';
app.post('/banner', async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to the arena!");
    res.json({status: 'true'});
});
app.get('/banner', async (req, res) => {
    const message = await redis.get(BANNER_KEY);
    res.json({message});
});
app.delete('/banner', async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({status: 'true'});
});
app.get('/banner/exists', async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({exists: exists === 1});
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Banner service is running on port ${process.env.PORT || 3000}`);
});