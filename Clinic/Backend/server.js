const express = require('express');
const app = express();

// This is a simple test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// This command keeps the process alive, listening for requests
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});