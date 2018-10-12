import ENV from 'irene/config/environment';
import DRFAdapter from 'irene/adapters/drf';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DRFAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:irene',
  host: ENV.host,
  namespace: "api/hudson-api",
  addTrailingSlashes: false,

  query: function query(store, type, q) {
    let url = `${this.host}/${this.namespace}/projects/${q.projectId}/files?limit=${q.limit}&offset=${q.offset}`;
    return this.ajax(url, 'GET');
  },

  _buildURL: function _buildURL(modelName, id) {
    if(id) {
      return `${this.host}/${this.namespace}/files/${id}`;
    }
  }
});
