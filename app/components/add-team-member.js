import { debounce } from '@ember/runloop';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';
import ENV from 'irene/config/environment';
import { on } from '@ember/object/evented';
import triggerAnalytics from 'irene/utils/trigger-analytics';

export default Component.extend(PaginateMixin, {
  i18n: service(),
  realtime: service(),
  notify: service(),

  query: '',
  searchQuery: '',
  isAddingMember: false,
  showAddTeamMemberModal: false,

  tTeamMemberAdded: t('teamMemberAdded'),
  tPleaseTryAgain: t('pleaseTryAgain'),

  targetObject: 'organization-user',
  sortProperties: ['created:desc'], // eslint-disable-line
  extraQueryStrings: computed('team.id', 'searchQuery', function() {
    const query = {
      q: this.searchQuery,
      exclude_team: this.get('team.id')
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newOrganizationNonTeamMembersObserver: observer('realtime.OrganizationNonTeamMemberCounter', function() {
    return this.incrementProperty('version');
  }),


  /* Open add-team-member modal */
  openAddMemberModal: task(function * () {
    yield this.set('showAddTeamMemberModal', true);
  }),


  /* Add member to team */
  addTeamMember: task(function * (member) {
    this.set('isAddingMember', true);
    const data = {
      write: false
    };
    const team = this.team;
    yield team.addMember(data, member.id);

    this.realtime.incrementProperty('TeamMemberCounter');
    this.sortedObjects.removeObject(member);
  }).evented(),

  addTeamMemberSucceeded: on('addTeamMember:succeeded', function() {
    this.notify.success(this.tTeamMemberAdded);
    this.set('isAddingMember', false);
    this.set('query', '');
    triggerAnalytics('feature', ENV.csb.addTeamMember);
  }),

  addTeamMemberErrored: on('addTeamMember:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);

    this.set('isAddingMember', false);
    this.set('query', '');
  }),

  /* Set debounced searchQuery */
  setSearchQuery() {
    this.set('searchQuery', this.query);
  },

  actions: {
    searchQuery() {
      debounce(this, this.setSearchQuery, 500);
    },
  }

});
