// pages/api/executeCommand.js

import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Example command: you can replace this with your actual command
    exec('echo "Hello from the server!"', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (stderr) {
        return res.status(500).json({ error: stderr });
      }
      res.status(200).json({ output: stdout });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
