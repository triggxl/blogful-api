const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe.only('Articles Endpoints', () => {
  //'only' run working on this suite
  let db
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    //setting app.set('db', knexInstance) inside our tests
    app.set('db', db)
  })
  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('blogful_articles').truncate())

  afterEach('cleanup', () => db('blogful_articles').truncate())

  context('Given there are articles in the database', () => {
    const testArticles = [
      {
        id: 1,
        date_published: '2029-01-22T16:28:32.615Z',
        title: `First test post!`,
        content: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?`
      },
      {
        id: 2,
        date_published: '2100-05-22T16:28:32.615Z',
        title: `Second test post!`,
        content: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?`
      },
      {
        id: 3,
        date_published: '1919-12-22T16:28:32.615Z',
        title: `Third test post!`,
        content: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?`
      },
      {
        id: 4,
        date_published: '1919-12-22T16:28:32.615Z',
        title: 'Fourth test post!',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum molestiae accusamus veniam consectetur tempora, corporis obcaecati ad nisi asperiores tenetur, autem magnam. Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam?'
      }
    ]
    before('insert articles', () => {
      return db
        .into('blogful_articles')
        .insert(testArticles)
    })
    //make request to express instance using Supertest
    it('GET/articles responds with 200 and all of the articles', () => {
      return supertest(app)
        .get('/articles')
        .expect(200, testArticles)
    })
    it('GET/articles/:articles_id responds with 200 and the specified article', () => {
      const articleId = 2;
      const expectedArticle = testArticles[articleId - 1];
      return supertest(app)
        .get(`/articles/${articleId}`)
        .expect(200, expectedArticle)
    })
  })
})