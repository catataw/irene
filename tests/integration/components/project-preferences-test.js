import { run } from '@ember/runloop';
import ENUMS from 'irene/enums';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | project preferences', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // register t helper
    this.owner.register('helper:t', tHelper);

    // start Mirage
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    // shutdown Mirage
    this.server.shutdown();
  });

  test('tapping button fires an external action', function(assert) {
    var component = this.owner.factoryFor('component:project-preferences').create();
    var store = {
      findAll: function() {
        return [
          {
            id:1,
            type: "device",
            attributes: {
              name: "test",
              platform: 1
            }
          }
        ];
      },
      queryRecord: function() {
        return [
          {
            id:1,
            type: "device-preference",
            attributes: {
              deviceType: 1,
              platformVersion: "7.0"
            }
          }
        ];
      }
    };
    component.set('store', store);
    run(function() {
      component.set("profileId", 1);
      component.send('versionSelected');
      assert.deepEqual(component.get("devices"), [{
        "attributes": {
          "name": "test",
          "platform": 1
        },
        "id": 1,
        "type": "device"
        }
      ], 'devices');
      assert.deepEqual(component.get("devicePreference"), [{
        "attributes": {
          "deviceType": 1,
          "platformVersion": "7.0"
        },
        "id": 1,
        "type": "device-preference"
        }
      ], 'device preference');
      assert.equal(component.get("isSavingPreference"), true, 'Saving Preference');
      component.set("selectedDeviceType", ENUMS.DEVICE_TYPE.NO_PREFERENCE);
    });
  });
});
