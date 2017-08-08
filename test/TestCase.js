module.exports = (knex, done) => {
  knex.migrate
    .rollback()
    .then(() => {
      knex.migrate
        .latest()
        .then(() => {
          done();
        })
        .catch(done);
    })
    .catch(done);
};
