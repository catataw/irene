import { run } from '@ember/runloop';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);
  });

  test('it exists', function(assert) {
    const user = run(() => this.owner.lookup('service:store').createRecord('user'));

    run(function() {
      assert.equal(user.get('provisioningURL'), "otpauth://totp/Appknox:undefined?secret=undefined&issuer=Appknox", "ProvisioningURL");

      assert.equal(user.get('mfaEnabled'), false, "MFA Disabled");
      user.set('mfaMethod', 1);
      assert.equal(user.get('mfaEnabled'), true, "MFA Enabled");

      user.set('projectCount', 2);
      assert.equal(user.get('totalProjects'), "2 projects", "Many Projects");
      user.set('projectCount', 1);
      assert.equal(user.get('totalProjects'), "1 project", "1 Project");
      user.set('projectCount', 0);
      assert.equal(user.get('totalProjects').string, "No projects", "No Project");

      assert.equal(user.get('ifBillingIsNotHidden'), true, "Billing Hidden");

      user.set('expiryDate', new Date("25 March 2015"));
      user.set('devknoxExpiry', new Date("25 March 2015"));

      assert.equal(user.get('hasExpiryDate'), true, "Has Expiry Date");
      user.set('getExpiryDate', "");
      assert.equal(user.get('hasExpiryDate'), false, "No Expiry Date");

      assert.equal(user.get('expiryText'), "subscriptionExpired", "Expiry Text");
      user.set('expiryDate', new Date("25 March 2019"));
      assert.equal(user.get('expiryText'), "subscriptionWillExpire", "Expiry Text");

      assert.equal(user.get('namespaceItems'), undefined, "Namespace Items");
    });
  });
});
