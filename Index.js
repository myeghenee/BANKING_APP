const express = require('express');
const app = express();

require('dotenv').config();

const connectDB = require('./configs/db');
connectDB();

app.use(express.json());

app.use('/api/user', require('./routes/userroutes'));
app.use('/api/bank', require('./routes/bankroutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});