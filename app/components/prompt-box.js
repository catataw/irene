/*
 * DS102: Remove unnecessary code created because of implicit return
 */
import Ember from 'ember';

const PromptBoxComponent = Ember.Component.extend({

  isActive: false,
  classNames: ["modal"],
  classNameBindings: ["isActive:is-active"],
  layoutName: "components/prompt-box",
  inputValue: "",
  delegate: null,

  actions: {

    clearModal() {
      return this.set("isActive", false);
    },

    sendCallback() {
      const inputValue = this.get("inputValue");
      const delegate = this.get("delegate");
      return delegate.promptCallback(inputValue);
    }
  }
});

export default PromptBoxComponent;
