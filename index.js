const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/', (req, res, next) => {
  console.log('next: ', next);
  console.log(req.originalUrl);
  console.log(req.body);
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

