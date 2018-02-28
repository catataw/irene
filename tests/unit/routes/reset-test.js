import { moduleFor, test } from 'ember-qunit';

moduleFor('route:reset', 'Unit | Route | reset', {
});

test('it exists', function(assert) {
  const route = this.subject();
  assert.equal(route.model("test"), "test" , "Route");
});
