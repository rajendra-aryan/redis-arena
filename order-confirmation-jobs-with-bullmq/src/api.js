import express from 'express';
import {emailQueue} from './queue.js';
const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({status: 'ok', service: 'order-confirmation-api'});
});

app.post('/welcome-email', async (req, res) => {
    if (!req.body?.to) {
        return res.status(400).json({message: '"to" is required'});
    }

    const job = await emailQueue.add(
        'Send-welcome-email',
        {
            to: req.body.to,
            subject: req.body.subject || 'No subject',
            body: req.body.body || 'No body'
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        }
    );
    res.json({message: 'Welcome email job added to the queue', jobId: job.id});
});

app.get('/welcome-email/:jobId', async (req, res) => {
    const job = await emailQueue.getJob(req.params.jobId);

    if (!job) {
        return res.status(404).json({message: 'Job not found'});
    }

    const state = await job.getState();
    res.json({
        jobId: job.id,
        name: job.name,
        data: job.data,
        state,
        attemptsMade: job.attemptsMade
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});