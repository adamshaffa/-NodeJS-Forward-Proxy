const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');

const HTTP_PORT = 3456;

const app = express();

app.use((req, res, next) => {
  if (!req.secure && req.method !== 'CONNECT') {
    const redirectTo = `https://www.google.com${req.url}`;
    console.log(`Redirecting to: ${redirectTo}`);
    return res.redirect(301, redirectTo);
  }
  next();
});

app.get('*', (req, res) => {
  res.send('Hello, World! (HTTP)');
});

app.use((req, res, next) => {
  if (req.method === 'CONNECT') {
    const host = req.url.split(':')[0];
    const port = parseInt(req.url.split(':')[1]) || 443;

    const proxyReq = https.request({
      hostname: host,
      port: port,
      method: 'CONNECT',
      path: req.url
    });

    proxyReq.on('connect', (proxyRes, socket) => {
      res.writeHead(200, { 'Connection': 'keep-alive' });
      res.end();
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy CONNECT error:', err);
      res.end();
    });

    req.pipe(proxyReq);
  } else {
    next();
  }
});

http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`HTTP server running on port ${HTTP_PORT}`);
});
