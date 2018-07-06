import Ember from 'ember';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';
import triggerAnalytics from 'irene/utils/trigger-analytics';

const GithubAccountComponent = Ember.Component.extend({

  i18n: Ember.inject.service(),
  ajax: Ember.inject.service(),
  notify: Ember.inject.service('notification-messages-service'),

  isRevokingGithub: false,
  isIntegratingGithub: false,

  tGithubWillBeRevoked: t("githubWillBeRevoked"),

  confirmCallback() {
    const tGithubWillBeRevoked = this.get("tGithubWillBeRevoked");
    this.set("isRevokingGithub", true);
    this.get("ajax").post(ENV.endpoints.revokeGitHub)
    .then(() => {
      this.get("notify").success(tGithubWillBeRevoked);
      if(!this.isDestroyed) {
        this.send("closeRevokeGithubConfirmBox");
        this.set("user.hasGithubToken", false);
        this.set("isRevokingGithub", false);
      }
    }, (error) => {
      if(!this.isDestroyed) {
        this.set("isRevokingGithub", false);
        this.get("notify").error(error.payload.error);
      }
    });
  },

  actions: {

    integrateGithub() {
      triggerAnalytics('feature',ENV.csb.integrateGithub);
      const that = this;
      // TEMP: remove this after implementing adapter
      return this.get("ajax").request('http://localhost:8000/api/organizations/1/github_authorize_url')
        .then(data => {
          window.location.href = data.url;
        })
        .catch(err => {
          that.get("notify").error(err.message, ENV.notifications);
        });
    },

    openRevokeGithubConfirmBox() {
      this.set("showRevokeGithubConfirmBox", true);
    },

    closeRevokeGithubConfirmBox() {
      this.set("showRevokeGithubConfirmBox", false);
    }
  }
});

export default GithubAccountComponent;
