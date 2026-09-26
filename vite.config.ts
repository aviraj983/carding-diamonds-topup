import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function freeFireApiPlugin(): Plugin {
  return {
    name: 'free-fire-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Payment create-order API route
        if (req.url && req.url.startsWith('/api/payment/create-order') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const { amount, playerUid, diamonds } = data;
              const merchantId = process.env.WATCHPAYS_MERCHANT_ID || '100666060';
              const apiKey = process.env.WATCHPAYS_API_KEY || 'c76ec04f7b270339aaa05d66c71aed94';
              const formattedAmount = Number(amount || 0).toFixed(2);
              const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

              // Callback URL
              const host = req.headers.host || 'localhost:3000';
              const protocol = host.includes('localhost') ? 'http' : 'https';
              const callbackUrl = `${protocol}://${host}/api/payment/callback`;
              const extraData = playerUid ? `UID_${playerUid}` : `Diamonds_${diamonds || ''}`;

              const crypto = await import('crypto');
              const signParams: Record<string, string> = {
                amount: formattedAmount,
                callback_url: callbackUrl,
                merchant_id: merchantId,
                merchant_order_no: merchantOrderNo,
              };

              let signStr = '';
              for (const k of Object.keys(signParams).sort()) {
                signStr += `${k}=${signParams[k]}&`;
              }
              signStr += `key=${apiKey}`;
              const signature = crypto.createHash('md5').update(signStr).digest('hex');

              const requestPayload = {
                merchant_id: merchantId,
                api_key: apiKey,
                amount: formattedAmount,
                merchant_order_no: merchantOrderNo,
                callback_url: callbackUrl,
                extra: extraData,
                signature: signature,
              };

              console.log('Sending WatchPays API request:', JSON.stringify(requestPayload, null, 2));

              let resData: any = null;
              let paymentUrl: string | null = null;

              try {
                const resp = await fetch('https://api.watchpays.com/v1/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(requestPayload),
                });

                const resText = await resp.text();
                console.log('WatchPays raw response:', resText);
                try { resData = JSON.parse(resText); } catch(e) {}

                if (resData && resData.success && resData.payment_url) {
                  paymentUrl = resData.payment_url;
                }
              } catch (e: any) {
                console.error('WatchPays API fetch exception:', e?.message || e);
              }

              res.setHeader('Content-Type', 'application/json');
              if (paymentUrl) {
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  paymentUrl: paymentUrl,
                  checkoutUrl: paymentUrl,
                  merchantOrderNo: resData?.merchant_order_no || merchantOrderNo,
                  amount: resData?.amount || formattedAmount,
                }));
              } else {
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: false,
                  error: resData?.message || 'Payment gateway error. Please try again.',
                }));
              }
            } catch (err: any) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
            }
          });
          return;
        }

        if (req.url && req.url.startsWith('/api/verify-uid')) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost');
            const uid = (parsedUrl.searchParams.get('uid') || '').trim();

            if (!uid || !/^\d{5,14}$/.test(uid)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: true, status: 400, msg: 'Invalid Free Fire UID' }));
              return;
            }

            const apiKey = process.env.NEFERBYTE_API_KEY || '7e7fd9cae78a542bf3ba679f94a5afa2';
            const targetUrl = `https://api.neferbyte.com/game-id-checker/ff-global/${encodeURIComponent(uid)}`;

            const apiResponse = await fetch(targetUrl, {
              method: 'GET',
              headers: {
                'x-api-key': apiKey,
                'Accept': 'application/json',
              },
            });

            const data = await apiResponse.json().catch(() => null);

            res.setHeader('Content-Type', 'application/json');
            if (!apiResponse.ok || !data || data.error === true || !data.data?.username) {
              res.statusCode = 200;
              res.end(JSON.stringify({ error: true, status: 404, msg: 'Player UID not found', data: null }));
              return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify(data));
          } catch (err: any) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: true, status: 500, msg: err?.message || 'Server error' }));
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), freeFireApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
