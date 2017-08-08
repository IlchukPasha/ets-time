'use strict';
const express = require('express');
const router = express.Router();
const { parallel } = require('async');

const {
  validators: { line_list, line_create, line_edit, line_status, line_delete }
} = require('./../middlewares/index');

const knex = require('./../libs/knex');
const { role } = require('./../middlewares');

const criteriaForList = function(request) {
  let { query: param, _full_list: full_list } = request;
  return function() {
    if (!full_list) {
      param.user = request._user.id;
    }
    if (param.user) {
      this.where('tl.user_id', param.user);
    }
    if (param.project) {
      this.where('tl.project', 'like', '%' + param.project + '%');
    }
    if (param.date_start) {
      this.where('tl.date_task', '>=', param.date_start);
    }
    if (param.date_end) {
      this.where('tl.date_task', '<=', param.date_end);
    }
    if (param.status) {
      this.where('tl.status', param.status);
    }
    if (param.type_work) {
      this.where('tl.type_work', param.type_work);
    }
  };
};

/* Get track lines */
router.get('/', line_list, async (req, res) => {
  parallel(
    {
      count: callback => {
        knex('track_lines as tl')
          .where(criteriaForList(req))
          .leftJoin('users as u', 'u.id', 'tl.user_id')
          .first()
          .count('* as c')
          .asCallback(callback);
      },
      list: callback => {
        knex('track_lines as tl')
          .select('tl.*', 'u.first_name', 'u.last_name', 'u.roles', 'u.position', 'u.locked', 'u.email')
          .where(criteriaForList(req))
          .leftJoin('users as u', 'u.id', 'tl.user_id')
          .orderBy('tl.date_task', 'desc')
          .limit(200)
          .asCallback(callback);
      }
    },
    (err, results) => {
      if (err) {
        res.status(400).end();
      } else if (results) {
        res.json({
          count: results.count.c,
          data: results.list
        });
      }
    }
  );
});

/* Create track line */
router.post('/', line_create, (req, res, next) => {
  knex('track_lines').insert(req._vars).then(() => res.status(201).send()).catch(next);
});

// Update track-line by id
router.patch('/', line_edit, (req, res, next) => {
  knex('track_lines').where({ id: req.body.id }).update(req._vars).then(() => res.status(202).send()).catch(next);
});

// delete track line
router.delete('/', line_delete, (req, res, next) => {
  knex('track_lines')
    .where({ id: req.body.id, user_id: req._user.id })
    .del()
    .then(() => res.status(204).send())
    .catch(next);
});

// update status for track line (by admin | pm)
router.patch('/status', role(['owner', 'pm']), line_status, (req, res, next) => {
  knex('track_lines').where({ id: req.body.id }).update({ status: req.body.status }).then(() => res.send()).catch(next);
});

module.exports = router;
