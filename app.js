const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const url = require('url'); // Add this line

const HTTP_PORT = 3456;
const HTTPS_PORT = 3457;

const privateKey = fs.readFileSync('localhost.key', 'utf8');
const certificate = fs.readFileSync('localhost.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use((req, res, next) => {
  if (!req.secure && req.method !== 'CONNECT') {
    const host = req.headers.host.split(':')[0];
    const redirectTo = `https://${host}:${HTTPS_PORT}${req.url}`;
    console.log(`Redirecting to: ${redirectTo}`);
    return res.redirect(301, redirectTo);
  }
  next();
});

app.get('*', (req, res) => {
  res.send('Hello, World! (HTTP)');
});

app.use((req, res) => {
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
      socket.pipe(socket); // Pipe data directly between client and target server
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy CONNECT error:', err);
      res.end();
    });

    req.pipe(proxyReq);
  }
});

https.createServer(credentials, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running on port ${HTTPS_PORT}`);
});

http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`HTTP server running on port ${HTTP_PORT}`);
});
