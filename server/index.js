const express = require('express');
const cors = require('cors');
const colros = require('colors');
const databaseRouter = require('./routes/database');

const startServer = () => {
  const app = express();

  // access from anoter port 
  app.use(cors());

  // To allow write data to the server
  app.use(express.json());

  // API Routes 
  app.use('/api/v1', databaseRouter)

  const PORT = 9000;
  app.listen(PORT, () =>
    console.log(`Visualize you database on port ${PORT} `.bgGreen)
  );
};

module.exports = {
  startServer,
};
