const assert = require('assert');
const hasRole = require('./../app/libs/hasRole');

let roles = [
  // user roles | need role
  [['owner', 'pm'], ['pm'], true],
  [['owner', 'pm'], ['pm', 'owner'], true],
  [['member'], ['pm', 'member'], true],
  [['member'], ['pm', 'owner'], false],
  [['owner', 'pm'], ['member'], false],
  [['member'], ['pm', 'owner'], false],
  [['owner'], ['pm', 'member'], false],
  [['pm'], ['owner', 'member'], false]
];

describe('hasRole', () => {
  it('test roles', () => {
    roles.forEach((spec, key) => {
      let [roles, user_roles, resultOfAssert] = spec;
      assert.equal(resultOfAssert, hasRole(user_roles, roles), 'at line: ' + key);
    });
  });
});
