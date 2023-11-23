const express = require("express"),
  { PORT } = require('./config'),
  bodyParser = require("body-parser"),
  cors = require('cors')
  app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`)
});

