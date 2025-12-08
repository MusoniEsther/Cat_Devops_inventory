const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { register, Counter, Gauge } = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Prometheus metrics
const reqCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const itemsGauge = new Gauge({
  name: 'inventory_items_total',
  help: 'Total items in inventory',
});

function updateMetrics() {
  itemsGauge.set(items.size);
}

// In-memory storage
const items = new Map(); // id -> { id, name, qty, price, location }

// In-memory history store
const history = new Map(); // id -> [ { ts, action, beforeQty, afterQty, delta, by } ]

function logHistory(id, action, beforeQty, afterQty, by = 'system') {
  const entry = {
    ts: new Date().toISOString(),
    action, // 'create' | 'update' | 'delete'
    beforeQty,
    afterQty,
    delta: (afterQty === undefined || beforeQty === undefined) ? undefined : (afterQty - beforeQty),
    by,
  };
  if (!history.has(id)) history.set(id, []);
  history.get(id).push(entry);
}

// Middleware to track requests
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    reqCounter.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
    return originalSend.call(this, data);
  };
  next();
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all items
app.get('/items', (req, res) => {
  const allItems = Array.from(items.values());
  res.json(allItems);
});

// Get single item
app.get('/items/:id', (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// Create item
app.post('/items', (req, res) => {
  const { name, qty, price, location } = req.body;

  if (!name || qty === undefined || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, qty, price' });
  }

  const id = uuidv4();
  const item = { id, name, qty: parseInt(qty), price: parseFloat(price), location: location || '' };
  items.set(id, item);
  logHistory(id, 'create', 0, item.qty, req.ip || 'unknown');
  updateMetrics();
  res.status(201).json(item);
});

// Update item
app.put('/items/:id', (req, res) => {
  const existing = items.get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Item not found' });

  const beforeQty = existing.qty;
  const { name, qty, price, location } = req.body;

  if (name !== undefined) existing.name = name;
  if (qty !== undefined) existing.qty = parseInt(qty);
  if (price !== undefined) existing.price = parseFloat(price);
  if (location !== undefined) existing.location = location;

  items.set(existing.id, existing);
  logHistory(existing.id, 'update', beforeQty, existing.qty, req.ip || 'unknown');
  updateMetrics();
  res.json(existing);
});

// Delete item
app.delete('/items/:id', (req, res) => {
  const it = items.get(req.params.id);
  if (!it) return res.status(404).json({ error: 'Item not found' });
  const ok = items.delete(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Item not found' });
  logHistory(req.params.id, 'delete', it.qty, 0, req.ip || 'unknown');
  updateMetrics();
  res.status(204).end();
});

// Get history for specific item
app.get('/items/:id/history', (req, res) => {
  const h = history.get(req.params.id) || [];
  res.json(h);
});

// Get global history (all items)
app.get('/history', (req, res) => {
  const all = Array.from(history.entries()).flatMap(([id, list]) =>
    list.map(e => ({ id, ...e }))
  );
  res.json(all);
});

// Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', itemsCount: items.size });
});

// Start server
app.listen(PORT, () => {
  console.log(`Inventory System running on http://localhost:${PORT}`);
});

module.exports = app;
