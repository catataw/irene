import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['vulnerabilityId'] // eslint-disable-line
});
