/*
 * DS102: Remove unnecessary code created because of implicit returns
 */
import { deviceType } from 'irene/helpers/device-type';
import { module, test } from 'qunit';

module('Unit | Helper | device type');

// Replace this with your real tests.
test('it works', function(assert) {
  const result = deviceType(42);
  return assert.ok(result);
});
