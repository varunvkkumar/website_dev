const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const app = express();
const PORT = process.env.PORT || 5000;

const logFilePath = path.join(__dirname, 'data/clickstream.json');
const userClicksPath = path.join(__dirname, 'data/userClicks.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Route to handle clickstream tracking
app.post('/track', (req, res) => {
  const clickData = req.body;
  clickData.eventId = uuidv4(); // Generate a unique event ID
  const userEmail = req.body.userEmail || 'default@user.com'; // Replace with actual user identification logic

  // Log click data
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
    });
  });

  // Track user clicks
  fs.readFile(userClicksPath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading user clicks file:', err);
      return res.status(500).send('Error reading user clicks file');
    }

    const userClicks = data ? JSON.parse(data) : {};
    userClicks[userEmail] = (userClicks[userEmail] || 0) + 1;

    fs.writeFile(userClicksPath, JSON.stringify(userClicks, null, 2), (err) => {
      if (err) {
        console.error('Error writing to user clicks file:', err);
        return res.status(500).send('Error writing to user clicks file');
      }
      res.status(200).send({ clickCount: userClicks[userEmail], eventId: clickData.eventId });
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










