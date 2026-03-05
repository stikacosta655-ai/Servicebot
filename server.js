const http = require('http');
const bots = {};
const bookings = {};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200); res.end(); return;
  }

  let body = '';
  req.on('data', d => body += d);
  req.on('end', () => {
    const url = req.url;
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && url === '/api/bot') {
      const { id, data } = JSON.parse(body || '{}');
      if (!id || !data) { res.writeHead(400); res.end('{"error":"faltan datos"}'); return; }
      bots[id] = data;
      res.writeHead(200); res.end(JSON.stringify({ ok: true, id }));

    } else if (req.method === 'GET' && url.startsWith('/api/bot/')) {
      const id = url.split('/api/bot/')[1];
      if (!bots[id]) { res.writeHead(404); res.end('{"error":"no encontrado"}'); return; }
      res.writeHead(200); res.end(JSON.stringify({ ok: true, data: bots[id] }));

    } else if (req.method === 'GET' && url.startsWith('/api/bookings/')) {
      const id = url.split('/api/bookings/')[1];
      res.writeHead(200); res.end(JSON.stringify({ ok: true, bookings: bookings[id] || {} }));

    } else if (req.method === 'POST' && url.startsWith('/api/bookings/')) {
      const id = url.split('/api/bookings/')[1];
      const { date_key, time_slot } = JSON.parse(body || '{}');
      if (!bookings[id]) bookings[id] = {};
      if (!bookings[id][date_key]) bookings[id][date_key] = [];
      bookings[id][date_key].push(time_slot);
      res.writeHead(200); res.end('{"ok":true}');

    } else {
      res.writeHead(200); res.end('"ServiceBot corriendo"');
    }
  });
});

server.listen(process.env.PORT || 3000, () => console.log('Puerto', process.env.PORT || 3000));
