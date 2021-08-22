const express = require('express');
const cors = require('cors');
const routes = require('./routes/router');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
  })
);
app.use(routes);
app.listen(4001, () => {
  console.log('Server is running on port 4000.');
});
