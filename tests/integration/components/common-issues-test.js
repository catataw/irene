import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('common-issues', 'Integration | Component | common issues', {
  integration: true
});

test('it renders', function(assert) {
  assert.ok(true);
  assert.equal(this.$().text().trim(), '');
});
