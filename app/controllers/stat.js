'use strict';
const express = require('express');
const router = express.Router();
const { validators: { stat_user } } = require('./../middlewares');
const knex = require('./../libs/knex');
const env = require('./../config');
const { map, find, each, zipObject, range, extend, cloneDeep, uniq, filter } = require('lodash');
const moment = require('moment');
const async = require('async');

/* Get stat work per user */
router.get('/:user_id', stat_user, (req, res, next) => {
  async.parallel(
    {
      per_projects: callback => {
        knex('track_lines as tl')
          .select('tl.project')
          .select(knex.raw('sum(hours) as total'))
          .where('tl.user_id', req.params.user_id)
          .whereRaw('DATE_FORMAT(tl.date_task, "%Y-%m") = ?', [req.query.month])
          .groupBy('tl.project')
          .asCallback(callback)
          .catch(next);
      },
      per_day: callback => {
        knex('track_lines as tl')
          .select('tl.date_task as date', 'tl.status')
          .select(knex.raw('sum(tl.hours) as total'))
          .where('tl.user_id', req.params.user_id)
          .whereRaw('DATE_FORMAT(tl.date_task, "%Y-%m") = ?', [req.query.month])
          .groupBy('tl.status')
          .groupBy('tl.date_task')
          .then(data => {
            let statuses = zipObject(env.task_status, range(0, env.task_status.length, 0));
            let per_date = map(req.month_days, row => {
              let statusesPerDay = cloneDeep(statuses);
              each(statusesPerDay, (val, key) => {
                let count = find(data, item => moment(item.date).format('YYYY-MM-DD') === row && item.status === key);
                statusesPerDay[key] = count ? count.total : 0;
              });
              return extend({ date: moment(row).format('MMM D') }, statusesPerDay);
            });
            callback(null, per_date);
          })
          .catch(next);
      },
      per_type_work: callback => {
        knex('track_lines as tl')
          .select('tl.type_work')
          .select(knex.raw('sum(hours) as total'))
          .where('tl.user_id', req.params.user_id)
          .whereRaw('DATE_FORMAT(tl.date_task, "%Y-%m") = ?', [req.query.month])
          .groupBy('tl.type_work')
          .then(data => {
            let newData = map(env.type_works, item => {
              let total = find(data, { type_work: item });
              return {
                type_work: item,
                total: total ? total.total : 0
              };
            });
            callback(null, filter(newData, item => item.total > 0));
          })
          .catch(next);
      },
      per_status: callback => {
        knex('track_lines as tl')
          .select('tl.status')
          .select(knex.raw('count(id) as total'))
          .where('tl.user_id', req.params.user_id)
          .whereRaw('DATE_FORMAT(tl.date_task, "%Y-%m") = ?', [req.query.month])
          .groupBy('tl.status')
          .then(data => {
            let newData = map(env.task_status, item => {
              let total = find(data, { status: item });
              return {
                status: item,
                total: total ? total.total : 0
              };
            });
            callback(null, newData);
          })
          .catch(next);
      },
      per_months: callback => {
        knex('track_lines as tl')
          .select(knex.raw("DATE_FORMAT(tl.date_task, '%Y-%m') as month"))
          .select(knex.raw('sum(tl.hours) as total'))
          .select('tl.status')
          .where('tl.user_id', req.params.user_id)
          .groupBy(knex.raw("DATE_FORMAT(tl.date_task, '%Y-%m')"))
          .groupBy('tl.status')
          .orderBy(knex.raw('month'), 'asc')
          .then(data => {
            let statuses = zipObject(env.task_status, range(0, env.task_status.length, 0));
            let months = uniq(map(data, 'month'));
            each(months, (month, key) => {
              let statusesPerDay = cloneDeep(statuses);
              each(statusesPerDay, (v, k) => {
                let ifFind = find(data, item => moment(item.month).format('YYYY-MM') === month && item.status === k);
                statusesPerDay[k] = ifFind ? ifFind.total : 0;
              });
              months[key] = extend({ month: moment(month).format('YYYY MMM') }, statusesPerDay);
            });

            callback(null, months);
          })
          .catch(next);
      },
      radar: callback => {
        knex('skills as s')
          .select('s.name')
          .select(
            knex.raw(
              'ifnull(ROUND((( select sum(sg.value) from skill_gradation as sg where sg.user_id = ? && sg.skill_id in (select id from skills where parent_id = s.id) )) * 100 / (select count(id) * 10 from skills where parent_id = s.id)),0) as percent',
              [req.params.user_id]
            )
          )
          .whereNull('s.parent_id')
          .orderBy('s.name', 'asc')
          .then(data => {
            callback(null, data);
          })
          .catch(next);
      }
    },
    (err, results) => {
      if (err) return next(err);
      res.json(results);
    }
  );
});

module.exports = router;
