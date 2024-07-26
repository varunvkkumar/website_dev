const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

const logFilePath = path.join(__dirname, 'data/clickstream.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API route for testing
app.get('/api', (req, res) => {
  res.send('API Running');
});

// Route to handle clickstream tracking
app.post('/track', (req, res) => {
  const clickData = req.body;
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).send('Error reading log file');
    }

    const logs = data ? JSON.parse(data) : [];
    logs.push(clickData);

    fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
        return res.status(500).send('Error writing to log file');
      }
      res.status(200).send('Data received');
    });
  });
});

// The "catchall" handler: for any request that doesn't match the above,
// send back index.html from the React app's build directory.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







