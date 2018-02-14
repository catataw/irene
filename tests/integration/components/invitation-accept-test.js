/*
 * DS102: Remove unnecessary code created because of implicit returns
 */
import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('invitation-accept', 'Integration | Component | invitation accept', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with @set 'myProperty', 'value'
  // Handle any actions with @on 'myAction', (val) ->

  this.render(hbs("{{invitation-accept}}"));

  return assert.equal(this.$().text().trim(), 'Security fanatics at your serviceSignup & Accept Invite has invited you to  teamSignup & Accept InviteLogin?');
});
