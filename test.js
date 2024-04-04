const net = require('net');
const http = require('http');
const https = require('https');

const PORT = 3456;

const server = net.createServer(clientSocket => {
  clientSocket.on('data', data => {
    const request = data.toString();

    // Parse the request and extract the target URL
    const targetUrl = request.match(/Host: (.+)\r\n/)[1];

    // Determine if it's an HTTP or HTTPS request
    const isHttps = targetUrl.startsWith('https://');
    const targetProtocol = isHttps ? https : http;

    // Create a new connection to the target server
    const targetSocket = net.connect(isHttps ? 443 : 80, targetUrl, () => {
      targetSocket.write(data);
    });

    // Pipe data between client and target server
    clientSocket.pipe(targetSocket);
    targetSocket.pipe(clientSocket);

    // Modify response for HTML content
    targetSocket.on('data', targetData => {
      const response = targetData.toString();
      if (response.includes('Content-Type: text/html')) {
        const modifiedResponse = response.replace('</body>', 'NODEJS</body>');
        clientSocket.write(modifiedResponse);
      } else {
        clientSocket.write(targetData);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Forward proxy server listening on port ${PORT}`);
});
