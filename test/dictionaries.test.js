const assert = require('assert');
const app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const { difference } = require('lodash');

const token_owner = jwt.sign({ id: 1 }, env.secret);
const urls = {
  dict: '/api/v1/dictionaries'
};

describe('Dictionaries controller', () => {
  before(done => {
    require('./TestCase')(knex, done);
  });

  it('dictionaries', done => {
    const need_keys = ['type_works', 'task_status', 'positions', 'roles', 'projects'];
    agent.get(urls.dict).set('authorization', token_owner).end((err, res) => {
      assert.equal(200, res.statusCode);
      assert.deepEqual([], difference(need_keys, Object.keys(res.body)), 'difference in keys');
      assert.equal(true, res.body.type_works.includes('Development'));
      assert.equal(true, res.body.type_works.length > 0);
      assert.deepEqual([], difference(res.body.task_status, env.task_status));
      assert.deepEqual([], difference(res.body.positions, env.positions));
      assert.deepEqual([], difference(res.body.roles, env.roles));
      done();
    });
  });
  it('dictionaries (without auth)', done => {
    agent.get(urls.dict).expect(401, done);
  });
});
