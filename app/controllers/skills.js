'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const knex = require('./../libs/knex');
const {
  validators: {
    skill_create: create,
    skill_edit: edit,
    skill_delete: remove,
    skill_user_attach: user_attach,
    skill_list: list
  }
} = require('./../middlewares/index');

/* List skills users and other */
router.get('/(:user_id)?', list, (req, res, next) => {
  knex('skills as s')
    .select('s.*', knex.raw('ifnull(sg.value,0) as user_value'))
    .orderBy('s.name', 'asc')
    .leftJoin('skill_gradation as sg', function() {
      this.on('sg.skill_id', '=', 's.id').andOn('sg.user_id', knex.raw('?', [req._user_id]));
    })
    .then(rows => {
      let mainSkill = _.filter(rows, row => row.parent_id === null);
      _.each(mainSkill, row => {
        row['children'] = _.filter(rows, itemrow => itemrow.parent_id === row.id);
      });
      res.json(mainSkill);
    })
    .catch(next);
});

/* Attach skill to user */
router.put('/', user_attach, (req, res, next) => {
  let { skill_id, user_id, value } = req.body;
  knex('skill_gradation')
    .where({ skill_id: skill_id, user_id: user_id })
    .first()
    .then(row => {
      if (row) {
        knex('skill_gradation')
          .where({ skill_id: skill_id, user_id: user_id })
          .update({ value: value })
          .then(() => res.status(202).end())
          .catch(next);
      } else {
        knex('skill_gradation').insert(req._vars).then(() => res.status(201).end()).catch(next);
      }
    })
    .catch(next);
});

/* Create skill */
router.post('/', create, (req, res, next) => {
  knex('skills').insert(req._vars).then(() => res.status(201).end()).catch(next);
});

/* Edit skill */
router.patch('/', edit, (req, res, next) => {
  knex('skills')
    .where({ id: req.body.id, parent_id: req.body.parent_id })
    .update(req._vars)
    .then(() => res.end())
    .catch(next);
});

/* Remove skill */
router.delete('/', remove, (req, res, next) => {
  knex('skills').where('id', req.body.id).del().then(() => res.status(204).end()).catch(next);
});

module.exports = router;
