const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

// //controller
// const knex = require('knex');
// const app = require('./app');
// const { PORT, DB_URL } = require('./config');

// const db = knex({
//   client: 'pg',
//   connection: DB_URL
// })

// //set db prop on app instance
// app.set('db', db)

// app.listen(PORT, () => {
//   console.log(`Server listening at http://localhost:${PORT}`);
// })
