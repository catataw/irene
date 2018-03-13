import Ember from 'ember';
import ENUMS from 'irene/enums';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { test, moduleForComponent } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

moduleForComponent('file-header', 'Integration | Component | file header', {
  unit: true,
  needs: [
    'service:i18n',
    'service:ajax',
    'service:notification-messages-service',
    'service:session',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ],
  beforeEach() {
    // set the locale and the config
    Ember.getOwner(this).lookup('service:i18n').set('locale', 'en');
    this.register('locale:en/config', localeConfig);

    // register t helper
    this.register('helper:t', tHelper);

    // start Mirage
    this.server = startMirage();
  },
  afterEach() {
    // shutdown Mirage
    this.server.shutdown();
  }
});

test('it exists', function(assert) {
  const component = this.subject();
  var store = {
    findRecord: function() {
      return [
        {
          id:1,
          type: "manualscan",
          attributes: {
            name: "test"
          }
        }
      ];
    }
  };
  component.set('store', store);

  Ember.run(function() {
    assert.deepEqual(component.get("manualscan"), [{
        id:1,
        type: "manualscan",
        attributes: {
          name: "test"
        }
      }
    ]);
    assert.deepEqual(component.get('filteredEnvironments'), [{"key": "NO_PREFERENCE","value": 0},{"key": "STAGING","value": 1},{"key": "PRODUCTION","value": 2}], "ENVS");
    assert.deepEqual(component.get('filteredAppActions'), [{"key": "NO_PREFERENCE","value": 0},{"key": "HALT","value": 1},{"key": "PROCEED","value": 2}], "ACTIONS");
    assert.deepEqual(component.get('filteredLoginStatuses'), ["yes", "no"], "LOGIN");
    assert.deepEqual(component.get('filteredVpnStatuses'), ["yes", "no"], "VPN");
    assert.deepEqual(component.get('chartOptions'),{ "animation": { "animateRotate": false }, "legend": { "display": false } }, "Chart Options");
    assert.equal(component.didInsertElement(), undefined, "Register Password Copy");
    assert.equal(component.willDestroyElement(), undefined, "Remove Password Copy");

    component.send("addUserRole");
    component.set("newUserRole", "Admin");
    component.set("username", "yash");
    component.set("password", "testpassword");
    component.send("addUserRole");
    component.set("manualscan",
      {
        userRoles: [
          {
            id: 1
          },
          {
            id: 2
          },
          {
            id: 3
          },
        ]
      });
    component.send("addUserRole");
    assert.deepEqual(component.get("allUserRoles"), [{"id": 2},{"id": 3},{"id": 4}], "User Roles");
    assert.equal(component.confirmCallback(), undefined, "User Roles");

    component.send('displayAppInfo');
    assert.equal(component.get("isBasicInfo"), true, "Basic Info");
    component.send('displayLoginDetails');
    assert.equal(component.get("isLoginDetails"), true, "Login Details");
    component.send('displayVPNDetails');
    assert.equal(component.get("isVPNDetails"), true, "VPN Details");

    component.set("apiScanModal", true);
    component.send('goBack');
    component.set("dynamicScanModal", true);
    component.send('goBack');
    assert.equal(component.get("showAPIScanModal"), true, "API Scan Modal");
    assert.equal(component.get("showRunDynamicScanModal"), true, "Dynamic Scan Modal");
    component.send('closeModal');
    assert.equal(component.get("showAPIScanModal"), false, "API Scan Modal");
    assert.equal(component.get("showAPIURLFilterScanModal"), false, "API URL Modal");
    assert.equal(component.get("showRunDynamicScanModal"), false, "Dynamic Scan Modal");

    component.send('openSubscribeModal');
    assert.equal(component.get("showSubscribeModal"), true, "Close Subscribe Modal");
    component.send('closeSubscribeModal');
    assert.equal(component.get("showSubscribeModal"), false, "Open Subscribe Modal");

    component.send('openManualScanModal');
    assert.equal(component.get("showManualScanModal"), true, "Close Manual Scan Modal");
    component.send('closeManualScanModal');
    assert.equal(component.get("showManualScanModal"), false, "Open Manual Scan Modal");

    component.send('openRescanModal');
    assert.equal(component.get("showRescanModal"), true, "Close Manual Scan Modal");
    component.send('closeRescanModal');
    assert.equal(component.get("showRescanModal"), false, "Open Manual Scan Modal");

    component.send('openRunDynamicScanModal');
    assert.equal(component.get("showRunDynamicScanModal"), true, "Close Dynamic Scan Modal");
    component.send('closeRunDynamicScanModal');
    assert.equal(component.get("showRunDynamicScanModal"), false, "Open Dynamic Scan Modal");

    component.set("file", {
      id:1,
      setBootingStatus() {
        return true;
      },
      setShuttingDown() {
        return true;
      },
      name: "appknox",
      project: {
        id: 1,
        platform: ENUMS.PLATFORM.ANDROID
      }
    });

    component.send("openAPIScanModal");
    assert.equal(component.get("showAPIScanModal"), true, "API Scan Modal");
    component.set("file.project.platform", ENUMS.PLATFORM.WINDOWS);
    component.send("openAPIScanModal");

    component.send("getPDFReportLink");

    component.send("dynamicScan");

    component.send("setAPIScanOption");

    component.send("doNotRunAPIScan");
    assert.equal(component.get("isApiScanEnabled"), false, "API Scan Enabled");

    component.send("runAPIScan");
    assert.equal(component.get("isApiScanEnabled"), true, "API Scan Enabled");

    component.set("manualscan", {
      filteredAppEnv:"Staging",
      filteredAppAction: "Proceed",
      minOsVersion: 10.3,
      contact: {
        name: "yash",
        email:  "yash@appknox.com"
      },
      loginRequired: true,
      userRoles: [],
      vpnRequired: true,
      vpnDetails: {},
      additionalComments: "test"
    });

    component.send("saveManualScanForm");

    component.set("manualscan.userRoles", [{id: 1, role: "Admin"},{id: 2, role: "Admin"},{id: 3, role: "Admin"}]);

    component.send("saveManualScanForm");

    component.set("manualscan.vpnDetails", {address: "198.162.0.162", port: 8000, username: "yash",password: "test"});

    component.send("saveManualScanForm");

    component.send("dynamicShutdown");

    component.send("rescanApp");

    assert.equal(component.get("isStartingRescan"), true, "Starting Scan");

  });

});
