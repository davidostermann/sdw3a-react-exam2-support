const path = require('path');
const express = require('express');
const Api = require('./Api');

const app = express();

app.use('/api', Api);

app.use('/', express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen( process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!');
});
