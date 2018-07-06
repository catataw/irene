import Ember from 'ember';
import config from 'irene/config/environment';
import ENV from 'irene/config/environment';

export default Ember.Route.extend({
  title: `GithubRedirect${config.platform}`,
  redirect() {
    const that = this;
    const data = {redirect_url: window.location.href};
    return this.get('ajax').post(ENV.endpoints.authorizeGithub, {data})
      .then(resp => {
        if (resp && resp.data)  {
          that.get("notify").info(resp.data);
        }
      })
      .catch(err => {
        that.get("notify").error(err.message, ENV.notifications);
      })
      .finally(_ => {
        that.transitionTo('authenticated.settings');
      });
  }
});
