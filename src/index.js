const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const re_offerRouter = require('./routers/re_ad');
const logRouter = require('./routers/admin');
const cartRouter = require('./routers/cart');

// Scrapers
const re_olx = require('./scrapers/re_olx');

const app = express();
const port = process.env.PORT || 5000;

// Express Middleware
app.use((req, res, next) => {
  next();
});

// Automaticaly parse incoming request data
app.use(express.json());

app.use(userRouter);
app.use(re_offerRouter);
app.use(logRouter);
app.use(cartRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

// Initialize scrapers
re_olx.initialize('dolnoslaskie');
