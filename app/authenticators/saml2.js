import { getOwner } from '@ember/application';
import { Promise } from 'rsvp';
import IreneAuth from './irene';
import ENV from 'irene/config/environment';

const b64EncodeUnicode = str => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(`0x${p1}`)));

const getB64Token = (user, token) => b64EncodeUnicode(`${user}:${token}`);

const processData = data => {
  data.b64token = getB64Token(data.user_id, data.token);
  return data;
};

export default IreneAuth.extend({
  authenticate(ssotoken) {
    return new Promise((resolve, reject) => {
      const url = ENV['endpoints']['saml2Login'];
      this.ajax.post(
        url, { data: {token: ssotoken}}
      ).then((data) => {
        data = processData(data);
        resolve(data);
        this.resumeTransistion();
      }, (error) => {
        let msg = "Login failed";
        if(error.payload.message) {
          msg = "Login failed: " + error.payload.message;
        }
        this.notify.error(msg);

        const authenticatedRoute = getOwner(this).lookup("route:authenticated");
        authenticatedRoute.transitionTo('login');
        return reject(msg);
      });
    });
  }
});
