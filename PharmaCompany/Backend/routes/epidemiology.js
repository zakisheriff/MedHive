import express from 'express';
import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/weekly-report", async (req, res) => {
  let options = {
    mode: 'json',
    pythonOptions: ['-u'], 
    scriptPath: path.join(__dirname, '..'),
  };

  PythonShell.run('predict.py', options)
    .then(results => {
      // Safety check: ensure Python returned something
      if (!results || results.length === 0) {
        return res.status(500).json({ error: "No data returned from prediction engine." });
      }

      // If the Python script printed an error object
      if (results[0].error) {
        return res.status(500).json({ error: results[0].error });
      }

      res.json(results[0]);
    })
    .catch(err => {
      console.error("Python Execution Error:", err);
      res.status(500).json({ 
        error: "Intelligence engine failed to start.",
        details: err.message 
      });
    });
});

export default router;