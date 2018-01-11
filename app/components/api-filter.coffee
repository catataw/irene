`import Ember from 'ember'`
`import ENV from 'irene/config/environment';`
`import { translationMacro as t } from 'ember-i18n'`

isRegexFailed = (url) ->
  reg = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
  res = reg.test(url)

ApiFilterComponent = Ember.Component.extend
  project: null
  i18n: Ember.inject.service()
  newUrlFilter: null
  deletedURL: ""

  tEmptyURL: t("emptyURL")
  tInvalidURL: t("invalidURL")
  tURLAdded: t("urlAdded")
  isSavingFilter: false

  confirmCallback: ->
    apiUrlFilters = @get "project.apiUrlFilters"
    deletedURL = @get "deletedURL"
    splittedURLs = apiUrlFilters.split(",")
    index = splittedURLs.indexOf(deletedURL)
    splittedURLs.splice(index,1)
    joinedURLs = splittedURLs.join(",")
    @set "updatedURLFilters", joinedURLs
    @send "saveApiUrlFilter"

  actions:

    addApiUrlFilter: ->
      tInvalidURL = @get "tInvalidURL"
      tEmptyURL = @get "tEmptyURL"
      apiUrlFilters = @get "project.apiUrlFilters"
      newUrlFilter = @get "newUrlFilter"
      if Ember.isEmpty newUrlFilter
        return @get("notify").error tEmptyURL
      else
        return @get("notify").error "#{newUrlFilter} #{tInvalidURL}" if !isRegexFailed newUrlFilter
      if !Ember.isEmpty apiUrlFilters
        combinedURLS = apiUrlFilters.concat("," , newUrlFilter)
      else
        combinedURLS = newUrlFilter
      @set "updatedURLFilters", combinedURLS
      @send "saveApiUrlFilter"

    saveApiUrlFilter: ->
      tURLAdded = @get "tURLAdded"
      updatedURLFilters = @get "updatedURLFilters"
      projectId = @get "project.id"
      apiScanOptions = [ENV.host,ENV.namespace, ENV.endpoints.apiScanOptions, projectId].join '/'
      data =
        apiUrlFilters: updatedURLFilters
      that = @
      analytics.feature(ENV.csb.feature.addAPIEndpoints, ENV.csb.module.security, ENV.csb.product.appknox)
      @set "isSavingFilter", true
      @get("ajax").post apiScanOptions, data: data
      .then (data)->
        that.set "isSavingFilter", false
        that.get("notify").success tURLAdded
        that.set "project.apiUrlFilters", updatedURLFilters
        that.set "newUrlFilter", ""
        that.send "closeRemoveURLConfirmBox"
      .catch (error) ->
        that.set "isSavingFilter", false
        for error in error.errors
          that.get("notify").error error.detail?.message

    openRemoveURLConfirmBox: ->
      @set "deletedURL", event.target.parentElement.parentElement.firstChild.textContent
      @set "showRemoveURLConfirmBox", true

    closeRemoveURLConfirmBox: ->
      @set "showRemoveURLConfirmBox", false




`export default ApiFilterComponent`
