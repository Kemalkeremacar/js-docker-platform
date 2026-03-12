const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>Hello from JS Docker Container!</h1>
    <p>Container ID: ${process.env.CONTAINER_ID}</p>
    <p>Container Name: ${process.env.CONTAINER_NAME}</p>
    <p>Current Time: ${new Date().toISOString()}</p>
    <p>Working Directory: ${process.cwd()}</p>
  `);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Container: ${process.env.CONTAINER_NAME} (${process.env.CONTAINER_ID})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});