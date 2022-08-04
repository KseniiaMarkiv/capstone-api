/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts
Released under the MIT license
 */;

(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form:not([data-turbo=true])',
        formInputClickSelector: 'form:not([data-turbo=true]) input[type=submit], form:not([data-turbo=true]) input[type=image], form:not([data-turbo=true]) button[type=submit], form:not([data-turbo=true]) button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var nonce;

      nonce = null;

      Rails.loadCSPNonce = function() {
        var ref;
        return nonce = (ref = document.querySelector("meta[name=csp-nonce]")) != null ? ref.content : void 0;
      };

      Rails.cspNonce = function() {
        return nonce != null ? nonce : Rails.loadCSPNonce();
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          CSRFProtection(xhr);
        }
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.setAttribute('nonce', cspNonce());
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'fieldset[disabled] *')) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      Rails.confirm = function(message, element) {
        return confirm(message);
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = Rails.confirm(message, element);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, isXhrRedirect, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        if (e instanceof Event) {
          if (isXhrRedirect(e)) {
            return;
          }
          element = e.target;
        } else {
          element = e;
        }
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        if (getData(element, 'ujs:disabled')) {
          return;
        }
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        if (getData(element, 'ujs:disabled')) {
          return;
        }
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

      isXhrRedirect = function(event) {
        var ref, xhr;
        xhr = (ref = event.detail) != null ? ref[0] : void 0;
        return (xhr != null ? xhr.getResponseHeader("X-Xhr-Redirect") : void 0) != null;
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.preventInsignificantClick = function(e) {
        var data, insignificantMetaClick, link, metaClick, method, nonPrimaryMouseClick;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        insignificantMetaClick = metaClick && method === 'GET' && !data;
        nonPrimaryMouseClick = (e.button != null) && e.button !== 0;
        if (nonPrimaryMouseClick || insignificantMetaClick) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMethod, handleRemote, loadCSPNonce, preventInsignificantClick, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, loadCSPNonce = Rails.loadCSPNonce, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, preventInsignificantClick = Rails.preventInsignificantClick, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null)) {
        if (jQuery.rails) {
          throw new Error('If you load both jquery_ujs and rails-ujs, use rails-ujs only.');
        }
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        document.addEventListener('DOMContentLoaded', loadCSPNonce);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function() {
    'use strict';

    angular.module('spa-demo', [
        'ui.router',
        'spa-demo.config',
        'spa-demo.authn',
        'spa-demo.layout',
        'spa-demo.foos',
        'spa-demo.subjects'
    ]);

})();
(function() {
    'use strict';
    //  'use babel';

    var myApp = angular.module('spa-demo')

    myApp.config(['$stateProvider', '$urlRouterProvider', 'APP_CONFIG', function($stateProvider, $urlRouterProvider, APP_CONFIG) {
        var homeState = {
            name: 'home',
            url: '/',
            templateUrl: APP_CONFIG.main_page_html
        }
        var accountSignup = {
            name: 'accountSignup',
            url: '/signup',
            templateUrl: APP_CONFIG.signup_page_html
        }
        var authnState = {
            name: "authn",
            url: "/authn",
            templateUrl: APP_CONFIG.authn_page_html
        }
        var imageState = {
            name: "images",
            url: "/images/:id",
            templateUrl: APP_CONFIG.images_page_html
        }
        $stateProvider.state(homeState);
        $stateProvider.state(accountSignup);
        $stateProvider.state(authnState);
        $stateProvider.state(imageState);

        $urlRouterProvider.otherwise('/');
    }]);
})();
(function() {
  "use strict";

  angular
    .module("spa-demo.config", [])
    .constant('APP_CONFIG', {
      'server_url': "",
      'main_page_html': '/assets/spa-demo/pages/main-aaeae593a605cc2b0bece3fd21beb0b78f7d55d886f1de9abc1e119cb86988c9.html',
      'navbar_html': '/assets/spa-demo/layout/navbar/navbar-3584dc1238cfb3730921a6875aee02390916ed914102d884f4095a7f20395e3f.html',
      'signup_page_html': "/assets/spa-demo/pages/signup_page-47ad58f07c3eb5920310315793163d951c398c194ddae69b98d31b67642cdf37.html",
      'authn_signup_html': "/assets/spa-demo/authn/signup/signup-797b899fa508c764d4f1465d758e4edf32e6379d0cb559392d4be313f04c39b6.html",
      'authn_session_html': "/assets/spa-demo/authn/authn_session/authn_session-a607754a8f11782dd62ea0c881c766f8b797e8cc0f80f22f2f62dbb9d3032cec.html",
      'authn_page_html': "/assets/spa-demo/pages/authn_page-b369675392e053c2c3c48af34484a700e433fcc7b9b731037aa851b168c9168c.html",
      'images_page_html': "/assets/spa-demo/pages/images_page-7d6820a8477f9332c403b32e1d3b6dd8dd1f7efa7375cc83be12896c6b237051.html",
      'image_selector_html': "/assets/spa-demo/subjects/images/image_selector-083decd045cc67de243f308f0c9e94c67b2ebda758270c8a39df2fc9a9d96d98.html",
      'image_editor_html': "/assets/spa-demo/subjects/images/image_editor-2db6bb9c698b1d68afd8a161730a42a8c7bd05a762517916b17014bc858c8666.html",
      'foos_html': "/assets/spa-demo/foos/foos-881e3113f9cba12c5050386f3500877e9b58e776a7b0cba42cb4ebdf187690a4.html",

      })

})();
(function() {
  "use strict";

  angular
    .module("spa-demo.authn", [
      "ng-token-auth"
    ]);
})();
(function() {
    "use strict";

    var myApp = angular.module('spa-demo.authn')
    myApp.config(['$authProvider', 'APP_CONFIG', function($authProvider, APP_CONFIG) {
        $authProvider.configure({
            apiUrl: APP_CONFIG.server_url
        });
    }]);

})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.service('Authn', ['$auth', '$q', function($auth, $q) {
        var service = this;
        service.signup = signup;
        service.user = null;
        service.isAuthenticated = isAuthenticated;
        service.getCurrentUser = getCurrentUser;
        service.getCurrentUserName = getCurrentUserName;
        service.login = login;
        service.logout = logout;

        activate();
        return;
        ////////////////
        function activate() {
            $auth.validateUser().then(
                function(user) {
                    service.user = user;
                    console.log("validated user", user);
                });
        }

        function signup(registration) {
            return $auth.submitRegistration(registration);
        }

        function isAuthenticated() {
            return service.user != null && service.user["uid"] != null;
        }

        function getCurrentUserName() {
            return service.user ? service.user.name : null;
        }

        function getCurrentUser() {
            return service.user;
        }

        function login(credentials) {
            console.log("login", credentials.email);
            var result = $auth.submitLogin({
                email: credentials["email"],
                password: credentials["password"]
            });
            var deferred = $q.defer();
            result.then(
                function(response) {
                    console.log("login complete", response);
                    service.user = response;
                    deferred.resolve(response);
                },
                function(response) {
                    var formatted_errors = {
                        errors: {
                            full_messages: response.errors
                        }
                    };
                    console.log("login failure", response);
                    deferred.reject(formatted_errors);
                });
            return deferred.promise;
        }

        function logout() {
            console.log("logout");
            var result = $auth.signOut();
            result.then(
                function(response) {
                    service.user = null;
                    console.log("logout complete", response);
                },
                function(response) {
                    service.user = null;
                    console.log("logout failure", response);
                    alert(response.status + ":" + response.statusText);
                });
            return result;
        }
    }])
})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.factory('spa-demo.authn.whoAmI', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/authn/whoami");
    }]);
})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.factory('spa-demo.authn.checkMe', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/authn/checkme");
    }]);
})();
(function() {
    "use strict";

    angular
        .module("spa-demo.authn")
        .component("sdSignup", {
            templateUrl: templateUrl,
            controller: SignupController,
        });


    templateUrl.$inject = ['APP_CONFIG'];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.authn_signup_html;
    }

    SignupController.$inject = ['$scope', '$state', 'Authn'];

    function SignupController($scope, $state, Authn) {
        var vm = this;
        vm.signupForm = {}
        vm.signup = signup;
        vm.getCurrentUser = Authn.getCurrentUser;

        vm.$onInit = function() {
            console.log("SignupController", $scope);
        }
        return;
        //////////////
        function signup() {
            console.log("signup...");
            $scope.signup_form.$setPristine();
            Authn.signup(vm.signupForm).then(
                function(response) {
                    vm.id = response.data.data.id;
                    console.log("signup complete", response.data, vm);
                    $state.go("home");
                },
                function(response) {
                    vm.signupForm["errors"] = response.data.errors;
                    console.log("signup failure", response, vm);
                }
            );
        }

    }
})();
(function() {
    "use strict";

    angular
        .module("spa-demo.authn")
        .component("sdAuthnSession", {
            templateUrl: templateUrl,
            controller: AuthnSessionController,
        });


    templateUrl.$inject = ["APP_CONFIG"];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.authn_session_html;
    }

    AuthnSessionController.$inject = ["$scope", "Authn"];

    function AuthnSessionController($scope, Authn) {
        var vm = this;
        vm.loginForm = {}
        vm.login = login;
        vm.logout = logout;
        vm.getCurrentUser = Authn.getCurrentUser;
        vm.getCurrentUserName = Authn.getCurrentUserName;

        vm.$onInit = function() {
            console.log("AuthnSessionController", $scope);
        }
        vm.$postLink = function() {
            vm.dropdown = $("#login-dropdown")
        }
        return;
        //////////////
        function login() {
            //console.log("login");
            $scope.login_form.$setPristine();
            vm.loginForm["errors"] = null;
            Authn.login(vm.loginForm),

                function(response) {
                    vm.loginForm["errors"] = response.errors;
                };
        }

        function logout() {
            Authn.logout();
            console.log("logout")
        }
    }
})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.directive('sdAuthnCheck', function() {
        var directive = {
            bindToController: true,
            controller: 'spa-demo.authn.AuthnCheckController',
            controllerAs: "idVM",
            restrict: "A",
            scope: false, // cuz have child scope
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            console.log("AuthnCheck", scope);
        }
    });
})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.controller('spa-demo.authn.AuthnCheckController', ['$auth', 'spa-demo.authn.whoAmI', 'spa-demo.authn.checkMe', function($auth, whoAmI, checkMe) {
        var vm = this;
        vm.client = {}
        vm.server = {}
        vm.getClientUser = getClientUser;
        vm.whoAmI = getServerUser;
        vm.checkMe = checkServerUser;

        return;
        //////////////
        function getClientUser() {
            vm.client.currentUser = $auth.user;
        }

        function getServerUser() {
            vm.server.whoAmI = null;
            whoAmI.get().$promise.then(
                function(value) { vm.server.whoAmI = value; },
                function(value) { vm.server.whoAmI = value; }
            );
        }

        function checkServerUser() {
            vm.server.checkMe = null;
            checkMe.get().$promise.then(
                function(value) { vm.server.checkMe = value; },
                function(value) { vm.server.checkMe = value; }
            );
        }
    }])
})();
(function() {
    "use strict";

    angular.module('spa-demo.layout', []);
})();
(function() {
    'use strict';

    angular
        .module('spa-demo.layout')
        .component('sdNavbar', {
            templateUrl: templateUrl,
            controller: NavbarController
        });


    templateUrl.$inject = ['APP_CONFIG'];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.navbar_html;
    }

    NavbarController.$inject = ['$scope', 'Authn'];

    function NavbarController($scope, Authn) {
        var vm = this;
        vm.getLoginLabel = getLoginLabel;

        vm.$onInit = function() {
            console.log('NavbarController', $scope);
        }
        return;
        //////////////
        function getLoginLabel() {
            return Authn.isAuthenticated() ? Authn.getCurrentUserName() : 'Login';
        }
    }
})();
(function() {
    'use strict';

    angular.module('spa-demo.foos', [
        'ngResource'
    ]);
})();
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.foos');
    myApp.factory('spa-demo.foos.Foo', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {

        return $resource(APP_CONFIG.server_url + '/api/foos/:id', { id: '@id' }, {
            update: { method: 'PUT' },
            save: {
                method: "POST",
                transformRequest: buildNestedBody
            }
        });
    }]);
    //nests the default payload below a "foo" element 
    //as required by default by Rails API resources
    function buildNestedBody(data) {
        return angular.toJson({ foo: data })
    }

})();
(function() {
    "use strict";

    var myApp = angular.module('spa-demo.foos');

    myApp.controller('spa-demo.foos.FoosController', ['spa-demo.foos.Foo', function(Foo) {
        var vm = this;
        vm.foos;
        vm.foo;
        vm.edit = edit;
        vm.create = create;
        vm.update = update;
        vm.remove = remove;

        activate();
        return;
        ////////////////
        function activate() {
            newFoo();
            vm.foos = Foo.query();
        }

        function newFoo() {
            vm.foo = new Foo();
        }

        function handleError(response) {
            console.log(response);
        }

        function edit(object) {
            console.log('selected', object)
            vm.foo = object;
        }

        function create() {
            console.log("creating foo", vm.foo);
            vm.foo.$save()
                .then(function(response) {
                    //console.log(response);
                    vm.foos.push(vm.foo);
                    newFoo();
                })
                .catch(handleError);
        }

        function update() {
            //console.log("update", vm.foo);
            vm.foo.$update()
                .then(function(response) {
                    //console.log(response);
                })
                .catch(handleError);
        }

        function remove() {
            //console.log("remove", vm.foo);
            vm.foo.$delete()
                .then(function(response) {
                    //console.log(response);
                    //remove the element from local array
                    removeElement(vm.foos, vm.foo);
                    // vm.foos = Foo.query();
                    //replace edit area with prototype instance
                    newFoo();
                })
                .catch(handleError);
        }


        function removeElement(elements, element) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].id == element.id) {
                    elements.splice(i, 1);
                    break;
                }
            }
        }
    }]);

})();
(function() {
    "use strict";

    var myApp = angular.module('spa-demo.foos')
    myApp.directive('sdFoos', ['APP_CONFIG', function(APP_CONFIG) {
        var directive = {
            templateUrl: APP_CONFIG.foos_html,
            replace: true,
            bindToController: true,
            controller: 'spa-demo.foos.FoosController',
            controllerAs: 'foosVM',
            restrict: 'E',
            scope: {},
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            console.log('sdFoos', scope);
        }
    }]);

})();
(function() {
  "use strict";

  angular
    .module("spa-demo.subjects", []);
})();
(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdImageSelector", {
            templateUrl: imageSelectorTemplateUrl,
            controller: ImageSelectorController,
            bindings: {
                authz: "<"
            },
        })
        .component("sdImageEditor", {
            templateUrl: imageEditorTemplateUrl,
            controller: ImageEditorController,
            bindings: {
                authz: "<"
            },
        });
    imageSelectorTemplateUrl.$inject = ["APP_CONFIG"];

    function imageSelectorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.image_selector_html;
    }

    imageEditorTemplateUrl.$inject = ["APP_CONFIG"];

    function imageEditorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.image_editor_html;
    }
    ImageSelectorController.$inject = ["$scope", "$stateParams", "spa-demo.subjects.Image"];

    function ImageSelectorController($scope, $stateParams, Image) {
        var vm = this;

        vm.$onInit = function() {
            // console.log("ImageSelectorController", $scope);
            if (!$stateParams.id) {
                vm.items = Image.query();
            }
        }
        return;
        //////////////
    }

    ImageEditorController.$inject = ["$scope", "$state", "$stateParams", "spa-demo.subjects.Image"];

    function ImageEditorController($scope, $state, $stateParams, Image) {
        var vm = this;
        vm.create = create;
        vm.clear = clear;
        vm.update = update;
        vm.remove = remove;

        vm.$onInit = function() {
            // console.log("ImageEditorController", $scope);
            if ($stateParams.id) {
                vm.items = Image.get({ id: $stateParams.id });
            } else {
                newResource();
            }
        }
        return;
        //////////////
        function newResource() {
            vm.item = new Image();
            return vm.item;
        }

        function clear() {
            newResource();
            $state.go(".", { id: null });
        }

        function create() {
            $scope.imageform.$setPristine();
            vm.item.errors = null;
            vm.item.$save().then(
                function() {
                    $state.go(".", { id: vm.item.id });
                },
                handleError);
        }

        function update() {
            $scope.imageform.$setPristine();
            vm.item.errors = null;
            vm.item.$update().then(
                function() {
                    console.log("Updated complete", vm.item);
                    $state.reload();
                },
                handleError);
        }

        function remove() {}

        function handleError(response) {
            console.log("error", response);
            if (response.data) {
                vm.item["errors"] = response.data.errors;
            }
            if (!vm.item.errors) {
                vm.item["errors"] = {}
                vm.item["errors"]["full_messages"] = [response];
            }

        }


    }
})();
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('spa-demo.subjects.Image', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {

        var service = $resource(APP_CONFIG.server_url + "/api/images/:id", { id: '@id' }, {
            update: { method: "PUT" },
            save: { method: "POST", transformRequest: checkEmptyPayload }
        });
        return service;
    }]);
    //rails wants at least one parameter of the document filled in
    //all of our fields are optional
    //ngResource is not passing a null field by default, we have to force it
    function checkEmptyPayload(data) {
        if (!data['caption']) {
            data['caption'] = null;
        }
        return angular.toJson(data);
    }

})();
(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdImagesAuthz", function() {
            var directive = {
                bindToController: true,
                controller: ['$scope', 'Authn', function ImagesAuthzController($scope, Authn) {
                    var vm = this;
                    vm.authz = {};
                    vm.authz.authenticated = false;
                    vm.authz.canQuery = false;
                    vm.authz.canCreate = false;
                    vm.authz.canUpdate = false;
                    vm.authz.canDelete = false;
                    vm.authz.canGetDetails = false;
                    vm.authz.canUpdateItem = canUpdateItem;

                    ImagesAuthzController.prototype.resetAccess = function() {
                        this.authz.canCreate = false;
                        this.authz.canQuery = true;
                        this.authz.canUpdate = false;
                        this.authz.canDelete = false;
                        this.authz.canGetDetails = true;

                    }

                    activate();
                    return;
                    //////////
                    function activate() {
                        vm.resetAccess();
                        $scope.$watch(Authn.getCurrentUser, newUser);
                    }

                    function newUser(user, prevUser) {
                        console.log("newUser=", user, ", prev=", prevUser);
                        vm.authz.canQuery = true;
                        vm.authz.authenticated = Authn.isAuthenticated();
                        if (vm.authz.authenticated) {
                            vm.authz.canCreate = true;
                            vm.authz.canUpdate = true;
                            vm.authz.canDelete = true;
                            vm.authz.canGetDetails = true;
                        } else {
                            vm.resetAccess();
                        }
                    }

                    function canUpdateItem(item) {
                        return Authn.isAuthenticated();
                    }
                }],
                controllerAs: "vm",
                restrict: "A",
                scope: {
                    authz: "=" // updates parent scope with authz evals
                },
                link: link
            };
            return directive;

            function link(scope, element, attrs) {
                console.log("ImagesAuthzDirective", scope);
            }
        });


})();
// SPA Demo Javascript Manifest File


























;
// ...
;
