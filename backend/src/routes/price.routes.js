import { Router } from 'express';
import PriceItem from '../models/PriceItem.js';

const router = Router();

// List price items with pagination, sorting and optional search
router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 50, 1);
  const sortParam = req.query.sort || 'description';
  const sort = {};
  if (typeof sortParam === 'string') {
    if (sortParam.startsWith('-')) {
      sort[sortParam.slice(1)] = -1;
    } else {
      sort[sortParam] = 1;
    }
  }

  const q = String(req.query.q || '').trim();
  const filter = {};
  if (q) {
    const regex = new RegExp(q, 'i');
    Object.assign(filter, {
      $or: [
        { description: regex },
        { code: regex },
        { ref: regex },
        { category: regex },
        { subCategory: regex },
        { keywords: regex },
        { phrases: regex },
      ],
    });
  }

  const [items, total] = await Promise.all([
    PriceItem.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    PriceItem.countDocuments(filter),
  ]);
  res.json({ items, total });
});

// Search by code, description or other fields
router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json([]);
  const regex = new RegExp(q, 'i');
  const items = await PriceItem.find({
    $or: [
      { description: regex },
      { code: regex },
      { ref: regex },
      { category: regex },
      { subCategory: regex },
      { keywords: regex },
      { phrases: regex },
    ]
  })
    .sort({ description: 1 })
    .limit(20)
    .lean();
  res.json(items);
});

// Create a new price item
router.post('/', async (req, res) => {
  try {
    const doc = await PriceItem.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing price item
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await PriceItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a price item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await PriceItem.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
