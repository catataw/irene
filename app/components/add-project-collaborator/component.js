import Ember from 'ember';
import PaginateMixin from 'irene/mixins/paginate';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';

export default Ember.Component.extend(PaginateMixin, {
  i18n: Ember.inject.service(),
  realtime: Ember.inject.service(),
  notify: Ember.inject.service(),

  query: '',
  searchQuery: '',
  isAddingCollaborator: false,
  showAddProjectCollaboratorModal: false,

  tProjectCollaboratorAdded: t('projectCollaboratorAdded'),
  tPleaseTryAgain: t('pleaseTryAgain'),

  targetObject: 'organization-member',
  sortProperties: ['created:desc'],
  extraQueryStrings: Ember.computed('collaborator.id', 'searchQuery', function() {
    const query = {
      q: this.get('searchQuery'),
      exclude_project: this.get('project.id')
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newProjectNonCollaboratorCountersObserver: Ember.observer('realtime.ProjectNonCollaboratorCounter', function() {
    return this.incrementProperty('version');
  }),


  /* Open add-project-collaborator modal */
  openAddCollaboratorModal: task(function * () {
    yield this.set('showAddProjectCollaboratorModal', true);
  }),


  /* Add collaborator to project */
  addProjectCollaborator: task(function * (member) {
    this.set('isAddingCollaborator', true);

    const prj = yield this.get('store').queryRecord('organization-project', {id: this.get('project.id')});
    const data = {
      write: false
    };
    yield prj.addCollaborator(data, member.id);

    this.get('realtime').incrementProperty('ProjectCollaboratorCounter');
    this.get('sortedObjects').removeObject(member);
  }).evented(),

  addProjectCollaboratorSucceeded: on('addProjectCollaborator:succeeded', function() {
    this.get('notify').success(this.get('tProjectCollaboratorAdded'));

    this.set('isAddingCollaborator', false);
    this.set('query', '');
  }),

  addProjectCollaboratorErrored: on('addProjectCollaborator:errored', function(_, err) {
    let errMsg = this.get('tPleaseTryAgain');
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.get('notify').error(errMsg);

    this.set('isAddingCollaborator', false);
    this.set('query', '');
  }),

  /* Set debounced searchQuery */
  setSearchQuery() {
    this.set('searchQuery', this.get('query'));
  },

  actions: {
    searchQuery() {
      Ember.run.debounce(this, this.setSearchQuery, 500);
    },
  }

});
