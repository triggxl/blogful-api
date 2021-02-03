require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const ArticlesService = require('./articles-service');
const app = express();

const morganSetting = (NODE_ENV === 'production' ? 'tiny': 'common');
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.get('/articles', (req, res, next) => {
  const knexInstance = req.app.get('db')
  ArticlesService.getAllArticles(knexInstance)
    .then(articles => {
      res.json(articles)
    })
    .catch(next)
})

app.get('/', (req, res) => {
  res.send('Hello, world!');
})

app.use((error, req, res, next) => {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

module.exports = app;