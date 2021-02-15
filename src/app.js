require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const articlesRouter = require('./articles/articles-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common'))
app.use(cors())
app.use(helmet())

app.use('/api/articles', articlesRouter)

app.get('/xss', (req, res) => {
  res.cookie('secretToken', '1234567890');
  res.sendFile(__dirname + '/xss-example.html')
})

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app


// const jsonParser = express.json()

// app.get('/articles', (req, res, next) => {
//   const knexInstance = req.app.get('db')
//   ArticlesService.getAllArticles(knexInstance)
//     .then(articles => {
//       res.json(articles)
//     })
//     .catch(next)
// })

// app.get('/articles/:article_id', (req, res, next) => {
//   const knexInstance = req.app.get('db')
//   ArticlesService.getById(knexInstance, req.params.article_id)
//     .then(article => {
//       if (!article) {
//         return res.status(404).json({
//           error: { message: `Article doesn't exist` }
//         })
//       }
//       res.json(article)
//     })
//     .catch(next)
// })

// //read body with parser and send back res with any numeric value
// app.post('/articles', jsonParser, (req, res, next) => {
//   //create article in the database
//   const { title, content, style } = req.body;
//   const newArticle = { title, content, style };
//   ArticlesService.insertArticle(
//     req.app.get('db'),
//     newArticle
//   )
//     .then(article => {
//       res
//         .status(201)
//         //header assertion
//         .location(`/articles/${articles.id}`)
//         .json(article)
//     })
//     .catch(next)
// })

//write test
//create endpoint in app.js
//