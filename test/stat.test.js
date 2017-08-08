const assert = require('assert');
const app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const async = require('async');
const { difference } = require('lodash');

const urls = {
  stat: '/api/v1/stat'
};

const stat_keys = ['per_months', 'per_status', 'per_day', 'per_type_work', 'per_projects', 'radar'];

let token_owner = jwt.sign({ id: 1 }, env.secret);
let token_member = jwt.sign({ id: 3 }, env.secret);

const getStatsCredentials = [
  [{}, 400, 'User id not exist'],
  [
    {
      user_id: 'id'
    },
    400,
    'User id must be integer'
  ],
  [
    {
      user_id: -1
    },
    400,
    'User id must be at least 1'
  ],
  [
    {
      user_id: 100
    },
    400,
    'User id not found'
  ],
  [
    {
      user_id: 1,
      month: 'data'
    },
    400,
    'Month is not valid data format'
  ],
  [
    {
      user_id: 1,
      month: '20172-50-02'
    },
    400,
    'Invalid month format'
  ],
  [
    {
      user_id: 1,
      month: '2017-50-02'
    },
    400,
    'Invalid month format'
  ]
];

describe('Stat controller', () => {
  before(done => {
    require('./TestCase')(knex, done);
  });

  it('get stats', done => {
    agent.get(urls.stat + '/1').set('authorization', token_owner).end((err, res) => {
      assert.equal(200, res.statusCode);
      assert.deepEqual([], difference(res.body, stat_keys));
      stat_keys.forEach(item => {
        assert.notEqual(null, res.body[item]);
      });
      done();
    });
  });

  it('get stats with month', done => {
    agent.get(urls.stat + '/1?month=2017-06-01').set('authorization', token_owner).end((err, res) => {
      assert.equal(200, res.statusCode);
      assert.deepEqual([], difference(res.body, stat_keys));
      stat_keys.forEach(item => {
        assert.notEqual(null, res.body[item]);
      });
      done();
    });
  });

  it('get stats (without token)', done => {
    agent.get(urls.stat + '/1').expect(401, done);
  });

  it('get stats (as member)', done => {
    agent.get(urls.stat + '/1').set('authorization', token_member).expect(200, done);
  });

  it('get stats errors', done => {
    async.each(
      getStatsCredentials,
      (item, cb) => {
        agent
          .get(urls.stat + '/' + item[0].user_id + '?month=' + item[0].month)
          .set('authorization', token_owner)
          .end((err, res) => {
            if (item[1] === res.statusCode) {
              cb();
            } else {
              cb(new Error(item[2]));
            }
          });
      },
      err => {
        done(err);
      }
    );
  });
});
