import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  write: DS.attr('boolean'),
  membersCount: DS.attr('number'),
});
