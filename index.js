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

app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Recebido webhook:', payload);

  res.status(200).send('Webhook recebido com sucesso');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

