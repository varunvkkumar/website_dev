// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 5000;

const logFilePath = path.join(__dirname, 'data/clickstream.json');
const userClicksPath = path.join(__dirname, 'data/userClicks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Route to handle clickstream tracking
app.post('/track', async (req, res) => {
  const { trackingId, userEmail } = req.body;
  const clickData = {
    eventId: uuidv4(),
    trackingId,
    timestamp: new Date().toISOString(),
    userEmail: userEmail || 'default@user.com'
  };

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

    // Call the Flask ML server for the coupon decision
    axios.post('http://localhost:5001/coupon-decision', {
      clickCount: userClicks[userEmail],
      userEmail: userEmail,
      trackingId: trackingId // Include trackingId in the request to Flask
    })
    .then(flaskRes => {
      const couponDecision = flaskRes.data.shouldShowCoupon;
      console.log('Coupon Decision from Flask:', couponDecision);  // Debug log
      console.log('Tracking ID sent to Flask:', trackingId);  // Additional debug log

      res.status(200).send({ clickCount: userClicks[userEmail], eventId: clickData.eventId, showCoupon: couponDecision });

      // Save updated user clicks data
      fs.writeFile(userClicksPath, JSON.stringify(userClicks, null, 2), (err) => {
        if (err) {
          console.error('Error writing to user clicks file:', err);
        }
      });
    })
    .catch(error => {
      console.error('Error contacting ML server:', error);
      res.status(500).send('Error making coupon decision');
    });
  });
});

// The "catchall" handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



















