import localtunnel from 'localtunnel';

const port = 4000;

(async () => {
  const tunnel = await localtunnel({ port: port });

  console.log('--- PUBLIC TUNNEL STARTED ---');
  console.log(`🌍 Webhook URL: ${tunnel.url}/api/webhook`);
  console.log('-----------------------------');
  console.log('👉 Copy URL trên và dán vào Lalamove Dashboard (Webhook Settings)');

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
