import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Component | prompt box', function(hooks) {
  setupTest(hooks);

  test('tapping button fires an external action', function(assert) {
    assert.expect(1);

    var component = this.owner.factoryFor('component:prompt-box').create();

    run(function() {
      component.send('clearModal');
      assert.equal(component.get('isActive'),false, "Clear Modal");
    });
  });
});
