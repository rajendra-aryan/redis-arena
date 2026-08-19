import {Worker} from "bullmq";
import {connection} from "./queue.js";

const worker = new Worker(
    "emails",
    async job => {
        console.log("Processing email job...", job.id, job.data, job.name),
        await new Promise((resolve) => setTimeout(resolve, 2000)), 
        console.log("Email job completed!", job.id, job.data, job.name)
    },
    {connection}
)

worker.on("completed", (job) => {
    console.log(`Job ${job.id} has completed!`, job.data, job.name);
});

worker.on("failed", (job, err) => {
    console.log(`Job ${job.id} has failed with ${err.message}`, job.data, job.name);
});