`import Ember from 'ember';`
`import Notify from 'ember-notify';`
`import serialize from 'irene/utils/serialize';`
`import ENV from 'irene/config/environment';`


GCSUploader = EmberUploader.Uploader.extend
  ###
  #  Url used to request a signed upload url
  #  @property url
  ###

  url: null

  sign: (file) ->
    settings =
      url: @get 'url'
      type: 'GET'
      contentType: 'json'
      data:
        content_type: "application/octet-stream"

    new Ember.RSVP.Promise (resolve, reject) ->

      settings.success = (json)->
        resolve json
      settings.error = ->
        Notify.error "Server failed to return Signed URL"
        reject()
      Ember.$.ajax settings


  upload: (file) ->
    self = @

    signSuccess = (json)->

      uploadSuccess = (respData) ->
        debugger
        Notify.success "File Uploaded Successfully. Please wait while we process your file."
        self.didUpload json.file_key, json.file_key_signed

      uploadError = (xhr) ->
        if xhr.status is 200
          Notify.success "File Uploaded Successfully. Please wait while we process your file."
          self.didUpload json.file_key, json.file_key_signed
        else
          Notify.error "Error While signing the file."

      url  = json.url
      settings =
        url: url
        method: "PUT"
        contentType: "application/octet-stream"
        processData: false
        xhrFields:
          withCredentials: false
        xhr: ->
          xhr = Ember.$.ajaxSettings.xhr()
          xhr.upload.onprogress = (e) ->
            self.didProgress e
          self.one 'isAborting', -> xhr.abort()
          xhr
        data: file
        success: uploadSuccess
        error: uploadError
      Ember.$.ajax settings

    signError = ->
      Notify.error "Error While signing the file."

    @sign(file).then signSuccess, signError

`export default GCSUploader;`
