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
              const merchantId = process.env.SUNPAYS_MERCHANT_ID || '40794632';
              const apiKey = process.env.SUNPAYS_API_KEY || process.env.PAYIN_API_KEY || 'ecee0739b16abec50862a78185b881e3f1772c8bd5dced5b';
              const apiSecret = process.env.SUNPAYS_API_SECRET || process.env.PAYIN_API_SECRET || '59750f656226f2dbb23518500a3c99a8f3207bdab4f3964c20ac89170628c105';
              const numericAmount = Math.round(Number(amount || 0));
              const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

              // Callback URL (Sunpays requires a valid public HTTPS notify_url)
              const host = req.headers.host || 'localhost:3000';
              const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
              const callbackUrl = isLocalhost
                ? 'https://carding-diamonds-topup.vercel.app/api/payment/callback'
                : `https://${host}/api/payment/callback`;

              const requestPayload = {
                order_id: merchantOrderNo,
                amount: numericAmount,
                currency: 'INR',
                method: 'upi',
                customer_name: playerUid ? `UID_${playerUid}` : 'Customer',
                customer_phone: '9999999999',
                notify_url: callbackUrl,
                metadata: {
                  merchant_id: merchantId,
                  player_uid: playerUid || '',
                  diamonds: String(diamonds || '')
                }
              };

              const crypto = await import('crypto');
              const rawBody = JSON.stringify(requestPayload);
              const signature = apiSecret
                ? crypto.createHmac('sha256', apiSecret).update(rawBody).digest('hex')
                : '';

              console.log('Sending Sunpays API request:', rawBody);
              console.log('Sunpays Signature:', signature);

              let resData: any = null;
              let paymentUrl: string | null = null;

              try {
                const resp = await fetch('https://sunpaytm.quest/api/public/v1/payins', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'x-signature': signature
                  },
                  body: rawBody,
                });

                const resText = await resp.text();
                console.log('Sunpays raw response:', resText);
                try { resData = JSON.parse(resText); } catch(e) {}

                if (resData) {
                  paymentUrl =
                    resData.checkout_url ||
                    resData.payment_url ||
                    resData.redirect_url ||
                    resData.merchant_gateway_payment_url ||
                    resData.transaction?.gateway_payment_url;
                }
              } catch (e: any) {
                console.error('Sunpays API fetch exception:', e?.message || e);
              }

              res.setHeader('Content-Type', 'application/json');
              if (paymentUrl) {
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  paymentUrl: paymentUrl,
                  checkoutUrl: paymentUrl,
                  merchantOrderNo: resData?.order_id || resData?.transaction?.id || merchantOrderNo,
                  amount: resData?.amount || resData?.transaction?.amount || numericAmount,
                }));
              } else {
                let errText = 'Sunpays Payment Gateway error. Please try again.';
                if (resData?.error === 'invalid_signature') {
                  errText = 'Sunpays Signature Error: Please copy and provide your Pay-in API Secret key from Sunpays Merchant Info.';
                } else if (resData?.error || resData?.message) {
                  errText = resData.error || resData.message;
                }

                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: false,
                  error: errText,
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
