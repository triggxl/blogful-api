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

  //setting body of the request using column defaults
  describe.only(`POST /articles`, () => {
    it(`creates an article responding with 201 and the new article`, () => {
      //run 3x before declaring failure to reduce variance in accuracy of dates
      this.retries(3)
      const newArticle = {
        title: 'Test new article',
        style: 'Listicle',
        content: 'Test new article content..'
      }
      return supertest(app)
        .post('/articles')
        .send(newArticle)
        .expect(201)
        .expect(res => {
          expect(res.title).to.eql(newArticle.title)
          expect(res.style).to.eql(newArticle.style)
          // check that res contains req.body && id
          expect(res.body.content).to.eql(newArticle.content)
          expect(res.body).to.have.property('id')
          //location of header for new article
          expect(res.headers.location).to.eql(`/articles/${res.body.id}`)
          //second assertion to compare date and time
          const expected = new Date().toLocaleString()
          const actual = new Date(res.body.date_published).toLocaleString()
          expect(actual).to.eql(expected)
        })
        //validate both response bodies (POST and GET) match; (shows difference between expected and actual)
        .then(postRes =>
          supertest(app)
            .get(`articles/${postRes.body.id}`)
            .expect(postRes.body)
        )
    })
  })

  const requiredFields = ['title', 'style', 'content']

  requiredFields.forEach(field => {
    const newArticle = {
      title: 'Test new article',
      style: 'Listicle',
      content: 'Test new article content..'
    }

    it(`responds with 400 and an error message when the '${field}' is missing`, () => {
      delete newArticle[field]

      return supertest(app)
        .post('/articles')
        .send({
          error: { message: `Missing '${field}' ` }
        })
    })
  })
})

// it(`responds with 400 and an eror message when the 'title' is missing`, () => {
//   return supertest(app)
//     .post(`/articles`)
//     .send({
//       style: 'Listicle',
//       content: 'Test new article content..'
//     })
//     .expect(400, {
//       error: { message: `Missing 'title' in request body` }
//     })
// })
// it(`responds with 400 and an error message when the 'content' is missing`, () => {
//   return supertest(app)
//     .post('/articles')
//     .send({
//       title: 'Test new article',
//       style: 'Listicle'
//     })
//     .expect(400, {
//       error: { message: `Missing 'content in request body` }
//     })
// })
// it(`responds with 400 and an error message when the 'style' is missing`, () => {
//   return supertest(app)
//     .send({
//       title: 'Test new article',
//       content: 'Test new article content..'
//     })
//     .expect(400, {
//       error: { message: `Missing 'style' in request body` }
//     })
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
