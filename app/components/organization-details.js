import Ember from 'ember';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    ajax: Ember.inject.service(),
    me: Ember.inject.service(),
    organization: Ember.inject.service('organization'),
    routing: Ember.inject.service('-routing'),
    notify: Ember.inject.service('notification-messages-service'),

    isNamespaces: true,
    isMembers: false,
    isTeams: false,
    showHide: true,
    editSave: false,
    isSettings: false,

    tOrganizationNameUpdated: t("organizationNameUpdated"),


    /* Initialise tabs state */
    didInsertElement() {
      const route = this.get('routing.currentRouteName');
      const routeName = route.split(".")[2];
      if(routeName === "teams" || routeName === "team") {
        this.set('isNamespaces', false);
        this.set('isMembers', false);
        this.set('isTeams', true);
        this.set('isSettings', false);
      }
      else if(routeName === "members") {
        this.set('isNamespaces', false);
        this.set('isMembers', true);
        this.set('isTeams', false);
        this.set('isSettings', false);
      }
      else if(routeName === "settings") {
        this.set('isNamespaces', false);
        this.set('isMembers', false);
        this.set('isTeams', false);
        this.set('isSettings', true);
      }
    },

    /* Check if org name is empty */
    orgNameDoesNotExist: Ember.computed('organization', function() {
      return this.get('organization').selected.get('name') === '';
    }),


    /* Edit organization name */
    updateOrgName: task(function * () {
      const org = this.get('organization').selected;
      yield org.set('name', org.get('name'));
      yield org.save()
    }).evented(),

    updateOrgNameSucceeded: on('updateOrgName:succeeded', function() {
      this.get('notify').success(this.get('tOrganizationNameUpdated'));

      this.send("cancelEditing");
      this.set('orgNameDoesNotExist', false);
    }),

    updateOrgNameErrored: on('updateOrgName:errored', function(_, err) {
      let errMsg = this.get('tPleaseTryAgain');
      if (err.errors && err.errors.length) {
        errMsg = err.errors[0].detail || errMsg;
      } else if(err.message) {
        errMsg = err.message;
      }

      this.get("notify").error(errMsg);
    }),


    /* Set active tab */
    namespaceClass: Ember.computed('isNamespaces', function() {
      if (this.get('isNamespaces')){
        return 'is-active';
      }
    }),
    memberClass: Ember.computed('isMembers', function() {
      if (this.get('isMembers')){
        return 'is-active';
      }
    }),
    teamClass: Ember.computed('isTeams', function() {
      if (this.get('isTeams')){
        return 'is-active';
      }
    }),
    settingsClass: Ember.computed('isSettings', function() {
      if (this.get('isSettings')){
        return 'is-active';
      }
    }),


    actions: {

      /* Edit controls visibility */
      editOrganization() {
        this.set('showHide', false);
        this.set('editSave', true);
      },
      cancelEditing() {
        this.set('showHide', true);
        this.set('editSave', false);
      },

      /* Select tab */
      displayNamespaces() {
        this.set('isNamespaces', true);
        this.set('isMembers', false);
        this.set('isTeams', false);
        this.set('isSettings', false);
      },
      displayMembers() {
        this.set('isNamespaces', false);
        this.set('isMembers', true);
        this.set('isTeams', false);
        this.set('isSettings', false);
      },
      displayTeams() {
        this.set('isNamespaces', false);
        this.set('isMembers', false);
        this.set('isTeams', true);
        this.set('isSettings', false);
      },
      displaySettings() {
        this.set('isNamespaces', false);
        this.set('isMembers', false);
        this.set('isTeams', false);
        this.set('isSettings', true);
      },

    }
});