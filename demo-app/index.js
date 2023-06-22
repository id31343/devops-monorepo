const express = require('express');
const promClient = require('prom-client');
const ping = require('./ping.js');

const app = express();

promClient.collectDefaultMetrics({ prefix: 'demo_app_' });

const requestsTotal = new promClient.Counter({
    name: 'requests_total',
    help: 'Total number of requests',
    labelNames: ['method', 'handler', 'code']
});

const requestDurationMs = new promClient.Histogram({
    name: 'requests_duration_ms',
    help: 'Duration of requests in microseconds',
    labelNames: ['method', 'handler', 'code'],
    buckets: promClient.linearBuckets(50, 50, 10)
});

const sleep = (ms) => {
    return new Promise((res, rej) => setTimeout(res, ms));
};

app.disable('etag');

app.use((_, res, next) => {
    res.startEpoch = new Date();
    
    next();
});

app.get('/ping', async (_, res, next) => {
    await sleep(Math.round(Math.random() * 300));

    res.status(200).json({ message: ping() });

    next();
});

app.get('/error-prone', async (_, res, next) => {
    if (Math.round(Math.random() * 10) >= 2) {
        await sleep(Math.round(Math.random() * 300));

        res.status(200).json();

        next();
    } else {
        next(new Error('Error'));
    }
});

app.get('/metrics', async (_, res) => {
    res.setHeader('Content-Type', promClient.register.contentType);

    res.send(await promClient.register.metrics());
});

app.use((err, _, res, next) => {
    res.status(500).json({ error: err.message });

    next();
});

app.use((req, res, next) => {
    requestsTotal.inc({
        method: req.method,
        handler: req.path,
        code: res.statusCode
    });

    next();
});

app.use((req, res, next) => {
    const responseTimeMs = Date.now() - res.startEpoch;

    requestDurationMs
        .labels({
            method: req.method,
            handler: req.path,
            code: res.statusCode
        })
        .observe(responseTimeMs);
    
    next();
});

app.use((req, res, next) => {
    console.log({
        method: req.method,
        path: req.path,
        code: res.statusCode,
        duration: Date.now() - res.startEpoch,
    });

    next();
});

app.listen(8000);

module.exports = app;