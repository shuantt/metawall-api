const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>MetaWall Project API</title>
    </head>
    <body>
      <h1>Welcome, this is the web API of the MetaWall Project</h1>
      <p>Check out the documentation: <a href="http://127.0.0.1:3000/api-docs/#/" target="_blank">Swagger</a></p>
    </body>
    </html>
  `);
});

module.exports = router;
