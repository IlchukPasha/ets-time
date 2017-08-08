const assert = require('assert');
const app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const async = require('async');

const urls = {
  auth: '/api/v1/auth',
  me: '/api/v1/auth/me'
};

let token_owner = jwt.sign({ id: 1 }, env.secret);

const authCredentials = [
  [
    {
      email: 'notexist@mail.com',
      password: 'password'
    },
    400,
    'Email not exist'
  ],
  [
    {
      password: 'password'
    },
    400,
    'Without email'
  ],
  [
    {
      email: 'owner@mail.com'
    },
    400,
    'Without password'
  ],
  [
    {
      email: 'email',
      password: 'password'
    },
    400,
    'With invalid email'
  ],
  [
    {
      email: 'owner@mail.com',
      password: 'pass'
    },
    400,
    'Short password'
  ],
  [
    {
      email: 'locked@tmail.com',
      password: 'password'
    },
    401,
    'Locked user'
  ],
  [
    {
      email: 'owner@mail.com',
      password: 'incorrectpassword'
    },
    401,
    'Incorrect password'
  ]
];

describe('Authorize controller', () => {
  before(done => {
    require('./TestCase')(knex, done);
  });

  it('auth errors', done => {
    async.each(
      authCredentials,
      (item, cb) => {
        agent.post(urls.auth).send(item[0]).end((err, res) => {
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

  it('auth', done => {
    agent
      .post(urls.auth)
      .send({
        email: 'owner@mail.com',
        password: 'password'
      })
      .end((err, res) => {
        assert.equal(200, res.statusCode);
        assert.notEqual(null, res.body.token);
        assert.equal('owner@mail.com', res.body.email);
        done();
      });
  });

  it('me', done => {
    agent.get(urls.me).set('authorization', token_owner).end((err, res) => {
      assert.equal(200, res.statusCode);
      assert.equal(1, res.body.id);
      done();
    });
  });

  it('me (without token)', done => {
    agent.get(urls.me).expect(401, done);
  });

  it('me (with invalid token)', done => {
    agent.get(urls.me).set('authorization', 'invalid_token').expect(401, done);
  });
});
