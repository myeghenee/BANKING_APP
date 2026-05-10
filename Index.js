const express = require('express');
const app = express();

require('dotenv').config();

const connectDB = require('./configs/db');
connectDB();

app.use(express.json());

//routes
app.use('/api/user', require('./routes/userroutes'));
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/accounts", require("./routes/accountroutes"));
app.use("/api/transactions", require("./routes/transactionroutes"));


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;