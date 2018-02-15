import Ember from 'ember';
import ENV from 'irene/config/environment';
import ENUMS from 'irene/enums';
import { translationMacro as t } from 'ember-i18n';

let roles = ENUMS.COLLABORATION_ROLE.CHOICES.reverse().slice(1);

const CollaborationDetailsComponent = Ember.Component.extend({

  i18n: Ember.inject.service(),

  collaboration: null,
  roles,
  currentRole: roles[0].value,
  tagName: ["tr"],

  tTeam: t("team"),
  isRemovingCollaboration: false,
  tPermissionChanged: t("permissionChanged"),
  tEnterRightTeamName: t("enterRightTeamName"),
  tCollaborationRemoved: t("collaborationRemoved"),

  otherRoles: (function() {
    roles = this.get("roles");
    const selectedRole = this.get("collaboration.role");
    return roles.filter(role => selectedRole !== role.value);
  }).property("roles", "collaboration.role"),

  promptCallback(promptedItem) {
    const tTeam = this.get("tTeam");
    const collaboration = this.get("collaboration");
    const tEnterRightTeamName = this.get("tEnterRightTeamName");
    const tCollaborationRemoved = this.get("tCollaborationRemoved");
    const team = this.get("collaboration.team.name");
    const teamName = team.toLowerCase();
    const promptedTeam = promptedItem.toLowerCase();
    if (promptedTeam !== teamName) {
      return this.get("notify").error(tEnterRightTeamName);
    }
    this.set("isRemovingCollaboration", true);
    const that = this;
    collaboration.destroyRecord()
    .then(function(data){
      that.set("isRemovingCollaboration", false);
      that.get("notify").success(`${tTeam} ${team} ${tCollaborationRemoved}`);
    })
    .catch(function(error) {
      that.set("isRemovingCollaboration", false);
      for (error of error.errors) {
        that.get("notify").error(error.title || undefined);
      }
    });
  },

  actions: {

    changeRole(value) {
      const tPermissionChanged = this.get("tPermissionChanged");
      const currentRole = this.set("currentRole", parseInt(this.$('#role-preference').val()));
      const collaborationId = this.get("collaboration.id");
      const url = [ENV.endpoints.collaborations, collaborationId ].join('/');
      const data =
        {role: currentRole};
      const that = this;
      this.get("ajax").post(url , {data})
      .then(data=> that.get("notify").success(tPermissionChanged))
      .catch(function(error) {
        that.get("notify").error(error.payload.message, ENV.notifications);
      });
    },

    openAddCollaborationPrompt() {
      this.set("showAddCollaborationPrompt", true);
    },

    closeAddCollaborationPrompt() {
      this.set("showAddCollaborationPrompt", false);
    }
  }
});


export default CollaborationDetailsComponent;
