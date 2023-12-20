const express = require("express"),
  { PORT } = require('./config'),
  bodyParser = require("body-parser"),
  cors = require('cors'),
  router = require('./routes'),
  /* rateLimiter = require('./middlewares/rate.limiter'), */
  app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
/* app.use(rateLimiter) */
app.use('/api/v1', router)

app.get('/test-connection', (req, res) => {
  return res.status(200).send('ok')
})

app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`)
});

