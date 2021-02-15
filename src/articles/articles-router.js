const path = require('path')
const express = require('express')
const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const jsonParser = express.json()

articlesRouter
  .route('/')
  .get((req, res, next) => {
    ArticlesService.getAllArticles(
      req.app.get('db')
    )
      .then(articles => {
        res.json(articles)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, style } = req.body;
    const newArticle = { title, content, style };

    for (const [key, value] of Object.entries(newArticle)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    ArticlesService.insertArticle(
      req.app.get('db'),
      newArticle
    )
      .then(article => {
        res
          .status(201)
          //to create valid web path and avoid trailing slash; path..join
          .location(path.posix.join(req.originalUrl, `/${article.id}`))
          .json(article)
      })
      .catch(next)
  })

articlesRouter
  .route('/:article_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getById(knexInstance, req.params.article_id)
      .then(article => {
        if (!article) {
          return res.status(404).json({
            error: { message: `Article doesn't exist` }
          })
        }
        res.json(article)
      })
      .catch(next)
  })

module.exports = articlesRouter

//test to make 400 pass
  // repetitive
  // if (!title) {
  //   return res.status(400).json({
  //     error: { message: `Missing 'title' in requst body` }
  //   })
  // }
  // if (!content) {
  //   return res.status(400).json({
  //     error: { message: `Missing 'content' in request body` }
  //   })
  // }