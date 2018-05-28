import Ember from 'ember';
import ENV from 'irene/config/environment';
import ENUMS from 'irene/enums';
import { translationMacro as t } from 'ember-i18n';
import triggerAnalytics from 'irene/utils/trigger-analytics';

export default Ember.Component.extend({
  tagName: "",
  apiScanModal: false,
  dynamicScanModal: false,

  i18n: Ember.inject.service(),
  trial: Ember.inject.service(),
  ajax: Ember.inject.service(),
  notify: Ember.inject.service('notification-messages-service'),

  tStartingScan: t("startingScan"),

  actions: {
    dynamicScan() {
      const file = this.get("file");
      file.setBootingStatus();
      const that = this;
      const file_id = this.get("file.id");
      const dynamicUrl = [ENV.endpoints.dynamic, file_id].join('/');
      this.get("ajax").request(dynamicUrl)
      .catch(function(error) {
        file.setNone();
        that.get("notify").error(error.payload.error);
      });
    },

    setAPIScanOption() {
      const tStartingScan = this.get("tStartingScan");
      const isApiScanEnabled = this.get("isApiScanEnabled");
      const project_id = this.get("file.project.id");
      const apiScanOptions = [ENV.host,ENV.namespace, ENV.endpoints.apiScanOptions, project_id].join('/');
      const that = this;
      const data =
        {isApiScanEnabled};
      this.get("ajax").post(apiScanOptions, {data})
      .then(function(){
        that.get("notify").success(tStartingScan);
        if(!that.isDestroyed) {
          that.send("closeModal");
          that.send("dynamicScan");
        }
      })
      .catch(function(error) {
        that.get("notify").error(error.payload.error);
      });
    },

    doNotRunAPIScan() {
      triggerAnalytics('feature', ENV.csb.runDynamicScan);
      this.set("isApiScanEnabled", false);
      this.send("setAPIScanOption");
    },

    runAPIScan() {
      triggerAnalytics('feature', ENV.csb.runAPIScan);
      this.set("isApiScanEnabled", true);
      this.send("setAPIScanOption");
    },

    showURLFilter(param){
      this.set("showAPIURLFilterScanModal", true);
      if (param === 'api') {
        this.set("showAPIScanModal", false);
        this.set("apiScanModal", true);
        this.set("dynamicScanModal", false);
      }
      if (param === 'dynamic') {
        this.set("showRunDynamicScanModal", false);
        this.set("dynamicScanModal", true);
        this.set("apiScanModal", false);
      }
    },

    openAPIScanModal() {
      const platform = this.get("file.project.platform");
      if ([ENUMS.PLATFORM.ANDROID,ENUMS.PLATFORM.IOS].includes(platform)) { // TEMPIOSDYKEY
        this.set("showAPIScanModal", true);
      } else {
        this.send("doNotRunAPIScan");
      }
    },

    goBack() {
      this.set("showAPIURLFilterScanModal", false);
      if (this.get("apiScanModal")) {
        this.set("showAPIScanModal", true);
      }
      if (this.get("dynamicScanModal")) {
        this.set("showRunDynamicScanModal", true);
      }
    },

    closeModal() {
      this.set("showAPIScanModal", false);
      this.set("showAPIURLFilterScanModal", false);
      this.set("showRunDynamicScanModal", false);
    },

    openRunDynamicScanModal() {
      this.set("showRunDynamicScanModal", true);
    },

    closeRunDynamicScanModal() {
      this.set("showRunDynamicScanModal", false);
    },

    dynamicShutdown() {
      const file = this.get("file");
      const that = this;
      file.setShuttingDown();
      this.set("isPoppedOut", false);
      const file_id = this.get("file.id");
      const shutdownUrl = [ENV.endpoints.dynamicShutdown, file_id].join('/');
      this.get("ajax").request(shutdownUrl)
      .then(function() {
        if(!that.isDestroyed) {
          file.setNone();
        }
      })
      .catch(function(error) {
        file.setNone();
        that.get("notify").error(error.payload.error);
      });
    },

  }
});