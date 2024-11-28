const http = require('http');
const os = require('os');

function getPrivateIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
      const interfaceInfo = interfaces[interfaceName];
      for (const info of interfaceInfo) {
          if (info.family === 'IPv4' && !info.internal) {
              // Check if the IP is a private IP
              const ip = info.address;
              if (isPrivateIP(ip)) {
                  return ip;
              }
          }
      }
  }
  return 'No private IP found';
}

function isPrivateIP(ip) {
  // Check if the IP is in the private IP ranges
  const parts = ip.split('.').map(Number);
  return (
      (parts[0] === 10) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168)
  );
}

const server = http.createServer((req, res) => {
  const privateIP = getPrivateIP();
  const message = `This request is being served from the private IP: ${privateIP}`;
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(message);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
