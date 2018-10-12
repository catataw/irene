import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Component | settings split', function(hooks) {
  setupTest(hooks);

  test('it renders', function(assert) {
    assert.ok(true);
  });

  test('tapping button fires an external action', function(assert) {

    var component = this.owner.factoryFor('component:settings-split').create();

    run(function() {
      assert.equal(component.get('generalClass'),"is-active", "General");
      component.set("isSecurity", true);
      assert.equal(component.get('securityClass'),"is-active", "Security");
      component.set("isDeveloperSettings", true);
      assert.equal(component.get('developerSettingsClass'),"is-active", "Developer Settings");
      component.send("displayGeneral");
      assert.equal(component.get('isGeneral'),true, "General");
      assert.equal(component.get('isSecurity'),false, "Security");
      assert.equal(component.get('isDeveloperSettings'),false, "Developer Settings");
      component.send("displaySecurity");
      assert.equal(component.get('isGeneral'),false, "General");
      assert.equal(component.get('isSecurity'),true, "Security");
      assert.equal(component.get('isDeveloperSettings'),false, "Developer Settings");
      component.send("displayDeveloperSettings");
      assert.equal(component.get('isGeneral'),false, "General");
      assert.equal(component.get('isSecurity'),false, "Security");
      assert.equal(component.get('isDeveloperSettings'),true, "Developer Settings");

      assert.notOk(component.didInsertElement());

    });
  });
});
