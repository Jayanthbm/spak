const PORT = process.env.PORT || 3000;
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
