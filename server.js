const express = require('express');
const path = require('path');
const axios = require('axios');
const redis = require('redis');
const app = express();
const API_URL = 'http://api.fixer.io';

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'views')
  });
});

app.get('/rate/:date', (req, res) => {
  const date = req.params.date;
  const url = `${API_URL}/${date}?base=USD`;

  axios.get(url).then(response => {
    return res.json({ rates: response.data.rates });
  }).catch(error => {
    console.log(error);
  });

});
const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});