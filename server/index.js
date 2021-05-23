const express = require('express');
const cors = require('cors');
const colros = require('colors');

const startServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  const PORT = 9000;
  app.listen(PORT, () =>
    console.log(`Visualize you database on port ${PORT} `.bgGreen)
  );
};

module.exports = {
  startServer,
};
