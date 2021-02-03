// 1. make object to export
const ArticlesService = {
  //2. methods to store transactions
  getAllArticles(knex) {
    // return 'all the articles!!'
    // return Promise.resolve('all the articles!!')
    return knex.select('id', 'date_published', 'title', 'content').from('blogful_articles')
  },
  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      // Expected: AssertionError: expected [ Array(1) ] to deeply equal { Object (id, title, ...) }
      //fix
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('blogful_articles').select('*').where('id', id).first()
  },
  updateArticle(knex, id, newArticleFields) {
    return knex('blogful_articles')
      .where({ id })
      .update(newArticleFields)
  },
  deleteArticle(knex, id) {
    return knex('blogful_articles')
      .where({ id })
      .delete()
  }
};

module.exports = ArticlesService;

// https://github.com/Thinkful-Ed/first-blogful-spec-solution/blob/master/test/articles-service.spec.js