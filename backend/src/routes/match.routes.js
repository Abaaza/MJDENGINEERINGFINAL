import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { EventEmitter } from 'events';
import { openAiMatchFromFiles } from '../services/openAiService.js';
import { cohereMatchFromFiles } from '../services/cohereService.js';
import { matchFromFiles } from '../services/matchService.js';
import { fileURLToPath } from 'url';


const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
export const matchEmitter = new EventEmitter();

router.get('/logs', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();
  const send = (msg) => res.write(`data: ${msg}\n\n`);
  matchEmitter.on('log', send);
  req.on('close', () => {
    matchEmitter.off('log', send);
  });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve to the repo root's frontend price list file
// Current file is located at backend/src/routes, so go up three levels
// to reach the repo root before appending the frontend path
const PRICE_FILE = path.resolve(__dirname, '../../MJD-PRICELIST.xlsx');

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const origLog = console.log;
  console.log = (...args) => {
    origLog(...args);
    matchEmitter.emit('log', args.join(' '));
  };
  console.log('Price match upload:', {
    name: req.file.originalname,
    size: req.file.size
  });
  const { openaiKey, cohereKey } = req.body;
  console.log('OpenAI key provided:', !!openaiKey);
  console.log('Cohere key provided:', !!cohereKey);
  try {
    let results;
    if (openaiKey && cohereKey) {
      const openaiResults = await openAiMatchFromFiles(
        PRICE_FILE,
        req.file.buffer,
        openaiKey
      );
      const cohereResults = await cohereMatchFromFiles(
        PRICE_FILE,
        req.file.buffer,
        cohereKey
      );
      results = openaiResults.map((o, idx) => {
        const c = cohereResults[idx] || { matches: [] };
        const openaiBest = o.matches[0];
        const cohereBest = (c.matches || [])[0];
        return {
          inputDescription: o.inputDescription,
          quantity: o.quantity,
          matches: [openaiBest, cohereBest].filter(Boolean)
        };
      });
    } else if (openaiKey) {
      results = await openAiMatchFromFiles(PRICE_FILE, req.file.buffer, openaiKey);
    } else if (cohereKey) {
      results = await cohereMatchFromFiles(
        PRICE_FILE,
        req.file.buffer,
        cohereKey
      );
    } else {
      // Fallback to built-in matcher when no external API key is provided
      results = matchFromFiles(PRICE_FILE, req.file.buffer);
    }
    console.log('Price match results:', results.length);
    matchEmitter.emit('log', 'DONE');
    res.json(results);
  } catch (err) {
    console.error('Price match error:', err);
    res.status(400).json({ message: err.message });
  } finally {
    console.log = origLog;
  }
});

export default router;
