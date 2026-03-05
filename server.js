const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const bots = {};
const bookings = {};

app.post('/api/bot', (req, res) => {
  const { id, data } = req.body;
  if (!id || !data) return res.status(400).json({ error: 'Faltan datos' });
  bots[id] = data;
  res.json({ ok: true, id });
});

app.get('/api/bot/:id', (req, res) => {
  const data = bots[req.params.id];
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json({ ok: true, data });
});

app.get('/api/bookings/:id', (req, res) => {
  res.json({ ok: true, bookings: bookings[req.params.id] || {} });
});

app.post('/api/bookings/:id', (req, res) => {
  const { date_key, time_slot } = req.body;
  if (!date_key || !time_slot) return res.status(400).json({ error: 'Faltan datos' });
  if (!bookings[req.params.id]) bookings[req.params.id] = {};
  if (!bookings[req.params.id][date_key]) bookings[req.params.id][date_key] = [];
  if (bookings[req.params.id][date_key].includes(time_slot))
    return res.status(409).json({ error: 'Ya reservado' });
  bookings[req.params.id][date_key].push(time_slot);
  res.json({ ok: true });
});

app.get('*', (req, res) => res.send('ServiceBot corriendo'));

app.listen(PORT, () => console.log('Puerto', PORT));
