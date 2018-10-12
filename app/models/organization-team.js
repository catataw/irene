import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  members: DS.hasMany('organization-team-member'),
  organization: DS.attr('string'),
  createdOn: DS.attr('date'),
  membersCount: DS.attr('number'),
  projectsCount: DS.attr('number'),

  async deleteMember(member) {
    var adapter = this.store.adapterFor(this.constructor.modelName);
    await adapter.deleteMember(this.store, this.constructor.modelName, this, member);
    // TODO: fix this to do after showing notification
    this.members.removeObject(member);
    await this.members.reload();
    await this.store.unloadRecord(member);
  },

  async addMember(data, id) {
    var adapter = this.store.adapterFor(this.constructor.modelName);
    return await adapter.addMember(this.store, this.constructor.modelName, this, data, id);
  },

  async addProject(data, id) {
    var adapter = this.store.adapterFor(this.constructor.modelName);
    return await adapter.addProject(this.store, this.constructor.modelName, this, data, id);
  },

  async createInvitation(data) {
    var adapter = this.store.adapterFor(this.constructor.modelName);
    await adapter.createInvitation(this.store, this.constructor.modelName, this, data);
  },
});
