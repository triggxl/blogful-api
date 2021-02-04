const knex = require('knex')
const app = require('../src/app')
const { makeArticlesArray } = require('./articles.fixtures')

describe('Articles Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('blogful_articles').truncate())

  afterEach('cleanup', () => db('blogful_articles').truncate())

  describe(`GET /articles`, () => {
    context(`Given no articles`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/articles')
          .expect(200, [])
      })
    })

    context('Given there are articles in the database', () => {
      const testArticles = makeArticlesArray()

      beforeEach('insert articles', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles)
      })

      it('responds with 200 and all of the articles', () => {
        return supertest(app)
          .get('/articles')
          .expect(200, testArticles)
      })
    })
  })

  describe(`GET /articles/:article_id`, () => {
    context(`Given no articles`, () => {
      it(`responds with 404`, () => {
        const articleId = 123456
        return supertest(app)
          .get(`/articles/${articleId}`)
          .expect(404, { error: { message: `Article doesn't exist` } })
      })
    })

    context('Given there are articles in the database', () => {
      const testArticles = makeArticlesArray()

      beforeEach('insert articles', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles)
      })

      it('responds with 200 and the specified article', () => {
        const articleId = 2
        const expectedArticle = testArticles[articleId - 1]
        return supertest(app)
          .get(`/articles/${articleId}`)
          .expect(200, expectedArticle)
      })
    })
  })
})

// const { expect } = require('chai');
// const knex = require('knex');
// const app = require('../src/app');
// const { makeArticlesArray } = require('./articles.fixtures')

// describe.only('Articles Endpoints', () => {
//   //'only' run working on this suite
//   let db
//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DB_URL
//     })
//     //setting app.set('db', knexInstance) inside our tests
//     app.set('db', db)
//   })
//   after('disconnect from db', () => db.destroy())

//   before('clean the table', () => db('blogful_articles').truncate())

//   afterEach('cleanup', () => db('blogful_articles').truncate())

//   describe('GET/articles', () => {
//     context('Given there are no articles', () => {
//       it(`responds with 200 and an empty list`, () => {
//         return supertest(app)
//         .get('/articles')
//         .expect(200, [])
//       })
//     })
//   })
//                   describe('GET/articles/:article_id', () => {
//                     context('Given there are articles in the database', () => {
//                       const testArticles = makeArticlesArray()

//                       beforeEach('insert articles', () => {
//                         return db
//                           .into('blogful_articles')
//                           .insert(testArticles)
//                       })
//                       //make request to express instance using Supertest
//                       it('GET/articles responds with 200 and all of the articles', () => {
//                         return supertest(app)
//                           .get('/articles')
//                           .expect(200, testArticles)
//                       })
//                     })
//   describe('GET/articels/:articles_id', () => {
//     context('Given no articles', () => {
//       it('responds with 404', () => {
//         const articleId = 123456
//         return supertest(app)
//           .get(`/articles/${articleId}`)
//           .expect(404, { error: { message: `Article doesn't exist` } })
//       })
//     })
//   })
//   })
// })

//1.) create test (spec.js) 2. write logic (app.js)
/*
describe(``, () => {
  context(``, () => {
    it(``, () => {
      return
        .httpVerb()
        .expect()
    })
  })
})
*/
