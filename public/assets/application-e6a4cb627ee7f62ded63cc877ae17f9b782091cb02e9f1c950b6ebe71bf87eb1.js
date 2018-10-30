/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


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
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
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
      var CustomEvent, fire, matches;

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
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

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
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
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
        if (!(typeof options.beforeSend === "function" ? options.beforeSend(xhr, options) : void 0)) {
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
        }
        CSRFProtection(xhr);
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

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

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
        element = e instanceof Event ? e.target : e;
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

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
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
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
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
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
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
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=58)}([function(e,t,n){"use strict";e.exports=n(25)},function(e,t,n){e.exports=n(29)()},,function(e,t,n){"use strict";e.exports=function(){}},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o,i,u,a){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,o,i,u,a],s=0;(l=new Error(t.replace(/%s/g,function(){return c[s++]}))).name="Invariant Violation"}throw l.framesToPop=1,l}}},function(e,t,n){"use strict";var r=function(){};e.exports=r},function(e,t,n){(function(e,r){var o;
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */(function(){var i,u=200,a="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",l="Expected a function",c="__lodash_hash_undefined__",s=500,f="__lodash_placeholder__",p=1,d=2,h=4,m=1,y=2,v=1,b=2,g=4,w=8,_=16,E=32,O=64,S=128,x=256,k=512,C=30,P="...",T=800,j=16,N=1,R=2,D=1/0,I=9007199254740991,A=1.7976931348623157e308,U=NaN,M=4294967295,F=M-1,L=M>>>1,z=[["ary",S],["bind",v],["bindKey",b],["curry",w],["curryRight",_],["flip",k],["partial",E],["partialRight",O],["rearg",x]],W="[object Arguments]",B="[object Array]",$="[object AsyncFunction]",V="[object Boolean]",H="[object Date]",q="[object DOMException]",K="[object Error]",Y="[object Function]",Q="[object GeneratorFunction]",G="[object Map]",X="[object Number]",Z="[object Null]",J="[object Object]",ee="[object Proxy]",te="[object RegExp]",ne="[object Set]",re="[object String]",oe="[object Symbol]",ie="[object Undefined]",ue="[object WeakMap]",ae="[object WeakSet]",le="[object ArrayBuffer]",ce="[object DataView]",se="[object Float32Array]",fe="[object Float64Array]",pe="[object Int8Array]",de="[object Int16Array]",he="[object Int32Array]",me="[object Uint8Array]",ye="[object Uint8ClampedArray]",ve="[object Uint16Array]",be="[object Uint32Array]",ge=/\b__p \+= '';/g,we=/\b(__p \+=) '' \+/g,_e=/(__e\(.*?\)|\b__t\)) \+\n'';/g,Ee=/&(?:amp|lt|gt|quot|#39);/g,Oe=/[&<>"']/g,Se=RegExp(Ee.source),xe=RegExp(Oe.source),ke=/<%-([\s\S]+?)%>/g,Ce=/<%([\s\S]+?)%>/g,Pe=/<%=([\s\S]+?)%>/g,Te=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,je=/^\w*$/,Ne=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Re=/[\\^$.*+?()[\]{}|]/g,De=RegExp(Re.source),Ie=/^\s+|\s+$/g,Ae=/^\s+/,Ue=/\s+$/,Me=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,Fe=/\{\n\/\* \[wrapped with (.+)\] \*/,Le=/,? & /,ze=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,We=/\\(\\)?/g,Be=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,$e=/\w*$/,Ve=/^[-+]0x[0-9a-f]+$/i,He=/^0b[01]+$/i,qe=/^\[object .+?Constructor\]$/,Ke=/^0o[0-7]+$/i,Ye=/^(?:0|[1-9]\d*)$/,Qe=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Ge=/($^)/,Xe=/['\n\r\u2028\u2029\\]/g,Ze="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Je="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",et="[\\ud800-\\udfff]",tt="["+Je+"]",nt="["+Ze+"]",rt="\\d+",ot="[\\u2700-\\u27bf]",it="[a-z\\xdf-\\xf6\\xf8-\\xff]",ut="[^\\ud800-\\udfff"+Je+rt+"\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",at="\\ud83c[\\udffb-\\udfff]",lt="[^\\ud800-\\udfff]",ct="(?:\\ud83c[\\udde6-\\uddff]){2}",st="[\\ud800-\\udbff][\\udc00-\\udfff]",ft="[A-Z\\xc0-\\xd6\\xd8-\\xde]",pt="(?:"+it+"|"+ut+")",dt="(?:"+ft+"|"+ut+")",ht="(?:"+nt+"|"+at+")"+"?",mt="[\\ufe0e\\ufe0f]?"+ht+("(?:\\u200d(?:"+[lt,ct,st].join("|")+")[\\ufe0e\\ufe0f]?"+ht+")*"),yt="(?:"+[ot,ct,st].join("|")+")"+mt,vt="(?:"+[lt+nt+"?",nt,ct,st,et].join("|")+")",bt=RegExp("['’]","g"),gt=RegExp(nt,"g"),wt=RegExp(at+"(?="+at+")|"+vt+mt,"g"),_t=RegExp([ft+"?"+it+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[tt,ft,"$"].join("|")+")",dt+"+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[tt,ft+pt,"$"].join("|")+")",ft+"?"+pt+"+(?:['’](?:d|ll|m|re|s|t|ve))?",ft+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",rt,yt].join("|"),"g"),Et=RegExp("[\\u200d\\ud800-\\udfff"+Ze+"\\ufe0e\\ufe0f]"),Ot=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,St=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],xt=-1,kt={};kt[se]=kt[fe]=kt[pe]=kt[de]=kt[he]=kt[me]=kt[ye]=kt[ve]=kt[be]=!0,kt[W]=kt[B]=kt[le]=kt[V]=kt[ce]=kt[H]=kt[K]=kt[Y]=kt[G]=kt[X]=kt[J]=kt[te]=kt[ne]=kt[re]=kt[ue]=!1;var Ct={};Ct[W]=Ct[B]=Ct[le]=Ct[ce]=Ct[V]=Ct[H]=Ct[se]=Ct[fe]=Ct[pe]=Ct[de]=Ct[he]=Ct[G]=Ct[X]=Ct[J]=Ct[te]=Ct[ne]=Ct[re]=Ct[oe]=Ct[me]=Ct[ye]=Ct[ve]=Ct[be]=!0,Ct[K]=Ct[Y]=Ct[ue]=!1;var Pt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Tt=parseFloat,jt=parseInt,Nt="object"==typeof e&&e&&e.Object===Object&&e,Rt="object"==typeof self&&self&&self.Object===Object&&self,Dt=Nt||Rt||Function("return this")(),It=t&&!t.nodeType&&t,At=It&&"object"==typeof r&&r&&!r.nodeType&&r,Ut=At&&At.exports===It,Mt=Ut&&Nt.process,Ft=function(){try{var e=At&&At.require&&At.require("util").types;return e||Mt&&Mt.binding&&Mt.binding("util")}catch(e){}}(),Lt=Ft&&Ft.isArrayBuffer,zt=Ft&&Ft.isDate,Wt=Ft&&Ft.isMap,Bt=Ft&&Ft.isRegExp,$t=Ft&&Ft.isSet,Vt=Ft&&Ft.isTypedArray;function Ht(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function qt(e,t,n,r){for(var o=-1,i=null==e?0:e.length;++o<i;){var u=e[o];t(r,u,n(u),e)}return r}function Kt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}function Yt(e,t){for(var n=null==e?0:e.length;n--&&!1!==t(e[n],n,e););return e}function Qt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(!t(e[n],n,e))return!1;return!0}function Gt(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var u=e[n];t(u,n,e)&&(i[o++]=u)}return i}function Xt(e,t){return!!(null==e?0:e.length)&&ln(e,t,0)>-1}function Zt(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0;return!1}function Jt(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}function en(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}function tn(e,t,n,r){var o=-1,i=null==e?0:e.length;for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e);return n}function nn(e,t,n,r){var o=null==e?0:e.length;for(r&&o&&(n=e[--o]);o--;)n=t(n,e[o],o,e);return n}function rn(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}var on=pn("length");function un(e,t,n){var r;return n(e,function(e,n,o){if(t(e,n,o))return r=n,!1}),r}function an(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i;return-1}function ln(e,t,n){return t==t?function(e,t,n){var r=n-1,o=e.length;for(;++r<o;)if(e[r]===t)return r;return-1}(e,t,n):an(e,sn,n)}function cn(e,t,n,r){for(var o=n-1,i=e.length;++o<i;)if(r(e[o],t))return o;return-1}function sn(e){return e!=e}function fn(e,t){var n=null==e?0:e.length;return n?mn(e,t)/n:U}function pn(e){return function(t){return null==t?i:t[e]}}function dn(e){return function(t){return null==e?i:e[t]}}function hn(e,t,n,r,o){return o(e,function(e,o,i){n=r?(r=!1,e):t(n,e,o,i)}),n}function mn(e,t){for(var n,r=-1,o=e.length;++r<o;){var u=t(e[r]);u!==i&&(n=n===i?u:n+u)}return n}function yn(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function vn(e){return function(t){return e(t)}}function bn(e,t){return Jt(t,function(t){return e[t]})}function gn(e,t){return e.has(t)}function wn(e,t){for(var n=-1,r=e.length;++n<r&&ln(t,e[n],0)>-1;);return n}function _n(e,t){for(var n=e.length;n--&&ln(t,e[n],0)>-1;);return n}var En=dn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),On=dn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function Sn(e){return"\\"+Pt[e]}function xn(e){return Et.test(e)}function kn(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function Cn(e,t){return function(n){return e(t(n))}}function Pn(e,t){for(var n=-1,r=e.length,o=0,i=[];++n<r;){var u=e[n];u!==t&&u!==f||(e[n]=f,i[o++]=n)}return i}function Tn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function jn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function Nn(e){return xn(e)?function(e){var t=wt.lastIndex=0;for(;wt.test(e);)++t;return t}(e):on(e)}function Rn(e){return xn(e)?function(e){return e.match(wt)||[]}(e):function(e){return e.split("")}(e)}var Dn=dn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var In=function e(t){var n=(t=null==t?Dt:In.defaults(Dt.Object(),t,In.pick(Dt,St))).Array,r=t.Date,o=t.Error,Ze=t.Function,Je=t.Math,et=t.Object,tt=t.RegExp,nt=t.String,rt=t.TypeError,ot=n.prototype,it=Ze.prototype,ut=et.prototype,at=t["__core-js_shared__"],lt=it.toString,ct=ut.hasOwnProperty,st=0,ft=function(){var e=/[^.]+$/.exec(at&&at.keys&&at.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),pt=ut.toString,dt=lt.call(et),ht=Dt._,mt=tt("^"+lt.call(ct).replace(Re,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),yt=Ut?t.Buffer:i,vt=t.Symbol,wt=t.Uint8Array,Et=yt?yt.allocUnsafe:i,Pt=Cn(et.getPrototypeOf,et),Nt=et.create,Rt=ut.propertyIsEnumerable,It=ot.splice,At=vt?vt.isConcatSpreadable:i,Mt=vt?vt.iterator:i,Ft=vt?vt.toStringTag:i,on=function(){try{var e=Fi(et,"defineProperty");return e({},"",{}),e}catch(e){}}(),dn=t.clearTimeout!==Dt.clearTimeout&&t.clearTimeout,An=r&&r.now!==Dt.Date.now&&r.now,Un=t.setTimeout!==Dt.setTimeout&&t.setTimeout,Mn=Je.ceil,Fn=Je.floor,Ln=et.getOwnPropertySymbols,zn=yt?yt.isBuffer:i,Wn=t.isFinite,Bn=ot.join,$n=Cn(et.keys,et),Vn=Je.max,Hn=Je.min,qn=r.now,Kn=t.parseInt,Yn=Je.random,Qn=ot.reverse,Gn=Fi(t,"DataView"),Xn=Fi(t,"Map"),Zn=Fi(t,"Promise"),Jn=Fi(t,"Set"),er=Fi(t,"WeakMap"),tr=Fi(et,"create"),nr=er&&new er,rr={},or=su(Gn),ir=su(Xn),ur=su(Zn),ar=su(Jn),lr=su(er),cr=vt?vt.prototype:i,sr=cr?cr.valueOf:i,fr=cr?cr.toString:i;function pr(e){if(Ca(e)&&!ya(e)&&!(e instanceof yr)){if(e instanceof mr)return e;if(ct.call(e,"__wrapped__"))return fu(e)}return new mr(e)}var dr=function(){function e(){}return function(t){if(!ka(t))return{};if(Nt)return Nt(t);e.prototype=t;var n=new e;return e.prototype=i,n}}();function hr(){}function mr(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=i}function yr(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=M,this.__views__=[]}function vr(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function br(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function gr(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function wr(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new gr;++t<n;)this.add(e[t])}function _r(e){var t=this.__data__=new br(e);this.size=t.size}function Er(e,t){var n=ya(e),r=!n&&ma(e),o=!n&&!r&&wa(e),i=!n&&!r&&!o&&Aa(e),u=n||r||o||i,a=u?yn(e.length,nt):[],l=a.length;for(var c in e)!t&&!ct.call(e,c)||u&&("length"==c||o&&("offset"==c||"parent"==c)||i&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||Hi(c,l))||a.push(c);return a}function Or(e){var t=e.length;return t?e[_o(0,t-1)]:i}function Sr(e,t){return au(ni(e),Dr(t,0,e.length))}function xr(e){return au(ni(e))}function kr(e,t,n){(n===i||pa(e[t],n))&&(n!==i||t in e)||Nr(e,t,n)}function Cr(e,t,n){var r=e[t];ct.call(e,t)&&pa(r,n)&&(n!==i||t in e)||Nr(e,t,n)}function Pr(e,t){for(var n=e.length;n--;)if(pa(e[n][0],t))return n;return-1}function Tr(e,t,n,r){return Fr(e,function(e,o,i){t(r,e,n(e),i)}),r}function jr(e,t){return e&&ri(t,rl(t),e)}function Nr(e,t,n){"__proto__"==t&&on?on(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function Rr(e,t){for(var r=-1,o=t.length,u=n(o),a=null==e;++r<o;)u[r]=a?i:Za(e,t[r]);return u}function Dr(e,t,n){return e==e&&(n!==i&&(e=e<=n?e:n),t!==i&&(e=e>=t?e:t)),e}function Ir(e,t,n,r,o,u){var a,l=t&p,c=t&d,s=t&h;if(n&&(a=o?n(e,r,o,u):n(e)),a!==i)return a;if(!ka(e))return e;var f=ya(e);if(f){if(a=function(e){var t=e.length,n=new e.constructor(t);return t&&"string"==typeof e[0]&&ct.call(e,"index")&&(n.index=e.index,n.input=e.input),n}(e),!l)return ni(e,a)}else{var m=Wi(e),y=m==Y||m==Q;if(wa(e))return Go(e,l);if(m==J||m==W||y&&!o){if(a=c||y?{}:$i(e),!l)return c?function(e,t){return ri(e,zi(e),t)}(e,function(e,t){return e&&ri(t,ol(t),e)}(a,e)):function(e,t){return ri(e,Li(e),t)}(e,jr(a,e))}else{if(!Ct[m])return o?e:{};a=function(e,t,n){var r=e.constructor;switch(t){case le:return Xo(e);case V:case H:return new r(+e);case ce:return function(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}(e,n);case se:case fe:case pe:case de:case he:case me:case ye:case ve:case be:return Zo(e,n);case G:return new r;case X:case re:return new r(e);case te:return function(e){var t=new e.constructor(e.source,$e.exec(e));return t.lastIndex=e.lastIndex,t}(e);case ne:return new r;case oe:return function(e){return sr?et(sr.call(e)):{}}(e)}}(e,m,l)}}u||(u=new _r);var v=u.get(e);if(v)return v;if(u.set(e,a),Ra(e))return e.forEach(function(r){a.add(Ir(r,t,n,r,e,u))}),a;if(Pa(e))return e.forEach(function(r,o){a.set(o,Ir(r,t,n,o,e,u))}),a;var b=f?i:(s?c?Ni:ji:c?ol:rl)(e);return Kt(b||e,function(r,o){b&&(r=e[o=r]),Cr(a,o,Ir(r,t,n,o,e,u))}),a}function Ar(e,t,n){var r=n.length;if(null==e)return!r;for(e=et(e);r--;){var o=n[r],u=t[o],a=e[o];if(a===i&&!(o in e)||!u(a))return!1}return!0}function Ur(e,t,n){if("function"!=typeof e)throw new rt(l);return ru(function(){e.apply(i,n)},t)}function Mr(e,t,n,r){var o=-1,i=Xt,a=!0,l=e.length,c=[],s=t.length;if(!l)return c;n&&(t=Jt(t,vn(n))),r?(i=Zt,a=!1):t.length>=u&&(i=gn,a=!1,t=new wr(t));e:for(;++o<l;){var f=e[o],p=null==n?f:n(f);if(f=r||0!==f?f:0,a&&p==p){for(var d=s;d--;)if(t[d]===p)continue e;c.push(f)}else i(t,p,r)||c.push(f)}return c}pr.templateSettings={escape:ke,evaluate:Ce,interpolate:Pe,variable:"",imports:{_:pr}},pr.prototype=hr.prototype,pr.prototype.constructor=pr,mr.prototype=dr(hr.prototype),mr.prototype.constructor=mr,yr.prototype=dr(hr.prototype),yr.prototype.constructor=yr,vr.prototype.clear=function(){this.__data__=tr?tr(null):{},this.size=0},vr.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},vr.prototype.get=function(e){var t=this.__data__;if(tr){var n=t[e];return n===c?i:n}return ct.call(t,e)?t[e]:i},vr.prototype.has=function(e){var t=this.__data__;return tr?t[e]!==i:ct.call(t,e)},vr.prototype.set=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=tr&&t===i?c:t,this},br.prototype.clear=function(){this.__data__=[],this.size=0},br.prototype.delete=function(e){var t=this.__data__,n=Pr(t,e);return!(n<0||(n==t.length-1?t.pop():It.call(t,n,1),--this.size,0))},br.prototype.get=function(e){var t=this.__data__,n=Pr(t,e);return n<0?i:t[n][1]},br.prototype.has=function(e){return Pr(this.__data__,e)>-1},br.prototype.set=function(e,t){var n=this.__data__,r=Pr(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this},gr.prototype.clear=function(){this.size=0,this.__data__={hash:new vr,map:new(Xn||br),string:new vr}},gr.prototype.delete=function(e){var t=Ui(this,e).delete(e);return this.size-=t?1:0,t},gr.prototype.get=function(e){return Ui(this,e).get(e)},gr.prototype.has=function(e){return Ui(this,e).has(e)},gr.prototype.set=function(e,t){var n=Ui(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this},wr.prototype.add=wr.prototype.push=function(e){return this.__data__.set(e,c),this},wr.prototype.has=function(e){return this.__data__.has(e)},_r.prototype.clear=function(){this.__data__=new br,this.size=0},_r.prototype.delete=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n},_r.prototype.get=function(e){return this.__data__.get(e)},_r.prototype.has=function(e){return this.__data__.has(e)},_r.prototype.set=function(e,t){var n=this.__data__;if(n instanceof br){var r=n.__data__;if(!Xn||r.length<u-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new gr(r)}return n.set(e,t),this.size=n.size,this};var Fr=ui(qr),Lr=ui(Kr,!0);function zr(e,t){var n=!0;return Fr(e,function(e,r,o){return n=!!t(e,r,o)}),n}function Wr(e,t,n){for(var r=-1,o=e.length;++r<o;){var u=e[r],a=t(u);if(null!=a&&(l===i?a==a&&!Ia(a):n(a,l)))var l=a,c=u}return c}function Br(e,t){var n=[];return Fr(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}function $r(e,t,n,r,o){var i=-1,u=e.length;for(n||(n=Vi),o||(o=[]);++i<u;){var a=e[i];t>0&&n(a)?t>1?$r(a,t-1,n,r,o):en(o,a):r||(o[o.length]=a)}return o}var Vr=ai(),Hr=ai(!0);function qr(e,t){return e&&Vr(e,t,rl)}function Kr(e,t){return e&&Hr(e,t,rl)}function Yr(e,t){return Gt(t,function(t){return Oa(e[t])})}function Qr(e,t){for(var n=0,r=(t=qo(t,e)).length;null!=e&&n<r;)e=e[cu(t[n++])];return n&&n==r?e:i}function Gr(e,t,n){var r=t(e);return ya(e)?r:en(r,n(e))}function Xr(e){return null==e?e===i?ie:Z:Ft&&Ft in et(e)?function(e){var t=ct.call(e,Ft),n=e[Ft];try{e[Ft]=i;var r=!0}catch(e){}var o=pt.call(e);return r&&(t?e[Ft]=n:delete e[Ft]),o}(e):function(e){return pt.call(e)}(e)}function Zr(e,t){return e>t}function Jr(e,t){return null!=e&&ct.call(e,t)}function eo(e,t){return null!=e&&t in et(e)}function to(e,t,r){for(var o=r?Zt:Xt,u=e[0].length,a=e.length,l=a,c=n(a),s=1/0,f=[];l--;){var p=e[l];l&&t&&(p=Jt(p,vn(t))),s=Hn(p.length,s),c[l]=!r&&(t||u>=120&&p.length>=120)?new wr(l&&p):i}p=e[0];var d=-1,h=c[0];e:for(;++d<u&&f.length<s;){var m=p[d],y=t?t(m):m;if(m=r||0!==m?m:0,!(h?gn(h,y):o(f,y,r))){for(l=a;--l;){var v=c[l];if(!(v?gn(v,y):o(e[l],y,r)))continue e}h&&h.push(y),f.push(m)}}return f}function no(e,t,n){var r=null==(e=eu(e,t=qo(t,e)))?e:e[cu(Eu(t))];return null==r?i:Ht(r,e,n)}function ro(e){return Ca(e)&&Xr(e)==W}function oo(e,t,n,r,o){return e===t||(null==e||null==t||!Ca(e)&&!Ca(t)?e!=e&&t!=t:function(e,t,n,r,o,u){var a=ya(e),l=ya(t),c=a?B:Wi(e),s=l?B:Wi(t),f=(c=c==W?J:c)==J,p=(s=s==W?J:s)==J,d=c==s;if(d&&wa(e)){if(!wa(t))return!1;a=!0,f=!1}if(d&&!f)return u||(u=new _r),a||Aa(e)?Pi(e,t,n,r,o,u):function(e,t,n,r,o,i,u){switch(n){case ce:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case le:return!(e.byteLength!=t.byteLength||!i(new wt(e),new wt(t)));case V:case H:case X:return pa(+e,+t);case K:return e.name==t.name&&e.message==t.message;case te:case re:return e==t+"";case G:var a=kn;case ne:var l=r&m;if(a||(a=Tn),e.size!=t.size&&!l)return!1;var c=u.get(e);if(c)return c==t;r|=y,u.set(e,t);var s=Pi(a(e),a(t),r,o,i,u);return u.delete(e),s;case oe:if(sr)return sr.call(e)==sr.call(t)}return!1}(e,t,c,n,r,o,u);if(!(n&m)){var h=f&&ct.call(e,"__wrapped__"),v=p&&ct.call(t,"__wrapped__");if(h||v){var b=h?e.value():e,g=v?t.value():t;return u||(u=new _r),o(b,g,n,r,u)}}return!!d&&(u||(u=new _r),function(e,t,n,r,o,u){var a=n&m,l=ji(e),c=l.length,s=ji(t).length;if(c!=s&&!a)return!1;for(var f=c;f--;){var p=l[f];if(!(a?p in t:ct.call(t,p)))return!1}var d=u.get(e);if(d&&u.get(t))return d==t;var h=!0;u.set(e,t),u.set(t,e);for(var y=a;++f<c;){p=l[f];var v=e[p],b=t[p];if(r)var g=a?r(b,v,p,t,e,u):r(v,b,p,e,t,u);if(!(g===i?v===b||o(v,b,n,r,u):g)){h=!1;break}y||(y="constructor"==p)}if(h&&!y){var w=e.constructor,_=t.constructor;w!=_&&"constructor"in e&&"constructor"in t&&!("function"==typeof w&&w instanceof w&&"function"==typeof _&&_ instanceof _)&&(h=!1)}return u.delete(e),u.delete(t),h}(e,t,n,r,o,u))}(e,t,n,r,oo,o))}function io(e,t,n,r){var o=n.length,u=o,a=!r;if(null==e)return!u;for(e=et(e);o--;){var l=n[o];if(a&&l[2]?l[1]!==e[l[0]]:!(l[0]in e))return!1}for(;++o<u;){var c=(l=n[o])[0],s=e[c],f=l[1];if(a&&l[2]){if(s===i&&!(c in e))return!1}else{var p=new _r;if(r)var d=r(s,f,c,e,t,p);if(!(d===i?oo(f,s,m|y,r,p):d))return!1}}return!0}function uo(e){return!(!ka(e)||function(e){return!!ft&&ft in e}(e))&&(Oa(e)?mt:qe).test(su(e))}function ao(e){return"function"==typeof e?e:null==e?Tl:"object"==typeof e?ya(e)?ho(e[0],e[1]):po(e):Fl(e)}function lo(e){if(!Gi(e))return $n(e);var t=[];for(var n in et(e))ct.call(e,n)&&"constructor"!=n&&t.push(n);return t}function co(e){if(!ka(e))return function(e){var t=[];if(null!=e)for(var n in et(e))t.push(n);return t}(e);var t=Gi(e),n=[];for(var r in e)("constructor"!=r||!t&&ct.call(e,r))&&n.push(r);return n}function so(e,t){return e<t}function fo(e,t){var r=-1,o=ba(e)?n(e.length):[];return Fr(e,function(e,n,i){o[++r]=t(e,n,i)}),o}function po(e){var t=Mi(e);return 1==t.length&&t[0][2]?Zi(t[0][0],t[0][1]):function(n){return n===e||io(n,e,t)}}function ho(e,t){return Ki(e)&&Xi(t)?Zi(cu(e),t):function(n){var r=Za(n,e);return r===i&&r===t?Ja(n,e):oo(t,r,m|y)}}function mo(e,t,n,r,o){e!==t&&Vr(t,function(u,a){if(ka(u))o||(o=new _r),function(e,t,n,r,o,u,a){var l=tu(e,n),c=tu(t,n),s=a.get(c);if(s)kr(e,n,s);else{var f=u?u(l,c,n+"",e,t,a):i,p=f===i;if(p){var d=ya(c),h=!d&&wa(c),m=!d&&!h&&Aa(c);f=c,d||h||m?ya(l)?f=l:ga(l)?f=ni(l):h?(p=!1,f=Go(c,!0)):m?(p=!1,f=Zo(c,!0)):f=[]:ja(c)||ma(c)?(f=l,ma(l)?f=$a(l):ka(l)&&!Oa(l)||(f=$i(c))):p=!1}p&&(a.set(c,f),o(f,c,r,u,a),a.delete(c)),kr(e,n,f)}}(e,t,a,n,mo,r,o);else{var l=r?r(tu(e,a),u,a+"",e,t,o):i;l===i&&(l=u),kr(e,a,l)}},ol)}function yo(e,t){var n=e.length;if(n)return Hi(t+=t<0?n:0,n)?e[t]:i}function vo(e,t,n){var r=-1;return t=Jt(t.length?t:[Tl],vn(Ai())),function(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}(fo(e,function(e,n,o){return{criteria:Jt(t,function(t){return t(e)}),index:++r,value:e}}),function(e,t){return function(e,t,n){for(var r=-1,o=e.criteria,i=t.criteria,u=o.length,a=n.length;++r<u;){var l=Jo(o[r],i[r]);if(l){if(r>=a)return l;var c=n[r];return l*("desc"==c?-1:1)}}return e.index-t.index}(e,t,n)})}function bo(e,t,n){for(var r=-1,o=t.length,i={};++r<o;){var u=t[r],a=Qr(e,u);n(a,u)&&ko(i,qo(u,e),a)}return i}function go(e,t,n,r){var o=r?cn:ln,i=-1,u=t.length,a=e;for(e===t&&(t=ni(t)),n&&(a=Jt(e,vn(n)));++i<u;)for(var l=0,c=t[i],s=n?n(c):c;(l=o(a,s,l,r))>-1;)a!==e&&It.call(a,l,1),It.call(e,l,1);return e}function wo(e,t){for(var n=e?t.length:0,r=n-1;n--;){var o=t[n];if(n==r||o!==i){var i=o;Hi(o)?It.call(e,o,1):Fo(e,o)}}return e}function _o(e,t){return e+Fn(Yn()*(t-e+1))}function Eo(e,t){var n="";if(!e||t<1||t>I)return n;do{t%2&&(n+=e),(t=Fn(t/2))&&(e+=e)}while(t);return n}function Oo(e,t){return ou(Ji(e,t,Tl),e+"")}function So(e){return Or(pl(e))}function xo(e,t){var n=pl(e);return au(n,Dr(t,0,n.length))}function ko(e,t,n,r){if(!ka(e))return e;for(var o=-1,u=(t=qo(t,e)).length,a=u-1,l=e;null!=l&&++o<u;){var c=cu(t[o]),s=n;if(o!=a){var f=l[c];(s=r?r(f,c,l):i)===i&&(s=ka(f)?f:Hi(t[o+1])?[]:{})}Cr(l,c,s),l=l[c]}return e}var Co=nr?function(e,t){return nr.set(e,t),e}:Tl,Po=on?function(e,t){return on(e,"toString",{configurable:!0,enumerable:!1,value:kl(t),writable:!0})}:Tl;function To(e){return au(pl(e))}function jo(e,t,r){var o=-1,i=e.length;t<0&&(t=-t>i?0:i+t),(r=r>i?i:r)<0&&(r+=i),i=t>r?0:r-t>>>0,t>>>=0;for(var u=n(i);++o<i;)u[o]=e[o+t];return u}function No(e,t){var n;return Fr(e,function(e,r,o){return!(n=t(e,r,o))}),!!n}function Ro(e,t,n){var r=0,o=null==e?r:e.length;if("number"==typeof t&&t==t&&o<=L){for(;r<o;){var i=r+o>>>1,u=e[i];null!==u&&!Ia(u)&&(n?u<=t:u<t)?r=i+1:o=i}return o}return Do(e,t,Tl,n)}function Do(e,t,n,r){t=n(t);for(var o=0,u=null==e?0:e.length,a=t!=t,l=null===t,c=Ia(t),s=t===i;o<u;){var f=Fn((o+u)/2),p=n(e[f]),d=p!==i,h=null===p,m=p==p,y=Ia(p);if(a)var v=r||m;else v=s?m&&(r||d):l?m&&d&&(r||!h):c?m&&d&&!h&&(r||!y):!h&&!y&&(r?p<=t:p<t);v?o=f+1:u=f}return Hn(u,F)}function Io(e,t){for(var n=-1,r=e.length,o=0,i=[];++n<r;){var u=e[n],a=t?t(u):u;if(!n||!pa(a,l)){var l=a;i[o++]=0===u?0:u}}return i}function Ao(e){return"number"==typeof e?e:Ia(e)?U:+e}function Uo(e){if("string"==typeof e)return e;if(ya(e))return Jt(e,Uo)+"";if(Ia(e))return fr?fr.call(e):"";var t=e+"";return"0"==t&&1/e==-D?"-0":t}function Mo(e,t,n){var r=-1,o=Xt,i=e.length,a=!0,l=[],c=l;if(n)a=!1,o=Zt;else if(i>=u){var s=t?null:Ei(e);if(s)return Tn(s);a=!1,o=gn,c=new wr}else c=t?[]:l;e:for(;++r<i;){var f=e[r],p=t?t(f):f;if(f=n||0!==f?f:0,a&&p==p){for(var d=c.length;d--;)if(c[d]===p)continue e;t&&c.push(p),l.push(f)}else o(c,p,n)||(c!==l&&c.push(p),l.push(f))}return l}function Fo(e,t){return null==(e=eu(e,t=qo(t,e)))||delete e[cu(Eu(t))]}function Lo(e,t,n,r){return ko(e,t,n(Qr(e,t)),r)}function zo(e,t,n,r){for(var o=e.length,i=r?o:-1;(r?i--:++i<o)&&t(e[i],i,e););return n?jo(e,r?0:i,r?i+1:o):jo(e,r?i+1:0,r?o:i)}function Wo(e,t){var n=e;return n instanceof yr&&(n=n.value()),tn(t,function(e,t){return t.func.apply(t.thisArg,en([e],t.args))},n)}function Bo(e,t,r){var o=e.length;if(o<2)return o?Mo(e[0]):[];for(var i=-1,u=n(o);++i<o;)for(var a=e[i],l=-1;++l<o;)l!=i&&(u[i]=Mr(u[i]||a,e[l],t,r));return Mo($r(u,1),t,r)}function $o(e,t,n){for(var r=-1,o=e.length,u=t.length,a={};++r<o;){var l=r<u?t[r]:i;n(a,e[r],l)}return a}function Vo(e){return ga(e)?e:[]}function Ho(e){return"function"==typeof e?e:Tl}function qo(e,t){return ya(e)?e:Ki(e,t)?[e]:lu(Va(e))}var Ko=Oo;function Yo(e,t,n){var r=e.length;return n=n===i?r:n,!t&&n>=r?e:jo(e,t,n)}var Qo=dn||function(e){return Dt.clearTimeout(e)};function Go(e,t){if(t)return e.slice();var n=e.length,r=Et?Et(n):new e.constructor(n);return e.copy(r),r}function Xo(e){var t=new e.constructor(e.byteLength);return new wt(t).set(new wt(e)),t}function Zo(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function Jo(e,t){if(e!==t){var n=e!==i,r=null===e,o=e==e,u=Ia(e),a=t!==i,l=null===t,c=t==t,s=Ia(t);if(!l&&!s&&!u&&e>t||u&&a&&c&&!l&&!s||r&&a&&c||!n&&c||!o)return 1;if(!r&&!u&&!s&&e<t||s&&n&&o&&!r&&!u||l&&n&&o||!a&&o||!c)return-1}return 0}function ei(e,t,r,o){for(var i=-1,u=e.length,a=r.length,l=-1,c=t.length,s=Vn(u-a,0),f=n(c+s),p=!o;++l<c;)f[l]=t[l];for(;++i<a;)(p||i<u)&&(f[r[i]]=e[i]);for(;s--;)f[l++]=e[i++];return f}function ti(e,t,r,o){for(var i=-1,u=e.length,a=-1,l=r.length,c=-1,s=t.length,f=Vn(u-l,0),p=n(f+s),d=!o;++i<f;)p[i]=e[i];for(var h=i;++c<s;)p[h+c]=t[c];for(;++a<l;)(d||i<u)&&(p[h+r[a]]=e[i++]);return p}function ni(e,t){var r=-1,o=e.length;for(t||(t=n(o));++r<o;)t[r]=e[r];return t}function ri(e,t,n,r){var o=!n;n||(n={});for(var u=-1,a=t.length;++u<a;){var l=t[u],c=r?r(n[l],e[l],l,n,e):i;c===i&&(c=e[l]),o?Nr(n,l,c):Cr(n,l,c)}return n}function oi(e,t){return function(n,r){var o=ya(n)?qt:Tr,i=t?t():{};return o(n,e,Ai(r,2),i)}}function ii(e){return Oo(function(t,n){var r=-1,o=n.length,u=o>1?n[o-1]:i,a=o>2?n[2]:i;for(u=e.length>3&&"function"==typeof u?(o--,u):i,a&&qi(n[0],n[1],a)&&(u=o<3?i:u,o=1),t=et(t);++r<o;){var l=n[r];l&&e(t,l,r,u)}return t})}function ui(e,t){return function(n,r){if(null==n)return n;if(!ba(n))return e(n,r);for(var o=n.length,i=t?o:-1,u=et(n);(t?i--:++i<o)&&!1!==r(u[i],i,u););return n}}function ai(e){return function(t,n,r){for(var o=-1,i=et(t),u=r(t),a=u.length;a--;){var l=u[e?a:++o];if(!1===n(i[l],l,i))break}return t}}function li(e){return function(t){var n=xn(t=Va(t))?Rn(t):i,r=n?n[0]:t.charAt(0),o=n?Yo(n,1).join(""):t.slice(1);return r[e]()+o}}function ci(e){return function(t){return tn(Ol(ml(t).replace(bt,"")),e,"")}}function si(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=dr(e.prototype),r=e.apply(n,t);return ka(r)?r:n}}function fi(e){return function(t,n,r){var o=et(t);if(!ba(t)){var u=Ai(n,3);t=rl(t),n=function(e){return u(o[e],e,o)}}var a=e(t,n,r);return a>-1?o[u?t[a]:a]:i}}function pi(e){return Ti(function(t){var n=t.length,r=n,o=mr.prototype.thru;for(e&&t.reverse();r--;){var u=t[r];if("function"!=typeof u)throw new rt(l);if(o&&!a&&"wrapper"==Di(u))var a=new mr([],!0)}for(r=a?r:n;++r<n;){var c=Di(u=t[r]),s="wrapper"==c?Ri(u):i;a=s&&Yi(s[0])&&s[1]==(S|w|E|x)&&!s[4].length&&1==s[9]?a[Di(s[0])].apply(a,s[3]):1==u.length&&Yi(u)?a[c]():a.thru(u)}return function(){var e=arguments,r=e[0];if(a&&1==e.length&&ya(r))return a.plant(r).value();for(var o=0,i=n?t[o].apply(this,e):r;++o<n;)i=t[o].call(this,i);return i}})}function di(e,t,r,o,u,a,l,c,s,f){var p=t&S,d=t&v,h=t&b,m=t&(w|_),y=t&k,g=h?i:si(e);return function v(){for(var b=arguments.length,w=n(b),_=b;_--;)w[_]=arguments[_];if(m)var E=Ii(v),O=function(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&++r;return r}(w,E);if(o&&(w=ei(w,o,u,m)),a&&(w=ti(w,a,l,m)),b-=O,m&&b<f){var S=Pn(w,E);return wi(e,t,di,v.placeholder,r,w,S,c,s,f-b)}var x=d?r:this,k=h?x[e]:e;return b=w.length,c?w=function(e,t){for(var n=e.length,r=Hn(t.length,n),o=ni(e);r--;){var u=t[r];e[r]=Hi(u,n)?o[u]:i}return e}(w,c):y&&b>1&&w.reverse(),p&&s<b&&(w.length=s),this&&this!==Dt&&this instanceof v&&(k=g||si(k)),k.apply(x,w)}}function hi(e,t){return function(n,r){return function(e,t,n,r){return qr(e,function(e,o,i){t(r,n(e),o,i)}),r}(n,e,t(r),{})}}function mi(e,t){return function(n,r){var o;if(n===i&&r===i)return t;if(n!==i&&(o=n),r!==i){if(o===i)return r;"string"==typeof n||"string"==typeof r?(n=Uo(n),r=Uo(r)):(n=Ao(n),r=Ao(r)),o=e(n,r)}return o}}function yi(e){return Ti(function(t){return t=Jt(t,vn(Ai())),Oo(function(n){var r=this;return e(t,function(e){return Ht(e,r,n)})})})}function vi(e,t){var n=(t=t===i?" ":Uo(t)).length;if(n<2)return n?Eo(t,e):t;var r=Eo(t,Mn(e/Nn(t)));return xn(t)?Yo(Rn(r),0,e).join(""):r.slice(0,e)}function bi(e){return function(t,r,o){return o&&"number"!=typeof o&&qi(t,r,o)&&(r=o=i),t=La(t),r===i?(r=t,t=0):r=La(r),function(e,t,r,o){for(var i=-1,u=Vn(Mn((t-e)/(r||1)),0),a=n(u);u--;)a[o?u:++i]=e,e+=r;return a}(t,r,o=o===i?t<r?1:-1:La(o),e)}}function gi(e){return function(t,n){return"string"==typeof t&&"string"==typeof n||(t=Ba(t),n=Ba(n)),e(t,n)}}function wi(e,t,n,r,o,u,a,l,c,s){var f=t&w;t|=f?E:O,(t&=~(f?O:E))&g||(t&=~(v|b));var p=[e,t,o,f?u:i,f?a:i,f?i:u,f?i:a,l,c,s],d=n.apply(i,p);return Yi(e)&&nu(d,p),d.placeholder=r,iu(d,e,t)}function _i(e){var t=Je[e];return function(e,n){if(e=Ba(e),n=null==n?0:Hn(za(n),292)){var r=(Va(e)+"e").split("e");return+((r=(Va(t(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return t(e)}}var Ei=Jn&&1/Tn(new Jn([,-0]))[1]==D?function(e){return new Jn(e)}:Il;function Oi(e){return function(t){var n=Wi(t);return n==G?kn(t):n==ne?jn(t):function(e,t){return Jt(t,function(t){return[t,e[t]]})}(t,e(t))}}function Si(e,t,r,o,u,a,c,s){var p=t&b;if(!p&&"function"!=typeof e)throw new rt(l);var d=o?o.length:0;if(d||(t&=~(E|O),o=u=i),c=c===i?c:Vn(za(c),0),s=s===i?s:za(s),d-=u?u.length:0,t&O){var h=o,m=u;o=u=i}var y=p?i:Ri(e),k=[e,t,r,o,u,h,m,a,c,s];if(y&&function(e,t){var n=e[1],r=t[1],o=n|r,i=o<(v|b|S),u=r==S&&n==w||r==S&&n==x&&e[7].length<=t[8]||r==(S|x)&&t[7].length<=t[8]&&n==w;if(!i&&!u)return e;r&v&&(e[2]=t[2],o|=n&v?0:g);var a=t[3];if(a){var l=e[3];e[3]=l?ei(l,a,t[4]):a,e[4]=l?Pn(e[3],f):t[4]}(a=t[5])&&(l=e[5],e[5]=l?ti(l,a,t[6]):a,e[6]=l?Pn(e[5],f):t[6]),(a=t[7])&&(e[7]=a),r&S&&(e[8]=null==e[8]?t[8]:Hn(e[8],t[8])),null==e[9]&&(e[9]=t[9]),e[0]=t[0],e[1]=o}(k,y),e=k[0],t=k[1],r=k[2],o=k[3],u=k[4],!(s=k[9]=k[9]===i?p?0:e.length:Vn(k[9]-d,0))&&t&(w|_)&&(t&=~(w|_)),t&&t!=v)C=t==w||t==_?function(e,t,r){var o=si(e);return function u(){for(var a=arguments.length,l=n(a),c=a,s=Ii(u);c--;)l[c]=arguments[c];var f=a<3&&l[0]!==s&&l[a-1]!==s?[]:Pn(l,s);return(a-=f.length)<r?wi(e,t,di,u.placeholder,i,l,f,i,i,r-a):Ht(this&&this!==Dt&&this instanceof u?o:e,this,l)}}(e,t,s):t!=E&&t!=(v|E)||u.length?di.apply(i,k):function(e,t,r,o){var i=t&v,u=si(e);return function t(){for(var a=-1,l=arguments.length,c=-1,s=o.length,f=n(s+l),p=this&&this!==Dt&&this instanceof t?u:e;++c<s;)f[c]=o[c];for(;l--;)f[c++]=arguments[++a];return Ht(p,i?r:this,f)}}(e,t,r,o);else var C=function(e,t,n){var r=t&v,o=si(e);return function t(){return(this&&this!==Dt&&this instanceof t?o:e).apply(r?n:this,arguments)}}(e,t,r);return iu((y?Co:nu)(C,k),e,t)}function xi(e,t,n,r){return e===i||pa(e,ut[n])&&!ct.call(r,n)?t:e}function ki(e,t,n,r,o,u){return ka(e)&&ka(t)&&(u.set(t,e),mo(e,t,i,ki,u),u.delete(t)),e}function Ci(e){return ja(e)?i:e}function Pi(e,t,n,r,o,u){var a=n&m,l=e.length,c=t.length;if(l!=c&&!(a&&c>l))return!1;var s=u.get(e);if(s&&u.get(t))return s==t;var f=-1,p=!0,d=n&y?new wr:i;for(u.set(e,t),u.set(t,e);++f<l;){var h=e[f],v=t[f];if(r)var b=a?r(v,h,f,t,e,u):r(h,v,f,e,t,u);if(b!==i){if(b)continue;p=!1;break}if(d){if(!rn(t,function(e,t){if(!gn(d,t)&&(h===e||o(h,e,n,r,u)))return d.push(t)})){p=!1;break}}else if(h!==v&&!o(h,v,n,r,u)){p=!1;break}}return u.delete(e),u.delete(t),p}function Ti(e){return ou(Ji(e,i,vu),e+"")}function ji(e){return Gr(e,rl,Li)}function Ni(e){return Gr(e,ol,zi)}var Ri=nr?function(e){return nr.get(e)}:Il;function Di(e){for(var t=e.name+"",n=rr[t],r=ct.call(rr,t)?n.length:0;r--;){var o=n[r],i=o.func;if(null==i||i==e)return o.name}return t}function Ii(e){return(ct.call(pr,"placeholder")?pr:e).placeholder}function Ai(){var e=pr.iteratee||jl;return e=e===jl?ao:e,arguments.length?e(arguments[0],arguments[1]):e}function Ui(e,t){var n=e.__data__;return function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}(t)?n["string"==typeof t?"string":"hash"]:n.map}function Mi(e){for(var t=rl(e),n=t.length;n--;){var r=t[n],o=e[r];t[n]=[r,o,Xi(o)]}return t}function Fi(e,t){var n=function(e,t){return null==e?i:e[t]}(e,t);return uo(n)?n:i}var Li=Ln?function(e){return null==e?[]:(e=et(e),Gt(Ln(e),function(t){return Rt.call(e,t)}))}:Wl,zi=Ln?function(e){for(var t=[];e;)en(t,Li(e)),e=Pt(e);return t}:Wl,Wi=Xr;function Bi(e,t,n){for(var r=-1,o=(t=qo(t,e)).length,i=!1;++r<o;){var u=cu(t[r]);if(!(i=null!=e&&n(e,u)))break;e=e[u]}return i||++r!=o?i:!!(o=null==e?0:e.length)&&xa(o)&&Hi(u,o)&&(ya(e)||ma(e))}function $i(e){return"function"!=typeof e.constructor||Gi(e)?{}:dr(Pt(e))}function Vi(e){return ya(e)||ma(e)||!!(At&&e&&e[At])}function Hi(e,t){var n=typeof e;return!!(t=null==t?I:t)&&("number"==n||"symbol"!=n&&Ye.test(e))&&e>-1&&e%1==0&&e<t}function qi(e,t,n){if(!ka(n))return!1;var r=typeof t;return!!("number"==r?ba(n)&&Hi(t,n.length):"string"==r&&t in n)&&pa(n[t],e)}function Ki(e,t){if(ya(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!Ia(e))||je.test(e)||!Te.test(e)||null!=t&&e in et(t)}function Yi(e){var t=Di(e),n=pr[t];if("function"!=typeof n||!(t in yr.prototype))return!1;if(e===n)return!0;var r=Ri(n);return!!r&&e===r[0]}(Gn&&Wi(new Gn(new ArrayBuffer(1)))!=ce||Xn&&Wi(new Xn)!=G||Zn&&"[object Promise]"!=Wi(Zn.resolve())||Jn&&Wi(new Jn)!=ne||er&&Wi(new er)!=ue)&&(Wi=function(e){var t=Xr(e),n=t==J?e.constructor:i,r=n?su(n):"";if(r)switch(r){case or:return ce;case ir:return G;case ur:return"[object Promise]";case ar:return ne;case lr:return ue}return t});var Qi=at?Oa:Bl;function Gi(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||ut)}function Xi(e){return e==e&&!ka(e)}function Zi(e,t){return function(n){return null!=n&&n[e]===t&&(t!==i||e in et(n))}}function Ji(e,t,r){return t=Vn(t===i?e.length-1:t,0),function(){for(var o=arguments,i=-1,u=Vn(o.length-t,0),a=n(u);++i<u;)a[i]=o[t+i];i=-1;for(var l=n(t+1);++i<t;)l[i]=o[i];return l[t]=r(a),Ht(e,this,l)}}function eu(e,t){return t.length<2?e:Qr(e,jo(t,0,-1))}function tu(e,t){if("__proto__"!=t)return e[t]}var nu=uu(Co),ru=Un||function(e,t){return Dt.setTimeout(e,t)},ou=uu(Po);function iu(e,t,n){var r=t+"";return ou(e,function(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(Me,"{\n/* [wrapped with "+t+"] */\n")}(r,function(e,t){return Kt(z,function(n){var r="_."+n[0];t&n[1]&&!Xt(e,r)&&e.push(r)}),e.sort()}(function(e){var t=e.match(Fe);return t?t[1].split(Le):[]}(r),n)))}function uu(e){var t=0,n=0;return function(){var r=qn(),o=j-(r-n);if(n=r,o>0){if(++t>=T)return arguments[0]}else t=0;return e.apply(i,arguments)}}function au(e,t){var n=-1,r=e.length,o=r-1;for(t=t===i?r:t;++n<t;){var u=_o(n,o),a=e[u];e[u]=e[n],e[n]=a}return e.length=t,e}var lu=function(e){var t=ua(e,function(e){return n.size===s&&n.clear(),e}),n=t.cache;return t}(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(Ne,function(e,n,r,o){t.push(r?o.replace(We,"$1"):n||e)}),t});function cu(e){if("string"==typeof e||Ia(e))return e;var t=e+"";return"0"==t&&1/e==-D?"-0":t}function su(e){if(null!=e){try{return lt.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function fu(e){if(e instanceof yr)return e.clone();var t=new mr(e.__wrapped__,e.__chain__);return t.__actions__=ni(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}var pu=Oo(function(e,t){return ga(e)?Mr(e,$r(t,1,ga,!0)):[]}),du=Oo(function(e,t){var n=Eu(t);return ga(n)&&(n=i),ga(e)?Mr(e,$r(t,1,ga,!0),Ai(n,2)):[]}),hu=Oo(function(e,t){var n=Eu(t);return ga(n)&&(n=i),ga(e)?Mr(e,$r(t,1,ga,!0),i,n):[]});function mu(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:za(n);return o<0&&(o=Vn(r+o,0)),an(e,Ai(t,3),o)}function yu(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r-1;return n!==i&&(o=za(n),o=n<0?Vn(r+o,0):Hn(o,r-1)),an(e,Ai(t,3),o,!0)}function vu(e){return null!=e&&e.length?$r(e,1):[]}function bu(e){return e&&e.length?e[0]:i}var gu=Oo(function(e){var t=Jt(e,Vo);return t.length&&t[0]===e[0]?to(t):[]}),wu=Oo(function(e){var t=Eu(e),n=Jt(e,Vo);return t===Eu(n)?t=i:n.pop(),n.length&&n[0]===e[0]?to(n,Ai(t,2)):[]}),_u=Oo(function(e){var t=Eu(e),n=Jt(e,Vo);return(t="function"==typeof t?t:i)&&n.pop(),n.length&&n[0]===e[0]?to(n,i,t):[]});function Eu(e){var t=null==e?0:e.length;return t?e[t-1]:i}var Ou=Oo(Su);function Su(e,t){return e&&e.length&&t&&t.length?go(e,t):e}var xu=Ti(function(e,t){var n=null==e?0:e.length,r=Rr(e,t);return wo(e,Jt(t,function(e){return Hi(e,n)?+e:e}).sort(Jo)),r});function ku(e){return null==e?e:Qn.call(e)}var Cu=Oo(function(e){return Mo($r(e,1,ga,!0))}),Pu=Oo(function(e){var t=Eu(e);return ga(t)&&(t=i),Mo($r(e,1,ga,!0),Ai(t,2))}),Tu=Oo(function(e){var t=Eu(e);return t="function"==typeof t?t:i,Mo($r(e,1,ga,!0),i,t)});function ju(e){if(!e||!e.length)return[];var t=0;return e=Gt(e,function(e){if(ga(e))return t=Vn(e.length,t),!0}),yn(t,function(t){return Jt(e,pn(t))})}function Nu(e,t){if(!e||!e.length)return[];var n=ju(e);return null==t?n:Jt(n,function(e){return Ht(t,i,e)})}var Ru=Oo(function(e,t){return ga(e)?Mr(e,t):[]}),Du=Oo(function(e){return Bo(Gt(e,ga))}),Iu=Oo(function(e){var t=Eu(e);return ga(t)&&(t=i),Bo(Gt(e,ga),Ai(t,2))}),Au=Oo(function(e){var t=Eu(e);return t="function"==typeof t?t:i,Bo(Gt(e,ga),i,t)}),Uu=Oo(ju);var Mu=Oo(function(e){var t=e.length,n=t>1?e[t-1]:i;return Nu(e,n="function"==typeof n?(e.pop(),n):i)});function Fu(e){var t=pr(e);return t.__chain__=!0,t}function Lu(e,t){return t(e)}var zu=Ti(function(e){var t=e.length,n=t?e[0]:0,r=this.__wrapped__,o=function(t){return Rr(t,e)};return!(t>1||this.__actions__.length)&&r instanceof yr&&Hi(n)?((r=r.slice(n,+n+(t?1:0))).__actions__.push({func:Lu,args:[o],thisArg:i}),new mr(r,this.__chain__).thru(function(e){return t&&!e.length&&e.push(i),e})):this.thru(o)});var Wu=oi(function(e,t,n){ct.call(e,n)?++e[n]:Nr(e,n,1)});var Bu=fi(mu),$u=fi(yu);function Vu(e,t){return(ya(e)?Kt:Fr)(e,Ai(t,3))}function Hu(e,t){return(ya(e)?Yt:Lr)(e,Ai(t,3))}var qu=oi(function(e,t,n){ct.call(e,n)?e[n].push(t):Nr(e,n,[t])});var Ku=Oo(function(e,t,r){var o=-1,i="function"==typeof t,u=ba(e)?n(e.length):[];return Fr(e,function(e){u[++o]=i?Ht(t,e,r):no(e,t,r)}),u}),Yu=oi(function(e,t,n){Nr(e,n,t)});function Qu(e,t){return(ya(e)?Jt:fo)(e,Ai(t,3))}var Gu=oi(function(e,t,n){e[n?0:1].push(t)},function(){return[[],[]]});var Xu=Oo(function(e,t){if(null==e)return[];var n=t.length;return n>1&&qi(e,t[0],t[1])?t=[]:n>2&&qi(t[0],t[1],t[2])&&(t=[t[0]]),vo(e,$r(t,1),[])}),Zu=An||function(){return Dt.Date.now()};function Ju(e,t,n){return t=n?i:t,t=e&&null==t?e.length:t,Si(e,S,i,i,i,i,t)}function ea(e,t){var n;if("function"!=typeof t)throw new rt(l);return e=za(e),function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=i),n}}var ta=Oo(function(e,t,n){var r=v;if(n.length){var o=Pn(n,Ii(ta));r|=E}return Si(e,r,t,n,o)}),na=Oo(function(e,t,n){var r=v|b;if(n.length){var o=Pn(n,Ii(na));r|=E}return Si(t,r,e,n,o)});function ra(e,t,n){var r,o,u,a,c,s,f=0,p=!1,d=!1,h=!0;if("function"!=typeof e)throw new rt(l);function m(t){var n=r,u=o;return r=o=i,f=t,a=e.apply(u,n)}function y(e){var n=e-s;return s===i||n>=t||n<0||d&&e-f>=u}function v(){var e=Zu();if(y(e))return b(e);c=ru(v,function(e){var n=t-(e-s);return d?Hn(n,u-(e-f)):n}(e))}function b(e){return c=i,h&&r?m(e):(r=o=i,a)}function g(){var e=Zu(),n=y(e);if(r=arguments,o=this,s=e,n){if(c===i)return function(e){return f=e,c=ru(v,t),p?m(e):a}(s);if(d)return c=ru(v,t),m(s)}return c===i&&(c=ru(v,t)),a}return t=Ba(t)||0,ka(n)&&(p=!!n.leading,u=(d="maxWait"in n)?Vn(Ba(n.maxWait)||0,t):u,h="trailing"in n?!!n.trailing:h),g.cancel=function(){c!==i&&Qo(c),f=0,r=s=o=c=i},g.flush=function(){return c===i?a:b(Zu())},g}var oa=Oo(function(e,t){return Ur(e,1,t)}),ia=Oo(function(e,t,n){return Ur(e,Ba(t)||0,n)});function ua(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new rt(l);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var u=e.apply(this,r);return n.cache=i.set(o,u)||i,u};return n.cache=new(ua.Cache||gr),n}function aa(e){if("function"!=typeof e)throw new rt(l);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}ua.Cache=gr;var la=Ko(function(e,t){var n=(t=1==t.length&&ya(t[0])?Jt(t[0],vn(Ai())):Jt($r(t,1),vn(Ai()))).length;return Oo(function(r){for(var o=-1,i=Hn(r.length,n);++o<i;)r[o]=t[o].call(this,r[o]);return Ht(e,this,r)})}),ca=Oo(function(e,t){var n=Pn(t,Ii(ca));return Si(e,E,i,t,n)}),sa=Oo(function(e,t){var n=Pn(t,Ii(sa));return Si(e,O,i,t,n)}),fa=Ti(function(e,t){return Si(e,x,i,i,i,t)});function pa(e,t){return e===t||e!=e&&t!=t}var da=gi(Zr),ha=gi(function(e,t){return e>=t}),ma=ro(function(){return arguments}())?ro:function(e){return Ca(e)&&ct.call(e,"callee")&&!Rt.call(e,"callee")},ya=n.isArray,va=Lt?vn(Lt):function(e){return Ca(e)&&Xr(e)==le};function ba(e){return null!=e&&xa(e.length)&&!Oa(e)}function ga(e){return Ca(e)&&ba(e)}var wa=zn||Bl,_a=zt?vn(zt):function(e){return Ca(e)&&Xr(e)==H};function Ea(e){if(!Ca(e))return!1;var t=Xr(e);return t==K||t==q||"string"==typeof e.message&&"string"==typeof e.name&&!ja(e)}function Oa(e){if(!ka(e))return!1;var t=Xr(e);return t==Y||t==Q||t==$||t==ee}function Sa(e){return"number"==typeof e&&e==za(e)}function xa(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=I}function ka(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function Ca(e){return null!=e&&"object"==typeof e}var Pa=Wt?vn(Wt):function(e){return Ca(e)&&Wi(e)==G};function Ta(e){return"number"==typeof e||Ca(e)&&Xr(e)==X}function ja(e){if(!Ca(e)||Xr(e)!=J)return!1;var t=Pt(e);if(null===t)return!0;var n=ct.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&lt.call(n)==dt}var Na=Bt?vn(Bt):function(e){return Ca(e)&&Xr(e)==te};var Ra=$t?vn($t):function(e){return Ca(e)&&Wi(e)==ne};function Da(e){return"string"==typeof e||!ya(e)&&Ca(e)&&Xr(e)==re}function Ia(e){return"symbol"==typeof e||Ca(e)&&Xr(e)==oe}var Aa=Vt?vn(Vt):function(e){return Ca(e)&&xa(e.length)&&!!kt[Xr(e)]};var Ua=gi(so),Ma=gi(function(e,t){return e<=t});function Fa(e){if(!e)return[];if(ba(e))return Da(e)?Rn(e):ni(e);if(Mt&&e[Mt])return function(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}(e[Mt]());var t=Wi(e);return(t==G?kn:t==ne?Tn:pl)(e)}function La(e){return e?(e=Ba(e))===D||e===-D?(e<0?-1:1)*A:e==e?e:0:0===e?e:0}function za(e){var t=La(e),n=t%1;return t==t?n?t-n:t:0}function Wa(e){return e?Dr(za(e),0,M):0}function Ba(e){if("number"==typeof e)return e;if(Ia(e))return U;if(ka(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=ka(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(Ie,"");var n=He.test(e);return n||Ke.test(e)?jt(e.slice(2),n?2:8):Ve.test(e)?U:+e}function $a(e){return ri(e,ol(e))}function Va(e){return null==e?"":Uo(e)}var Ha=ii(function(e,t){if(Gi(t)||ba(t))ri(t,rl(t),e);else for(var n in t)ct.call(t,n)&&Cr(e,n,t[n])}),qa=ii(function(e,t){ri(t,ol(t),e)}),Ka=ii(function(e,t,n,r){ri(t,ol(t),e,r)}),Ya=ii(function(e,t,n,r){ri(t,rl(t),e,r)}),Qa=Ti(Rr);var Ga=Oo(function(e,t){e=et(e);var n=-1,r=t.length,o=r>2?t[2]:i;for(o&&qi(t[0],t[1],o)&&(r=1);++n<r;)for(var u=t[n],a=ol(u),l=-1,c=a.length;++l<c;){var s=a[l],f=e[s];(f===i||pa(f,ut[s])&&!ct.call(e,s))&&(e[s]=u[s])}return e}),Xa=Oo(function(e){return e.push(i,ki),Ht(ul,i,e)});function Za(e,t,n){var r=null==e?i:Qr(e,t);return r===i?n:r}function Ja(e,t){return null!=e&&Bi(e,t,eo)}var el=hi(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=pt.call(t)),e[t]=n},kl(Tl)),tl=hi(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=pt.call(t)),ct.call(e,t)?e[t].push(n):e[t]=[n]},Ai),nl=Oo(no);function rl(e){return ba(e)?Er(e):lo(e)}function ol(e){return ba(e)?Er(e,!0):co(e)}var il=ii(function(e,t,n){mo(e,t,n)}),ul=ii(function(e,t,n,r){mo(e,t,n,r)}),al=Ti(function(e,t){var n={};if(null==e)return n;var r=!1;t=Jt(t,function(t){return t=qo(t,e),r||(r=t.length>1),t}),ri(e,Ni(e),n),r&&(n=Ir(n,p|d|h,Ci));for(var o=t.length;o--;)Fo(n,t[o]);return n});var ll=Ti(function(e,t){return null==e?{}:function(e,t){return bo(e,t,function(t,n){return Ja(e,n)})}(e,t)});function cl(e,t){if(null==e)return{};var n=Jt(Ni(e),function(e){return[e]});return t=Ai(t),bo(e,n,function(e,n){return t(e,n[0])})}var sl=Oi(rl),fl=Oi(ol);function pl(e){return null==e?[]:bn(e,rl(e))}var dl=ci(function(e,t,n){return t=t.toLowerCase(),e+(n?hl(t):t)});function hl(e){return El(Va(e).toLowerCase())}function ml(e){return(e=Va(e))&&e.replace(Qe,En).replace(gt,"")}var yl=ci(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()}),vl=ci(function(e,t,n){return e+(n?" ":"")+t.toLowerCase()}),bl=li("toLowerCase");var gl=ci(function(e,t,n){return e+(n?"_":"")+t.toLowerCase()});var wl=ci(function(e,t,n){return e+(n?" ":"")+El(t)});var _l=ci(function(e,t,n){return e+(n?" ":"")+t.toUpperCase()}),El=li("toUpperCase");function Ol(e,t,n){return e=Va(e),(t=n?i:t)===i?function(e){return Ot.test(e)}(e)?function(e){return e.match(_t)||[]}(e):function(e){return e.match(ze)||[]}(e):e.match(t)||[]}var Sl=Oo(function(e,t){try{return Ht(e,i,t)}catch(e){return Ea(e)?e:new o(e)}}),xl=Ti(function(e,t){return Kt(t,function(t){t=cu(t),Nr(e,t,ta(e[t],e))}),e});function kl(e){return function(){return e}}var Cl=pi(),Pl=pi(!0);function Tl(e){return e}function jl(e){return ao("function"==typeof e?e:Ir(e,p))}var Nl=Oo(function(e,t){return function(n){return no(n,e,t)}}),Rl=Oo(function(e,t){return function(n){return no(e,n,t)}});function Dl(e,t,n){var r=rl(t),o=Yr(t,r);null!=n||ka(t)&&(o.length||!r.length)||(n=t,t=e,e=this,o=Yr(t,rl(t)));var i=!(ka(n)&&"chain"in n&&!n.chain),u=Oa(e);return Kt(o,function(n){var r=t[n];e[n]=r,u&&(e.prototype[n]=function(){var t=this.__chain__;if(i||t){var n=e(this.__wrapped__);return(n.__actions__=ni(this.__actions__)).push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,en([this.value()],arguments))})}),e}function Il(){}var Al=yi(Jt),Ul=yi(Qt),Ml=yi(rn);function Fl(e){return Ki(e)?pn(cu(e)):function(e){return function(t){return Qr(t,e)}}(e)}var Ll=bi(),zl=bi(!0);function Wl(){return[]}function Bl(){return!1}var $l=mi(function(e,t){return e+t},0),Vl=_i("ceil"),Hl=mi(function(e,t){return e/t},1),ql=_i("floor");var Kl=mi(function(e,t){return e*t},1),Yl=_i("round"),Ql=mi(function(e,t){return e-t},0);return pr.after=function(e,t){if("function"!=typeof t)throw new rt(l);return e=za(e),function(){if(--e<1)return t.apply(this,arguments)}},pr.ary=Ju,pr.assign=Ha,pr.assignIn=qa,pr.assignInWith=Ka,pr.assignWith=Ya,pr.at=Qa,pr.before=ea,pr.bind=ta,pr.bindAll=xl,pr.bindKey=na,pr.castArray=function(){if(!arguments.length)return[];var e=arguments[0];return ya(e)?e:[e]},pr.chain=Fu,pr.chunk=function(e,t,r){t=(r?qi(e,t,r):t===i)?1:Vn(za(t),0);var o=null==e?0:e.length;if(!o||t<1)return[];for(var u=0,a=0,l=n(Mn(o/t));u<o;)l[a++]=jo(e,u,u+=t);return l},pr.compact=function(e){for(var t=-1,n=null==e?0:e.length,r=0,o=[];++t<n;){var i=e[t];i&&(o[r++]=i)}return o},pr.concat=function(){var e=arguments.length;if(!e)return[];for(var t=n(e-1),r=arguments[0],o=e;o--;)t[o-1]=arguments[o];return en(ya(r)?ni(r):[r],$r(t,1))},pr.cond=function(e){var t=null==e?0:e.length,n=Ai();return e=t?Jt(e,function(e){if("function"!=typeof e[1])throw new rt(l);return[n(e[0]),e[1]]}):[],Oo(function(n){for(var r=-1;++r<t;){var o=e[r];if(Ht(o[0],this,n))return Ht(o[1],this,n)}})},pr.conforms=function(e){return function(e){var t=rl(e);return function(n){return Ar(n,e,t)}}(Ir(e,p))},pr.constant=kl,pr.countBy=Wu,pr.create=function(e,t){var n=dr(e);return null==t?n:jr(n,t)},pr.curry=function e(t,n,r){var o=Si(t,w,i,i,i,i,i,n=r?i:n);return o.placeholder=e.placeholder,o},pr.curryRight=function e(t,n,r){var o=Si(t,_,i,i,i,i,i,n=r?i:n);return o.placeholder=e.placeholder,o},pr.debounce=ra,pr.defaults=Ga,pr.defaultsDeep=Xa,pr.defer=oa,pr.delay=ia,pr.difference=pu,pr.differenceBy=du,pr.differenceWith=hu,pr.drop=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,(t=n||t===i?1:za(t))<0?0:t,r):[]},pr.dropRight=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,0,(t=r-(t=n||t===i?1:za(t)))<0?0:t):[]},pr.dropRightWhile=function(e,t){return e&&e.length?zo(e,Ai(t,3),!0,!0):[]},pr.dropWhile=function(e,t){return e&&e.length?zo(e,Ai(t,3),!0):[]},pr.fill=function(e,t,n,r){var o=null==e?0:e.length;return o?(n&&"number"!=typeof n&&qi(e,t,n)&&(n=0,r=o),function(e,t,n,r){var o=e.length;for((n=za(n))<0&&(n=-n>o?0:o+n),(r=r===i||r>o?o:za(r))<0&&(r+=o),r=n>r?0:Wa(r);n<r;)e[n++]=t;return e}(e,t,n,r)):[]},pr.filter=function(e,t){return(ya(e)?Gt:Br)(e,Ai(t,3))},pr.flatMap=function(e,t){return $r(Qu(e,t),1)},pr.flatMapDeep=function(e,t){return $r(Qu(e,t),D)},pr.flatMapDepth=function(e,t,n){return n=n===i?1:za(n),$r(Qu(e,t),n)},pr.flatten=vu,pr.flattenDeep=function(e){return null!=e&&e.length?$r(e,D):[]},pr.flattenDepth=function(e,t){return null!=e&&e.length?$r(e,t=t===i?1:za(t)):[]},pr.flip=function(e){return Si(e,k)},pr.flow=Cl,pr.flowRight=Pl,pr.fromPairs=function(e){for(var t=-1,n=null==e?0:e.length,r={};++t<n;){var o=e[t];r[o[0]]=o[1]}return r},pr.functions=function(e){return null==e?[]:Yr(e,rl(e))},pr.functionsIn=function(e){return null==e?[]:Yr(e,ol(e))},pr.groupBy=qu,pr.initial=function(e){return null!=e&&e.length?jo(e,0,-1):[]},pr.intersection=gu,pr.intersectionBy=wu,pr.intersectionWith=_u,pr.invert=el,pr.invertBy=tl,pr.invokeMap=Ku,pr.iteratee=jl,pr.keyBy=Yu,pr.keys=rl,pr.keysIn=ol,pr.map=Qu,pr.mapKeys=function(e,t){var n={};return t=Ai(t,3),qr(e,function(e,r,o){Nr(n,t(e,r,o),e)}),n},pr.mapValues=function(e,t){var n={};return t=Ai(t,3),qr(e,function(e,r,o){Nr(n,r,t(e,r,o))}),n},pr.matches=function(e){return po(Ir(e,p))},pr.matchesProperty=function(e,t){return ho(e,Ir(t,p))},pr.memoize=ua,pr.merge=il,pr.mergeWith=ul,pr.method=Nl,pr.methodOf=Rl,pr.mixin=Dl,pr.negate=aa,pr.nthArg=function(e){return e=za(e),Oo(function(t){return yo(t,e)})},pr.omit=al,pr.omitBy=function(e,t){return cl(e,aa(Ai(t)))},pr.once=function(e){return ea(2,e)},pr.orderBy=function(e,t,n,r){return null==e?[]:(ya(t)||(t=null==t?[]:[t]),ya(n=r?i:n)||(n=null==n?[]:[n]),vo(e,t,n))},pr.over=Al,pr.overArgs=la,pr.overEvery=Ul,pr.overSome=Ml,pr.partial=ca,pr.partialRight=sa,pr.partition=Gu,pr.pick=ll,pr.pickBy=cl,pr.property=Fl,pr.propertyOf=function(e){return function(t){return null==e?i:Qr(e,t)}},pr.pull=Ou,pr.pullAll=Su,pr.pullAllBy=function(e,t,n){return e&&e.length&&t&&t.length?go(e,t,Ai(n,2)):e},pr.pullAllWith=function(e,t,n){return e&&e.length&&t&&t.length?go(e,t,i,n):e},pr.pullAt=xu,pr.range=Ll,pr.rangeRight=zl,pr.rearg=fa,pr.reject=function(e,t){return(ya(e)?Gt:Br)(e,aa(Ai(t,3)))},pr.remove=function(e,t){var n=[];if(!e||!e.length)return n;var r=-1,o=[],i=e.length;for(t=Ai(t,3);++r<i;){var u=e[r];t(u,r,e)&&(n.push(u),o.push(r))}return wo(e,o),n},pr.rest=function(e,t){if("function"!=typeof e)throw new rt(l);return Oo(e,t=t===i?t:za(t))},pr.reverse=ku,pr.sampleSize=function(e,t,n){return t=(n?qi(e,t,n):t===i)?1:za(t),(ya(e)?Sr:xo)(e,t)},pr.set=function(e,t,n){return null==e?e:ko(e,t,n)},pr.setWith=function(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:ko(e,t,n,r)},pr.shuffle=function(e){return(ya(e)?xr:To)(e)},pr.slice=function(e,t,n){var r=null==e?0:e.length;return r?(n&&"number"!=typeof n&&qi(e,t,n)?(t=0,n=r):(t=null==t?0:za(t),n=n===i?r:za(n)),jo(e,t,n)):[]},pr.sortBy=Xu,pr.sortedUniq=function(e){return e&&e.length?Io(e):[]},pr.sortedUniqBy=function(e,t){return e&&e.length?Io(e,Ai(t,2)):[]},pr.split=function(e,t,n){return n&&"number"!=typeof n&&qi(e,t,n)&&(t=n=i),(n=n===i?M:n>>>0)?(e=Va(e))&&("string"==typeof t||null!=t&&!Na(t))&&!(t=Uo(t))&&xn(e)?Yo(Rn(e),0,n):e.split(t,n):[]},pr.spread=function(e,t){if("function"!=typeof e)throw new rt(l);return t=null==t?0:Vn(za(t),0),Oo(function(n){var r=n[t],o=Yo(n,0,t);return r&&en(o,r),Ht(e,this,o)})},pr.tail=function(e){var t=null==e?0:e.length;return t?jo(e,1,t):[]},pr.take=function(e,t,n){return e&&e.length?jo(e,0,(t=n||t===i?1:za(t))<0?0:t):[]},pr.takeRight=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,(t=r-(t=n||t===i?1:za(t)))<0?0:t,r):[]},pr.takeRightWhile=function(e,t){return e&&e.length?zo(e,Ai(t,3),!1,!0):[]},pr.takeWhile=function(e,t){return e&&e.length?zo(e,Ai(t,3)):[]},pr.tap=function(e,t){return t(e),e},pr.throttle=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new rt(l);return ka(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),ra(e,t,{leading:r,maxWait:t,trailing:o})},pr.thru=Lu,pr.toArray=Fa,pr.toPairs=sl,pr.toPairsIn=fl,pr.toPath=function(e){return ya(e)?Jt(e,cu):Ia(e)?[e]:ni(lu(Va(e)))},pr.toPlainObject=$a,pr.transform=function(e,t,n){var r=ya(e),o=r||wa(e)||Aa(e);if(t=Ai(t,4),null==n){var i=e&&e.constructor;n=o?r?new i:[]:ka(e)&&Oa(i)?dr(Pt(e)):{}}return(o?Kt:qr)(e,function(e,r,o){return t(n,e,r,o)}),n},pr.unary=function(e){return Ju(e,1)},pr.union=Cu,pr.unionBy=Pu,pr.unionWith=Tu,pr.uniq=function(e){return e&&e.length?Mo(e):[]},pr.uniqBy=function(e,t){return e&&e.length?Mo(e,Ai(t,2)):[]},pr.uniqWith=function(e,t){return t="function"==typeof t?t:i,e&&e.length?Mo(e,i,t):[]},pr.unset=function(e,t){return null==e||Fo(e,t)},pr.unzip=ju,pr.unzipWith=Nu,pr.update=function(e,t,n){return null==e?e:Lo(e,t,Ho(n))},pr.updateWith=function(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:Lo(e,t,Ho(n),r)},pr.values=pl,pr.valuesIn=function(e){return null==e?[]:bn(e,ol(e))},pr.without=Ru,pr.words=Ol,pr.wrap=function(e,t){return ca(Ho(t),e)},pr.xor=Du,pr.xorBy=Iu,pr.xorWith=Au,pr.zip=Uu,pr.zipObject=function(e,t){return $o(e||[],t||[],Cr)},pr.zipObjectDeep=function(e,t){return $o(e||[],t||[],ko)},pr.zipWith=Mu,pr.entries=sl,pr.entriesIn=fl,pr.extend=qa,pr.extendWith=Ka,Dl(pr,pr),pr.add=$l,pr.attempt=Sl,pr.camelCase=dl,pr.capitalize=hl,pr.ceil=Vl,pr.clamp=function(e,t,n){return n===i&&(n=t,t=i),n!==i&&(n=(n=Ba(n))==n?n:0),t!==i&&(t=(t=Ba(t))==t?t:0),Dr(Ba(e),t,n)},pr.clone=function(e){return Ir(e,h)},pr.cloneDeep=function(e){return Ir(e,p|h)},pr.cloneDeepWith=function(e,t){return Ir(e,p|h,t="function"==typeof t?t:i)},pr.cloneWith=function(e,t){return Ir(e,h,t="function"==typeof t?t:i)},pr.conformsTo=function(e,t){return null==t||Ar(e,t,rl(t))},pr.deburr=ml,pr.defaultTo=function(e,t){return null==e||e!=e?t:e},pr.divide=Hl,pr.endsWith=function(e,t,n){e=Va(e),t=Uo(t);var r=e.length,o=n=n===i?r:Dr(za(n),0,r);return(n-=t.length)>=0&&e.slice(n,o)==t},pr.eq=pa,pr.escape=function(e){return(e=Va(e))&&xe.test(e)?e.replace(Oe,On):e},pr.escapeRegExp=function(e){return(e=Va(e))&&De.test(e)?e.replace(Re,"\\$&"):e},pr.every=function(e,t,n){var r=ya(e)?Qt:zr;return n&&qi(e,t,n)&&(t=i),r(e,Ai(t,3))},pr.find=Bu,pr.findIndex=mu,pr.findKey=function(e,t){return un(e,Ai(t,3),qr)},pr.findLast=$u,pr.findLastIndex=yu,pr.findLastKey=function(e,t){return un(e,Ai(t,3),Kr)},pr.floor=ql,pr.forEach=Vu,pr.forEachRight=Hu,pr.forIn=function(e,t){return null==e?e:Vr(e,Ai(t,3),ol)},pr.forInRight=function(e,t){return null==e?e:Hr(e,Ai(t,3),ol)},pr.forOwn=function(e,t){return e&&qr(e,Ai(t,3))},pr.forOwnRight=function(e,t){return e&&Kr(e,Ai(t,3))},pr.get=Za,pr.gt=da,pr.gte=ha,pr.has=function(e,t){return null!=e&&Bi(e,t,Jr)},pr.hasIn=Ja,pr.head=bu,pr.identity=Tl,pr.includes=function(e,t,n,r){e=ba(e)?e:pl(e),n=n&&!r?za(n):0;var o=e.length;return n<0&&(n=Vn(o+n,0)),Da(e)?n<=o&&e.indexOf(t,n)>-1:!!o&&ln(e,t,n)>-1},pr.indexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:za(n);return o<0&&(o=Vn(r+o,0)),ln(e,t,o)},pr.inRange=function(e,t,n){return t=La(t),n===i?(n=t,t=0):n=La(n),function(e,t,n){return e>=Hn(t,n)&&e<Vn(t,n)}(e=Ba(e),t,n)},pr.invoke=nl,pr.isArguments=ma,pr.isArray=ya,pr.isArrayBuffer=va,pr.isArrayLike=ba,pr.isArrayLikeObject=ga,pr.isBoolean=function(e){return!0===e||!1===e||Ca(e)&&Xr(e)==V},pr.isBuffer=wa,pr.isDate=_a,pr.isElement=function(e){return Ca(e)&&1===e.nodeType&&!ja(e)},pr.isEmpty=function(e){if(null==e)return!0;if(ba(e)&&(ya(e)||"string"==typeof e||"function"==typeof e.splice||wa(e)||Aa(e)||ma(e)))return!e.length;var t=Wi(e);if(t==G||t==ne)return!e.size;if(Gi(e))return!lo(e).length;for(var n in e)if(ct.call(e,n))return!1;return!0},pr.isEqual=function(e,t){return oo(e,t)},pr.isEqualWith=function(e,t,n){var r=(n="function"==typeof n?n:i)?n(e,t):i;return r===i?oo(e,t,i,n):!!r},pr.isError=Ea,pr.isFinite=function(e){return"number"==typeof e&&Wn(e)},pr.isFunction=Oa,pr.isInteger=Sa,pr.isLength=xa,pr.isMap=Pa,pr.isMatch=function(e,t){return e===t||io(e,t,Mi(t))},pr.isMatchWith=function(e,t,n){return n="function"==typeof n?n:i,io(e,t,Mi(t),n)},pr.isNaN=function(e){return Ta(e)&&e!=+e},pr.isNative=function(e){if(Qi(e))throw new o(a);return uo(e)},pr.isNil=function(e){return null==e},pr.isNull=function(e){return null===e},pr.isNumber=Ta,pr.isObject=ka,pr.isObjectLike=Ca,pr.isPlainObject=ja,pr.isRegExp=Na,pr.isSafeInteger=function(e){return Sa(e)&&e>=-I&&e<=I},pr.isSet=Ra,pr.isString=Da,pr.isSymbol=Ia,pr.isTypedArray=Aa,pr.isUndefined=function(e){return e===i},pr.isWeakMap=function(e){return Ca(e)&&Wi(e)==ue},pr.isWeakSet=function(e){return Ca(e)&&Xr(e)==ae},pr.join=function(e,t){return null==e?"":Bn.call(e,t)},pr.kebabCase=yl,pr.last=Eu,pr.lastIndexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r;return n!==i&&(o=(o=za(n))<0?Vn(r+o,0):Hn(o,r-1)),t==t?function(e,t,n){for(var r=n+1;r--;)if(e[r]===t)return r;return r}(e,t,o):an(e,sn,o,!0)},pr.lowerCase=vl,pr.lowerFirst=bl,pr.lt=Ua,pr.lte=Ma,pr.max=function(e){return e&&e.length?Wr(e,Tl,Zr):i},pr.maxBy=function(e,t){return e&&e.length?Wr(e,Ai(t,2),Zr):i},pr.mean=function(e){return fn(e,Tl)},pr.meanBy=function(e,t){return fn(e,Ai(t,2))},pr.min=function(e){return e&&e.length?Wr(e,Tl,so):i},pr.minBy=function(e,t){return e&&e.length?Wr(e,Ai(t,2),so):i},pr.stubArray=Wl,pr.stubFalse=Bl,pr.stubObject=function(){return{}},pr.stubString=function(){return""},pr.stubTrue=function(){return!0},pr.multiply=Kl,pr.nth=function(e,t){return e&&e.length?yo(e,za(t)):i},pr.noConflict=function(){return Dt._===this&&(Dt._=ht),this},pr.noop=Il,pr.now=Zu,pr.pad=function(e,t,n){e=Va(e);var r=(t=za(t))?Nn(e):0;if(!t||r>=t)return e;var o=(t-r)/2;return vi(Fn(o),n)+e+vi(Mn(o),n)},pr.padEnd=function(e,t,n){e=Va(e);var r=(t=za(t))?Nn(e):0;return t&&r<t?e+vi(t-r,n):e},pr.padStart=function(e,t,n){e=Va(e);var r=(t=za(t))?Nn(e):0;return t&&r<t?vi(t-r,n)+e:e},pr.parseInt=function(e,t,n){return n||null==t?t=0:t&&(t=+t),Kn(Va(e).replace(Ae,""),t||0)},pr.random=function(e,t,n){if(n&&"boolean"!=typeof n&&qi(e,t,n)&&(t=n=i),n===i&&("boolean"==typeof t?(n=t,t=i):"boolean"==typeof e&&(n=e,e=i)),e===i&&t===i?(e=0,t=1):(e=La(e),t===i?(t=e,e=0):t=La(t)),e>t){var r=e;e=t,t=r}if(n||e%1||t%1){var o=Yn();return Hn(e+o*(t-e+Tt("1e-"+((o+"").length-1))),t)}return _o(e,t)},pr.reduce=function(e,t,n){var r=ya(e)?tn:hn,o=arguments.length<3;return r(e,Ai(t,4),n,o,Fr)},pr.reduceRight=function(e,t,n){var r=ya(e)?nn:hn,o=arguments.length<3;return r(e,Ai(t,4),n,o,Lr)},pr.repeat=function(e,t,n){return t=(n?qi(e,t,n):t===i)?1:za(t),Eo(Va(e),t)},pr.replace=function(){var e=arguments,t=Va(e[0]);return e.length<3?t:t.replace(e[1],e[2])},pr.result=function(e,t,n){var r=-1,o=(t=qo(t,e)).length;for(o||(o=1,e=i);++r<o;){var u=null==e?i:e[cu(t[r])];u===i&&(r=o,u=n),e=Oa(u)?u.call(e):u}return e},pr.round=Yl,pr.runInContext=e,pr.sample=function(e){return(ya(e)?Or:So)(e)},pr.size=function(e){if(null==e)return 0;if(ba(e))return Da(e)?Nn(e):e.length;var t=Wi(e);return t==G||t==ne?e.size:lo(e).length},pr.snakeCase=gl,pr.some=function(e,t,n){var r=ya(e)?rn:No;return n&&qi(e,t,n)&&(t=i),r(e,Ai(t,3))},pr.sortedIndex=function(e,t){return Ro(e,t)},pr.sortedIndexBy=function(e,t,n){return Do(e,t,Ai(n,2))},pr.sortedIndexOf=function(e,t){var n=null==e?0:e.length;if(n){var r=Ro(e,t);if(r<n&&pa(e[r],t))return r}return-1},pr.sortedLastIndex=function(e,t){return Ro(e,t,!0)},pr.sortedLastIndexBy=function(e,t,n){return Do(e,t,Ai(n,2),!0)},pr.sortedLastIndexOf=function(e,t){if(null!=e&&e.length){var n=Ro(e,t,!0)-1;if(pa(e[n],t))return n}return-1},pr.startCase=wl,pr.startsWith=function(e,t,n){return e=Va(e),n=null==n?0:Dr(za(n),0,e.length),t=Uo(t),e.slice(n,n+t.length)==t},pr.subtract=Ql,pr.sum=function(e){return e&&e.length?mn(e,Tl):0},pr.sumBy=function(e,t){return e&&e.length?mn(e,Ai(t,2)):0},pr.template=function(e,t,n){var r=pr.templateSettings;n&&qi(e,t,n)&&(t=i),e=Va(e),t=Ka({},t,r,xi);var o,u,a=Ka({},t.imports,r.imports,xi),l=rl(a),c=bn(a,l),s=0,f=t.interpolate||Ge,p="__p += '",d=tt((t.escape||Ge).source+"|"+f.source+"|"+(f===Pe?Be:Ge).source+"|"+(t.evaluate||Ge).source+"|$","g"),h="//# sourceURL="+("sourceURL"in t?t.sourceURL:"lodash.templateSources["+ ++xt+"]")+"\n";e.replace(d,function(t,n,r,i,a,l){return r||(r=i),p+=e.slice(s,l).replace(Xe,Sn),n&&(o=!0,p+="' +\n__e("+n+") +\n'"),a&&(u=!0,p+="';\n"+a+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),s=l+t.length,t}),p+="';\n";var m=t.variable;m||(p="with (obj) {\n"+p+"\n}\n"),p=(u?p.replace(ge,""):p).replace(we,"$1").replace(_e,"$1;"),p="function("+(m||"obj")+") {\n"+(m?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(u?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var y=Sl(function(){return Ze(l,h+"return "+p).apply(i,c)});if(y.source=p,Ea(y))throw y;return y},pr.times=function(e,t){if((e=za(e))<1||e>I)return[];var n=M,r=Hn(e,M);t=Ai(t),e-=M;for(var o=yn(r,t);++n<e;)t(n);return o},pr.toFinite=La,pr.toInteger=za,pr.toLength=Wa,pr.toLower=function(e){return Va(e).toLowerCase()},pr.toNumber=Ba,pr.toSafeInteger=function(e){return e?Dr(za(e),-I,I):0===e?e:0},pr.toString=Va,pr.toUpper=function(e){return Va(e).toUpperCase()},pr.trim=function(e,t,n){if((e=Va(e))&&(n||t===i))return e.replace(Ie,"");if(!e||!(t=Uo(t)))return e;var r=Rn(e),o=Rn(t);return Yo(r,wn(r,o),_n(r,o)+1).join("")},pr.trimEnd=function(e,t,n){if((e=Va(e))&&(n||t===i))return e.replace(Ue,"");if(!e||!(t=Uo(t)))return e;var r=Rn(e);return Yo(r,0,_n(r,Rn(t))+1).join("")},pr.trimStart=function(e,t,n){if((e=Va(e))&&(n||t===i))return e.replace(Ae,"");if(!e||!(t=Uo(t)))return e;var r=Rn(e);return Yo(r,wn(r,Rn(t))).join("")},pr.truncate=function(e,t){var n=C,r=P;if(ka(t)){var o="separator"in t?t.separator:o;n="length"in t?za(t.length):n,r="omission"in t?Uo(t.omission):r}var u=(e=Va(e)).length;if(xn(e)){var a=Rn(e);u=a.length}if(n>=u)return e;var l=n-Nn(r);if(l<1)return r;var c=a?Yo(a,0,l).join(""):e.slice(0,l);if(o===i)return c+r;if(a&&(l+=c.length-l),Na(o)){if(e.slice(l).search(o)){var s,f=c;for(o.global||(o=tt(o.source,Va($e.exec(o))+"g")),o.lastIndex=0;s=o.exec(f);)var p=s.index;c=c.slice(0,p===i?l:p)}}else if(e.indexOf(Uo(o),l)!=l){var d=c.lastIndexOf(o);d>-1&&(c=c.slice(0,d))}return c+r},pr.unescape=function(e){return(e=Va(e))&&Se.test(e)?e.replace(Ee,Dn):e},pr.uniqueId=function(e){var t=++st;return Va(e)+t},pr.upperCase=_l,pr.upperFirst=El,pr.each=Vu,pr.eachRight=Hu,pr.first=bu,Dl(pr,function(){var e={};return qr(pr,function(t,n){ct.call(pr.prototype,n)||(e[n]=t)}),e}(),{chain:!1}),pr.VERSION="4.17.11",Kt(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){pr[e].placeholder=pr}),Kt(["drop","take"],function(e,t){yr.prototype[e]=function(n){n=n===i?1:Vn(za(n),0);var r=this.__filtered__&&!t?new yr(this):this.clone();return r.__filtered__?r.__takeCount__=Hn(n,r.__takeCount__):r.__views__.push({size:Hn(n,M),type:e+(r.__dir__<0?"Right":"")}),r},yr.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),Kt(["filter","map","takeWhile"],function(e,t){var n=t+1,r=n==N||3==n;yr.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:Ai(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),Kt(["head","last"],function(e,t){var n="take"+(t?"Right":"");yr.prototype[e]=function(){return this[n](1).value()[0]}}),Kt(["initial","tail"],function(e,t){var n="drop"+(t?"":"Right");yr.prototype[e]=function(){return this.__filtered__?new yr(this):this[n](1)}}),yr.prototype.compact=function(){return this.filter(Tl)},yr.prototype.find=function(e){return this.filter(e).head()},yr.prototype.findLast=function(e){return this.reverse().find(e)},yr.prototype.invokeMap=Oo(function(e,t){return"function"==typeof e?new yr(this):this.map(function(n){return no(n,e,t)})}),yr.prototype.reject=function(e){return this.filter(aa(Ai(e)))},yr.prototype.slice=function(e,t){e=za(e);var n=this;return n.__filtered__&&(e>0||t<0)?new yr(n):(e<0?n=n.takeRight(-e):e&&(n=n.drop(e)),t!==i&&(n=(t=za(t))<0?n.dropRight(-t):n.take(t-e)),n)},yr.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},yr.prototype.toArray=function(){return this.take(M)},qr(yr.prototype,function(e,t){var n=/^(?:filter|find|map|reject)|While$/.test(t),r=/^(?:head|last)$/.test(t),o=pr[r?"take"+("last"==t?"Right":""):t],u=r||/^find/.test(t);o&&(pr.prototype[t]=function(){var t=this.__wrapped__,a=r?[1]:arguments,l=t instanceof yr,c=a[0],s=l||ya(t),f=function(e){var t=o.apply(pr,en([e],a));return r&&p?t[0]:t};s&&n&&"function"==typeof c&&1!=c.length&&(l=s=!1);var p=this.__chain__,d=!!this.__actions__.length,h=u&&!p,m=l&&!d;if(!u&&s){t=m?t:new yr(this);var y=e.apply(t,a);return y.__actions__.push({func:Lu,args:[f],thisArg:i}),new mr(y,p)}return h&&m?e.apply(this,a):(y=this.thru(f),h?r?y.value()[0]:y.value():y)})}),Kt(["pop","push","shift","sort","splice","unshift"],function(e){var t=ot[e],n=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",r=/^(?:pop|shift)$/.test(e);pr.prototype[e]=function(){var e=arguments;if(r&&!this.__chain__){var o=this.value();return t.apply(ya(o)?o:[],e)}return this[n](function(n){return t.apply(ya(n)?n:[],e)})}}),qr(yr.prototype,function(e,t){var n=pr[t];if(n){var r=n.name+"";(rr[r]||(rr[r]=[])).push({name:t,func:n})}}),rr[di(i,b).name]=[{name:"wrapper",func:i}],yr.prototype.clone=function(){var e=new yr(this.__wrapped__);return e.__actions__=ni(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=ni(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=ni(this.__views__),e},yr.prototype.reverse=function(){if(this.__filtered__){var e=new yr(this);e.__dir__=-1,e.__filtered__=!0}else(e=this.clone()).__dir__*=-1;return e},yr.prototype.value=function(){var e=this.__wrapped__.value(),t=this.__dir__,n=ya(e),r=t<0,o=n?e.length:0,i=function(e,t,n){for(var r=-1,o=n.length;++r<o;){var i=n[r],u=i.size;switch(i.type){case"drop":e+=u;break;case"dropRight":t-=u;break;case"take":t=Hn(t,e+u);break;case"takeRight":e=Vn(e,t-u)}}return{start:e,end:t}}(0,o,this.__views__),u=i.start,a=i.end,l=a-u,c=r?a:u-1,s=this.__iteratees__,f=s.length,p=0,d=Hn(l,this.__takeCount__);if(!n||!r&&o==l&&d==l)return Wo(e,this.__actions__);var h=[];e:for(;l--&&p<d;){for(var m=-1,y=e[c+=t];++m<f;){var v=s[m],b=v.iteratee,g=v.type,w=b(y);if(g==R)y=w;else if(!w){if(g==N)continue e;break e}}h[p++]=y}return h},pr.prototype.at=zu,pr.prototype.chain=function(){return Fu(this)},pr.prototype.commit=function(){return new mr(this.value(),this.__chain__)},pr.prototype.next=function(){this.__values__===i&&(this.__values__=Fa(this.value()));var e=this.__index__>=this.__values__.length;return{done:e,value:e?i:this.__values__[this.__index__++]}},pr.prototype.plant=function(e){for(var t,n=this;n instanceof hr;){var r=fu(n);r.__index__=0,r.__values__=i,t?o.__wrapped__=r:t=r;var o=r;n=n.__wrapped__}return o.__wrapped__=e,t},pr.prototype.reverse=function(){var e=this.__wrapped__;if(e instanceof yr){var t=e;return this.__actions__.length&&(t=new yr(this)),(t=t.reverse()).__actions__.push({func:Lu,args:[ku],thisArg:i}),new mr(t,this.__chain__)}return this.thru(ku)},pr.prototype.toJSON=pr.prototype.valueOf=pr.prototype.value=function(){return Wo(this.__wrapped__,this.__actions__)},pr.prototype.first=pr.prototype.head,Mt&&(pr.prototype[Mt]=function(){return this}),pr}();Dt._=In,(o=function(){return In}.call(t,n,t,r))===i||(r.exports=o)}).call(this)}).call(this,n(7),n(11)(e))},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){var r=n(33);e.exports=h,e.exports.parse=i,e.exports.compile=function(e,t){return l(i(e,t))},e.exports.tokensToFunction=l,e.exports.tokensToRegExp=d;var o=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function i(e,t){for(var n,r=[],i=0,u=0,a="",l=t&&t.delimiter||"/";null!=(n=o.exec(e));){var f=n[0],p=n[1],d=n.index;if(a+=e.slice(u,d),u=d+f.length,p)a+=p[1];else{var h=e[u],m=n[2],y=n[3],v=n[4],b=n[5],g=n[6],w=n[7];a&&(r.push(a),a="");var _=null!=m&&null!=h&&h!==m,E="+"===g||"*"===g,O="?"===g||"*"===g,S=n[2]||l,x=v||b;r.push({name:y||i++,prefix:m||"",delimiter:S,optional:O,repeat:E,partial:_,asterisk:!!w,pattern:x?s(x):w?".*":"[^"+c(S)+"]+?"})}}return u<e.length&&(a+=e.substr(u)),a&&r.push(a),r}function u(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function a(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function l(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,o){for(var i="",l=n||{},c=(o||{}).pretty?u:encodeURIComponent,s=0;s<e.length;s++){var f=e[s];if("string"!=typeof f){var p,d=l[f.name];if(null==d){if(f.optional){f.partial&&(i+=f.prefix);continue}throw new TypeError('Expected "'+f.name+'" to be defined')}if(r(d)){if(!f.repeat)throw new TypeError('Expected "'+f.name+'" to not repeat, but received `'+JSON.stringify(d)+"`");if(0===d.length){if(f.optional)continue;throw new TypeError('Expected "'+f.name+'" to not be empty')}for(var h=0;h<d.length;h++){if(p=c(d[h]),!t[s].test(p))throw new TypeError('Expected all "'+f.name+'" to match "'+f.pattern+'", but received `'+JSON.stringify(p)+"`");i+=(0===h?f.prefix:f.delimiter)+p}}else{if(p=f.asterisk?a(d):c(d),!t[s].test(p))throw new TypeError('Expected "'+f.name+'" to match "'+f.pattern+'", but received "'+p+'"');i+=f.prefix+p}}else i+=f}return i}}function c(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function s(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function f(e,t){return e.keys=t,e}function p(e){return e.sensitive?"":"i"}function d(e,t,n){r(t)||(n=t||n,t=[]);for(var o=(n=n||{}).strict,i=!1!==n.end,u="",a=0;a<e.length;a++){var l=e[a];if("string"==typeof l)u+=c(l);else{var s=c(l.prefix),d="(?:"+l.pattern+")";t.push(l),l.repeat&&(d+="(?:"+s+d+")*"),u+=d=l.optional?l.partial?s+"("+d+")?":"(?:"+s+"("+d+"))?":s+"("+d+")"}}var h=c(n.delimiter||"/"),m=u.slice(-h.length)===h;return o||(u=(m?u.slice(0,-h.length):u)+"(?:"+h+"(?=$))?"),u+=i?"$":o&&m?"":"(?="+h+"|$)",f(new RegExp("^"+u,p(n)),t)}function h(e,t,n){return r(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}(e,t):r(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(h(e[o],t,n).source);return f(new RegExp("(?:"+r.join("|")+")",p(n)),t)}(e,t,n):function(e,t,n){return d(i(e,n),t,n)}(e,t,n)}},function(e,t,n){var r=n(15),o=n(41),i=n(42),u="[object Null]",a="[object Undefined]",l=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?a:u:l&&l in Object(e)?o(e):i(e)}},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";e.exports=n(31)},function(e,t,n){"use strict";(function(e,r){var o,i=n(21);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var u=Object(i.a)(o);t.a=u}).call(this,n(7),n(32)(e))},function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,a=function(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),l=1;l<arguments.length;l++){for(var c in n=Object(arguments[l]))o.call(n,c)&&(a[c]=n[c]);if(r){u=r(n);for(var s=0;s<u.length;s++)i.call(n,u[s])&&(a[u[s]]=n[u[s]])}}return a}},function(e,t,n){var r=n(16).Symbol;e.exports=r},function(e,t,n){var r=n(17),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();e.exports=i},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(7))},function(e,t){var n=9007199254740991;e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}},function(e,t,n){"use strict";!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}(),e.exports=n(26)},function(e,t,n){"use strict";var r=n(12),o=(n(0),{childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0}),i={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},u={};u[r.ForwardRef]={$$typeof:!0,render:!0};var a=Object.defineProperty,l=Object.getOwnPropertyNames,c=Object.getOwnPropertySymbols,s=Object.getOwnPropertyDescriptor,f=Object.getPrototypeOf,p=Object.prototype;e.exports=function e(t,n,r){if("string"!=typeof n){if(p){var d=f(n);d&&d!==p&&e(t,d,r)}var h=l(n);c&&(h=h.concat(c(n)));for(var m=u[t.$$typeof]||o,y=u[n.$$typeof]||o,v=0;v<h.length;++v){var b=h[v];if(!(i[b]||r&&r[b]||y&&y[b]||m&&m[b])){var g=s(n,b);try{a(t,b,g)}catch(e){}}}return t}return t}},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}n.d(t,"a",function(){return r})},function(e,t,n){"use strict";var r={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},o={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},i=Object.defineProperty,u=Object.getOwnPropertyNames,a=Object.getOwnPropertySymbols,l=Object.getOwnPropertyDescriptor,c=Object.getPrototypeOf,s=c&&c(Object);e.exports=function e(t,n,f){if("string"!=typeof n){if(s){var p=c(n);p&&p!==s&&e(t,p,f)}var d=u(n);a&&(d=d.concat(a(n)));for(var h=0;h<d.length;++h){var m=d[h];if(!(r[m]||o[m]||f&&f[m])){var y=l(n,m);try{i(t,m,y)}catch(e){}}}return t}return t}},function(e,t,n){var r=n(34),o=n(36);e.exports=function(e){return null==e?[]:r(e,o(e))}},function(e,t,n){(function(e){!function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function i(e,t){i.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function u(e,t){u.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,n){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function l(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function c(e){var t=void 0===e?"undefined":E(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function s(e,t,n,r,f,p,d){f=f||[],d=d||[];var h=f.slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":E(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var m=r.normalize(h,p,e,t);m&&(e=m[0],t=m[1])}}}h.push(p)}"regexp"===c(e)&&"regexp"===c(t)&&(e=e.toString(),t=t.toString());var y=void 0===e?"undefined":E(e),v=void 0===t?"undefined":E(t),b="undefined"!==y||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),g="undefined"!==v||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!b&&g)n(new i(h,t));else if(!g&&b)n(new u(h,e));else if(c(e)!==c(t))n(new o(h,e,t));else if("date"===c(e)&&e-t!=0)n(new o(h,e,t));else if("object"===y&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var w;for(e.length,w=0;w<e.length;w++)w>=t.length?n(new a(h,w,new u(void 0,e[w]))):s(e[w],t[w],n,r,h,w,d);for(;w<t.length;)n(new a(h,w,new i(void 0,t[w++])))}else{var _=Object.keys(e),O=Object.keys(t);_.forEach(function(o,i){var u=O.indexOf(o);u>=0?(s(e[o],t[o],n,r,h,o,d),O=l(O,u)):s(e[o],void 0,n,r,h,o,d)}),O.forEach(function(e){s(void 0,t[e],n,r,h,e,d)})}d.length=d.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],s(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,i=n.path?n.path.length-1:0;++o<i;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],u=r.path.length-1;for(o=0;o<u;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":delete i[r.path[o]];break;case"E":case"N":i[r.path[o]]=r.rhs}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":t=l(t,n);break;case"E":case"N":t[n]=r.rhs}return t}(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function d(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=function(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,i=e.index,u=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+i+"]",u];default:return[]}}(e);n.log.apply(n,["%c "+x[t].text,function(e){return"color: "+x[e].color+"; font-weight: bold"}(t)].concat(O(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function h(e,t,n,r){switch(void 0===e?"undefined":E(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,O(n)):e[r];case"function":return e(t);default:return e}}function m(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,i=void 0===o?function(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+r),n&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}(t):o,u=t.collapsed,a=t.colors,l=t.level,c=t.diff,s=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,m=o.startedTime,y=o.action,v=o.prevState,b=o.error,g=o.took,_=o.nextState,E=e[f+1];E&&(_=E.prevState,g=E.started-p);var O=r(y),S="function"==typeof u?u(function(){return _},y,o):u,x=w(m),k=a.title?"color: "+a.title(O)+";":"",C=["color: gray; font-weight: lighter;"];C.push(k),t.timestamp&&C.push("color: gray; font-weight: lighter;"),t.duration&&C.push("color: gray; font-weight: lighter;");var P=i(O,x,g);try{S?a.title&&s?n.groupCollapsed.apply(n,["%c "+P].concat(C)):n.groupCollapsed(P):a.title&&s?n.group.apply(n,["%c "+P].concat(C)):n.group(P)}catch(e){n.log(P)}var T=h(l,O,[v],"prevState"),j=h(l,O,[O],"action"),N=h(l,O,[b,v],"error"),R=h(l,O,[_],"nextState");if(T)if(a.prevState){var D="color: "+a.prevState(v)+"; font-weight: bold";n[T]("%c prev state",D,v)}else n[T]("prev state",v);if(j)if(a.action){var I="color: "+a.action(O)+"; font-weight: bold";n[j]("%c action    ",I,O)}else n[j]("action    ",O);if(b&&N)if(a.error){var A="color: "+a.error(b,v)+"; font-weight: bold;";n[N]("%c error     ",A,b)}else n[N]("error     ",b);if(R)if(a.nextState){var U="color: "+a.nextState(_)+"; font-weight: bold";n[R]("%c next state",U,_)}else n[R]("next state",_);c&&d(v,_,n,S);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function y(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},k,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,i=t.predicate,u=t.logErrors,a=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var l=[];return function(e){var n=e.getState;return function(e){return function(c){if("function"==typeof i&&!i(n,c))return e(c);var s={};l.push(s),s.started=_.now(),s.startedTime=new Date,s.prevState=r(n()),s.action=c;var f=void 0;if(u)try{f=e(c)}catch(e){s.error=o(e)}else f=e(c);s.took=_.now()-s.started,s.nextState=r(n());var p=t.diff&&"function"==typeof a?a(n,c):t.diff;if(m(l,Object.assign({},t,{diff:p})),l.length=0,s.error)throw s.error;return f}}}}var v,b,g=function(e,t){return function(e,t){return new Array(t+1).join(e)}("0",t-e.toString().length)+e},w=function(e){return g(e.getHours(),2)+":"+g(e.getMinutes(),2)+":"+g(e.getSeconds(),2)+"."+g(e.getMilliseconds(),3)},_="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},O=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},S=[];v="object"===(void 0===e?"undefined":E(e))&&e?e:"undefined"!=typeof window?window:{},(b=v.DeepDiff)&&S.push(function(){void 0!==b&&v.DeepDiff===f&&(v.DeepDiff=b,b=void 0)}),n(o,r),n(i,r),n(u,r),n(a,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:s,enumerable:!0},applyDiff:{value:function(e,t,n){e&&t&&s(e,t,function(r){n&&!n(e,t,r)||p(e,t,r)})},enumerable:!0},applyChange:{value:p,enumerable:!0},revertChange:{value:function(e,t,n){if(e&&t&&n&&n.kind){var r,o,i=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===i[n.path[r]]&&(i[n.path[r]]={}),i=i[n.path[r]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],u=r.path.length-1;for(o=0;o<u;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":case"E":i[r.path[o]]=r.lhs;break;case"N":delete i[r.path[o]]}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":case"E":t[n]=r.lhs;break;case"N":t=l(t,n)}return t}(i[n.path[r]],n.index,n.item);break;case"D":case"E":i[n.path[r]]=n.lhs;break;case"N":delete i[n.path[r]]}}},enumerable:!0},isConflict:{value:function(){return void 0!==b},enumerable:!0},noConflict:{value:function(){return S&&(S.forEach(function(e){e()}),S=null),f},enumerable:!0}});var x={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},k={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},C=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?y()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=k,t.createLogger=y,t.logger=C,t.default=C,Object.defineProperty(t,"__esModule",{value:!0})}(t)}).call(this,n(7))},function(e,t,n){"use strict";
/** @license React v16.6.0
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(14),o="function"==typeof Symbol&&Symbol.for,i=o?Symbol.for("react.element"):60103,u=o?Symbol.for("react.portal"):60106,a=o?Symbol.for("react.fragment"):60107,l=o?Symbol.for("react.strict_mode"):60108,c=o?Symbol.for("react.profiler"):60114,s=o?Symbol.for("react.provider"):60109,f=o?Symbol.for("react.context"):60110,p=o?Symbol.for("react.concurrent_mode"):60111,d=o?Symbol.for("react.forward_ref"):60112,h=o?Symbol.for("react.suspense"):60113,m=o?Symbol.for("react.memo"):60115,y=o?Symbol.for("react.lazy"):60116,v="function"==typeof Symbol&&Symbol.iterator;function b(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);!function(e,t,n,r,o,i,u,a){if(!e){if(e=void 0,void 0===t)e=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,o,i,u,a],c=0;(e=Error(t.replace(/%s/g,function(){return l[c++]}))).name="Invariant Violation"}throw e.framesToPop=1,e}}(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w={};function _(e,t,n){this.props=e,this.context=t,this.refs=w,this.updater=n||g}function E(){}function O(e,t,n){this.props=e,this.context=t,this.refs=w,this.updater=n||g}_.prototype.isReactComponent={},_.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&b("85"),this.updater.enqueueSetState(this,e,t,"setState")},_.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},E.prototype=_.prototype;var S=O.prototype=new E;S.constructor=O,r(S,_.prototype),S.isPureReactComponent=!0;var x={current:null,currentDispatcher:null},k=Object.prototype.hasOwnProperty,C={key:!0,ref:!0,__self:!0,__source:!0};function P(e,t,n){var r=void 0,o={},u=null,a=null;if(null!=t)for(r in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(u=""+t.key),t)k.call(t,r)&&!C.hasOwnProperty(r)&&(o[r]=t[r]);var l=arguments.length-2;if(1===l)o.children=n;else if(1<l){for(var c=Array(l),s=0;s<l;s++)c[s]=arguments[s+2];o.children=c}if(e&&e.defaultProps)for(r in l=e.defaultProps)void 0===o[r]&&(o[r]=l[r]);return{$$typeof:i,type:e,key:u,ref:a,props:o,_owner:x.current}}function T(e){return"object"==typeof e&&null!==e&&e.$$typeof===i}var j=/\/+/g,N=[];function R(e,t,n,r){if(N.length){var o=N.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function D(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>N.length&&N.push(e)}function I(e,t,n){return null==e?0:function e(t,n,r,o){var a=typeof t;"undefined"!==a&&"boolean"!==a||(t=null);var l=!1;if(null===t)l=!0;else switch(a){case"string":case"number":l=!0;break;case"object":switch(t.$$typeof){case i:case u:l=!0}}if(l)return r(o,t,""===n?"."+A(t,0):n),1;if(l=0,n=""===n?".":n+":",Array.isArray(t))for(var c=0;c<t.length;c++){var s=n+A(a=t[c],c);l+=e(a,s,r,o)}else if(s=null===t||"object"!=typeof t?null:"function"==typeof(s=v&&t[v]||t["@@iterator"])?s:null,"function"==typeof s)for(t=s.call(t),c=0;!(a=t.next()).done;)l+=e(a=a.value,s=n+A(a,c++),r,o);else"object"===a&&b("31","[object Object]"==(r=""+t)?"object with keys {"+Object.keys(t).join(", ")+"}":r,"");return l}(e,"",t,n)}function A(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}(e.key):t.toString(36)}function U(e,t){e.func.call(e.context,t,e.count++)}function M(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?F(e,r,n,function(e){return e}):null!=e&&(T(e)&&(e=function(e,t){return{$$typeof:i,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(j,"$&/")+"/")+n)),r.push(e))}function F(e,t,n,r,o){var i="";null!=n&&(i=(""+n).replace(j,"$&/")+"/"),I(e,M,t=R(t,i,r,o)),D(t)}var L={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return F(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;I(e,U,t=R(null,null,t,n)),D(t)},count:function(e){return I(e,function(){return null},null)},toArray:function(e){var t=[];return F(e,t,null,function(e){return e}),t},only:function(e){return T(e)||b("143"),e}},createRef:function(){return{current:null}},Component:_,PureComponent:O,createContext:function(e,t){return void 0===t&&(t=null),(e={$$typeof:f,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,Provider:null,Consumer:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:d,render:e}},lazy:function(e){return{$$typeof:y,_ctor:e,_status:-1,_result:null}},memo:function(e,t){return{$$typeof:m,type:e,compare:void 0===t?null:t}},Fragment:a,StrictMode:l,unstable_ConcurrentMode:p,Suspense:h,unstable_Profiler:c,createElement:P,cloneElement:function(e,t,n){(null===e||void 0===e)&&b("267",e);var o=void 0,u=r({},e.props),a=e.key,l=e.ref,c=e._owner;if(null!=t){void 0!==t.ref&&(l=t.ref,c=x.current),void 0!==t.key&&(a=""+t.key);var s=void 0;for(o in e.type&&e.type.defaultProps&&(s=e.type.defaultProps),t)k.call(t,o)&&!C.hasOwnProperty(o)&&(u[o]=void 0===t[o]&&void 0!==s?s[o]:t[o])}if(1===(o=arguments.length-2))u.children=n;else if(1<o){s=Array(o);for(var f=0;f<o;f++)s[f]=arguments[f+2];u.children=s}return{$$typeof:i,type:e.type,key:a,ref:l,props:u,_owner:c}},createFactory:function(e){var t=P.bind(null,e);return t.type=e,t},isValidElement:T,version:"16.6.0",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:x,assign:r}},z={default:L},W=z&&L||z;e.exports=W.default||W},function(e,t,n){"use strict";
/** @license React v16.6.0
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(0),o=n(14),i=n(27);function u(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);!function(e,t,n,r,o,i,u,a){if(!e){if(e=void 0,void 0===t)e=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,o,i,u,a],c=0;(e=Error(t.replace(/%s/g,function(){return l[c++]}))).name="Invariant Violation"}throw e.framesToPop=1,e}}(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}r||u("227");var a=!1,l=null,c=!1,s=null,f={onError:function(e){a=!0,l=e}};function p(e,t,n,r,o,i,u,c,s){a=!1,l=null,function(e,t,n,r,o,i,u,a,l){var c=Array.prototype.slice.call(arguments,3);try{t.apply(n,c)}catch(e){this.onError(e)}}.apply(f,arguments)}var d=null,h={};function m(){if(d)for(var e in h){var t=h[e],n=d.indexOf(e);if(-1<n||u("96",e),!v[n])for(var r in t.extractEvents||u("97",e),v[n]=t,n=t.eventTypes){var o=void 0,i=n[r],a=t,l=r;b.hasOwnProperty(l)&&u("99",l),b[l]=i;var c=i.phasedRegistrationNames;if(c){for(o in c)c.hasOwnProperty(o)&&y(c[o],a,l);o=!0}else i.registrationName?(y(i.registrationName,a,l),o=!0):o=!1;o||u("98",r,e)}}}function y(e,t,n){g[e]&&u("100",e),g[e]=t,w[e]=t.eventTypes[n].dependencies}var v=[],b={},g={},w={},_=null,E=null,O=null;function S(e,t,n,r){t=e.type||"unknown-event",e.currentTarget=O(r),function(e,t,n,r,o,i,f,d,h){if(p.apply(this,arguments),a){if(a){var m=l;a=!1,l=null}else u("198"),m=void 0;c||(c=!0,s=m)}}(t,n,void 0,e),e.currentTarget=null}function x(e,t){return null==t&&u("30"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function k(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}var C=null;function P(e,t){if(e){var n=e._dispatchListeners,r=e._dispatchInstances;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)S(e,t,n[o],r[o]);else n&&S(e,t,n,r);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function T(e){return P(e,!0)}function j(e){return P(e,!1)}var N={injectEventPluginOrder:function(e){d&&u("101"),d=Array.prototype.slice.call(e),m()},injectEventPluginsByName:function(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var r=e[t];h.hasOwnProperty(t)&&h[t]===r||(h[t]&&u("102",t),h[t]=r,n=!0)}n&&m()}};function R(e,t){var n=e.stateNode;if(!n)return null;var r=_(n);if(!r)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(r=!r.disabled)||(r=!("button"===(e=e.type)||"input"===e||"select"===e||"textarea"===e)),e=!r;break e;default:e=!1}return e?null:(n&&"function"!=typeof n&&u("231",t,typeof n),n)}function D(e,t){if(null!==e&&(C=x(C,e)),e=C,C=null,e&&(k(e,t?T:j),C&&u("95"),c))throw t=s,c=!1,s=null,t}var I=Math.random().toString(36).slice(2),A="__reactInternalInstance$"+I,U="__reactEventHandlers$"+I;function M(e){if(e[A])return e[A];for(;!e[A];){if(!e.parentNode)return null;e=e.parentNode}return 5===(e=e[A]).tag||6===e.tag?e:null}function F(e){return!(e=e[A])||5!==e.tag&&6!==e.tag?null:e}function L(e){if(5===e.tag||6===e.tag)return e.stateNode;u("33")}function z(e){return e[U]||null}function W(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function B(e,t,n){(t=R(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=x(n._dispatchListeners,t),n._dispatchInstances=x(n._dispatchInstances,e))}function $(e){if(e&&e.dispatchConfig.phasedRegistrationNames){for(var t=e._targetInst,n=[];t;)n.push(t),t=W(t);for(t=n.length;0<t--;)B(n[t],"captured",e);for(t=0;t<n.length;t++)B(n[t],"bubbled",e)}}function V(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=R(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=x(n._dispatchListeners,t),n._dispatchInstances=x(n._dispatchInstances,e))}function H(e){e&&e.dispatchConfig.registrationName&&V(e._targetInst,null,e)}function q(e){k(e,$)}var K=!("undefined"==typeof window||!window.document||!window.document.createElement);function Y(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Q={animationend:Y("Animation","AnimationEnd"),animationiteration:Y("Animation","AnimationIteration"),animationstart:Y("Animation","AnimationStart"),transitionend:Y("Transition","TransitionEnd")},G={},X={};function Z(e){if(G[e])return G[e];if(!Q[e])return e;var t,n=Q[e];for(t in n)if(n.hasOwnProperty(t)&&t in X)return G[e]=n[t];return e}K&&(X=document.createElement("div").style,"AnimationEvent"in window||(delete Q.animationend.animation,delete Q.animationiteration.animation,delete Q.animationstart.animation),"TransitionEvent"in window||delete Q.transitionend.transition);var J=Z("animationend"),ee=Z("animationiteration"),te=Z("animationstart"),ne=Z("transitionend"),re="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),oe=null,ie=null,ue=null;function ae(){if(ue)return ue;var e,t,n=ie,r=n.length,o="value"in oe?oe.value:oe.textContent,i=o.length;for(e=0;e<r&&n[e]===o[e];e++);var u=r-e;for(t=1;t<=u&&n[r-t]===o[i-t];t++);return ue=o.slice(e,1<t?1-t:void 0)}function le(){return!0}function ce(){return!1}function se(e,t,n,r){for(var o in this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?le:ce,this.isPropagationStopped=ce,this}function fe(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function pe(e){e instanceof this||u("279"),e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function de(e){e.eventPool=[],e.getPooled=fe,e.release=pe}o(se.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=le)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=le)},persist:function(){this.isPersistent=le},isPersistent:ce,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null,this.isPropagationStopped=this.isDefaultPrevented=ce,this._dispatchInstances=this._dispatchListeners=null}}),se.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null},se.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var i=new t;return o(i,n.prototype),n.prototype=i,n.prototype.constructor=n,n.Interface=o({},r.Interface,e),n.extend=r.extend,de(n),n},de(se);var he=se.extend({data:null}),me=se.extend({data:null}),ye=[9,13,27,32],ve=K&&"CompositionEvent"in window,be=null;K&&"documentMode"in document&&(be=document.documentMode);var ge=K&&"TextEvent"in window&&!be,we=K&&(!ve||be&&8<be&&11>=be),_e=String.fromCharCode(32),Ee={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},Oe=!1;function Se(e,t){switch(e){case"keyup":return-1!==ye.indexOf(t.keyCode);case"keydown":return 229!==t.keyCode;case"keypress":case"mousedown":case"blur":return!0;default:return!1}}function xe(e){return"object"==typeof(e=e.detail)&&"data"in e?e.data:null}var ke=!1;var Ce={eventTypes:Ee,extractEvents:function(e,t,n,r){var o=void 0,i=void 0;if(ve)e:{switch(e){case"compositionstart":o=Ee.compositionStart;break e;case"compositionend":o=Ee.compositionEnd;break e;case"compositionupdate":o=Ee.compositionUpdate;break e}o=void 0}else ke?Se(e,n)&&(o=Ee.compositionEnd):"keydown"===e&&229===n.keyCode&&(o=Ee.compositionStart);return o?(we&&"ko"!==n.locale&&(ke||o!==Ee.compositionStart?o===Ee.compositionEnd&&ke&&(i=ae()):(ie="value"in(oe=r)?oe.value:oe.textContent,ke=!0)),o=he.getPooled(o,t,n,r),i?o.data=i:null!==(i=xe(n))&&(o.data=i),q(o),i=o):i=null,(e=ge?function(e,t){switch(e){case"compositionend":return xe(t);case"keypress":return 32!==t.which?null:(Oe=!0,_e);case"textInput":return(e=t.data)===_e&&Oe?null:e;default:return null}}(e,n):function(e,t){if(ke)return"compositionend"===e||!ve&&Se(e,t)?(e=ae(),ue=ie=oe=null,ke=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return we&&"ko"!==t.locale?null:t.data;default:return null}}(e,n))?((t=me.getPooled(Ee.beforeInput,t,n,r)).data=e,q(t)):t=null,null===i?t:null===t?i:[i,t]}},Pe=null,Te=null,je=null;function Ne(e){if(e=E(e)){"function"!=typeof Pe&&u("280");var t=_(e.stateNode);Pe(e.stateNode,e.type,t)}}function Re(e){Te?je?je.push(e):je=[e]:Te=e}function De(){if(Te){var e=Te,t=je;if(je=Te=null,Ne(e),t)for(e=0;e<t.length;e++)Ne(t[e])}}function Ie(e,t){return e(t)}function Ae(e,t,n){return e(t,n)}function Ue(){}var Me=!1;function Fe(e,t){if(Me)return e(t);Me=!0;try{return Ie(e,t)}finally{Me=!1,(null!==Te||null!==je)&&(Ue(),De())}}var Le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ze(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!Le[e.type]:"textarea"===t}function We(e){return(e=e.target||e.srcElement||window).correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function Be(e){if(!K)return!1;var t=(e="on"+e)in document;return t||((t=document.createElement("div")).setAttribute(e,"return;"),t="function"==typeof t[e]),t}function $e(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function Ve(e){e._valueTracker||(e._valueTracker=function(e){var t=$e(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&void 0!==n&&"function"==typeof n.get&&"function"==typeof n.set){var o=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(e){r=""+e,i.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}(e))}function He(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=$e(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}var qe=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ke=/^(.*)[\\\/]/,Ye="function"==typeof Symbol&&Symbol.for,Qe=Ye?Symbol.for("react.element"):60103,Ge=Ye?Symbol.for("react.portal"):60106,Xe=Ye?Symbol.for("react.fragment"):60107,Ze=Ye?Symbol.for("react.strict_mode"):60108,Je=Ye?Symbol.for("react.profiler"):60114,et=Ye?Symbol.for("react.provider"):60109,tt=Ye?Symbol.for("react.context"):60110,nt=Ye?Symbol.for("react.concurrent_mode"):60111,rt=Ye?Symbol.for("react.forward_ref"):60112,ot=Ye?Symbol.for("react.suspense"):60113,it=Ye?Symbol.for("react.memo"):60115,ut=Ye?Symbol.for("react.lazy"):60116,at="function"==typeof Symbol&&Symbol.iterator;function lt(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=at&&e[at]||e["@@iterator"])?e:null}function ct(e){if(null==e)return null;if("function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case nt:return"ConcurrentMode";case Xe:return"Fragment";case Ge:return"Portal";case Je:return"Profiler";case Ze:return"StrictMode";case ot:return"Suspense"}if("object"==typeof e)switch(e.$$typeof){case tt:return"Context.Consumer";case et:return"Context.Provider";case rt:var t=e.render;return t=t.displayName||t.name||"",e.displayName||(""!==t?"ForwardRef("+t+")":"ForwardRef");case it:return ct(e.type);case ut:if(e=1===e._status?e._result:null)return ct(e)}return null}function st(e){var t="";do{e:switch(e.tag){case 2:case 16:case 0:case 1:case 5:case 8:var n=e._debugOwner,r=e._debugSource,o=ct(e.type),i=null;n&&(i=ct(n.type)),n=o,o="",r?o=" (at "+r.fileName.replace(Ke,"")+":"+r.lineNumber+")":i&&(o=" (created by "+i+")"),i="\n    in "+(n||"Unknown")+o;break e;default:i=""}t+=i,e=e.return}while(e);return t}var ft=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,pt=Object.prototype.hasOwnProperty,dt={},ht={};function mt(e,t,n,r,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t}var yt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){yt[e]=new mt(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];yt[t]=new mt(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){yt[e]=new mt(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){yt[e]=new mt(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){yt[e]=new mt(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){yt[e]=new mt(e,3,!0,e,null)}),["capture","download"].forEach(function(e){yt[e]=new mt(e,4,!1,e,null)}),["cols","rows","size","span"].forEach(function(e){yt[e]=new mt(e,6,!1,e,null)}),["rowSpan","start"].forEach(function(e){yt[e]=new mt(e,5,!1,e.toLowerCase(),null)});var vt=/[\-:]([a-z])/g;function bt(e){return e[1].toUpperCase()}function gt(e,t,n,r){var o=yt.hasOwnProperty(t)?yt[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(function(e,t,n,r){if(null===t||void 0===t||function(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,n,r))return!0;if(r)return!1;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}(t,n,o,r)&&(n=null),r||null===o?function(e){return!!pt.call(ht,e)||!pt.call(dt,e)&&(ft.test(e)?ht[e]=!0:(dt[e]=!0,!1))}(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(n=3===(o=o.type)||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function wt(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}function _t(e,t){var n=t.checked;return o({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function Et(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=wt(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function Ot(e,t){null!=(t=t.checked)&&gt(e,"checked",t,!1)}function St(e,t){Ot(e,t);var n=wt(t.value),r=t.type;if(null!=n)"number"===r?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if("submit"===r||"reset"===r)return void e.removeAttribute("value");t.hasOwnProperty("value")?kt(e,t.type,n):t.hasOwnProperty("defaultValue")&&kt(e,t.type,wt(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function xt(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!("submit"!==r&&"reset"!==r||void 0!==t.value&&null!==t.value))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}""!==(n=e.name)&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!!e._wrapperState.initialChecked,""!==n&&(e.name=n)}function kt(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(vt,bt);yt[t]=new mt(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(vt,bt);yt[t]=new mt(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(vt,bt);yt[t]=new mt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),yt.tabIndex=new mt("tabIndex",1,!1,"tabindex",null);var Ct={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Pt(e,t,n){return(e=se.getPooled(Ct.change,e,t,n)).type="change",Re(n),q(e),e}var Tt=null,jt=null;function Nt(e){D(e,!1)}function Rt(e){if(He(L(e)))return e}function Dt(e,t){if("change"===e)return t}var It=!1;function At(){Tt&&(Tt.detachEvent("onpropertychange",Ut),jt=Tt=null)}function Ut(e){"value"===e.propertyName&&Rt(jt)&&Fe(Nt,e=Pt(jt,e,We(e)))}function Mt(e,t,n){"focus"===e?(At(),jt=n,(Tt=t).attachEvent("onpropertychange",Ut)):"blur"===e&&At()}function Ft(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return Rt(jt)}function Lt(e,t){if("click"===e)return Rt(t)}function zt(e,t){if("input"===e||"change"===e)return Rt(t)}K&&(It=Be("input")&&(!document.documentMode||9<document.documentMode));var Wt={eventTypes:Ct,_isInputEventSupported:It,extractEvents:function(e,t,n,r){var o=t?L(t):window,i=void 0,u=void 0,a=o.nodeName&&o.nodeName.toLowerCase();if("select"===a||"input"===a&&"file"===o.type?i=Dt:ze(o)?It?i=zt:(i=Ft,u=Mt):(a=o.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===o.type||"radio"===o.type)&&(i=Lt),i&&(i=i(e,t)))return Pt(i,n,r);u&&u(e,o,t),"blur"===e&&(e=o._wrapperState)&&e.controlled&&"number"===o.type&&kt(o,"number",o.value)}},Bt=se.extend({view:null,detail:null}),$t={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Vt(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=$t[e])&&!!t[e]}function Ht(){return Vt}var qt=0,Kt=0,Yt=!1,Qt=!1,Gt=Bt.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Ht,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},movementX:function(e){if("movementX"in e)return e.movementX;var t=qt;return qt=e.screenX,Yt?"mousemove"===e.type?e.screenX-t:0:(Yt=!0,0)},movementY:function(e){if("movementY"in e)return e.movementY;var t=Kt;return Kt=e.screenY,Qt?"mousemove"===e.type?e.screenY-t:0:(Qt=!0,0)}}),Xt=Gt.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),Zt={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},Jt={eventTypes:Zt,extractEvents:function(e,t,n,r){var o="mouseover"===e||"pointerover"===e,i="mouseout"===e||"pointerout"===e;if(o&&(n.relatedTarget||n.fromElement)||!i&&!o)return null;if(o=r.window===r?r:(o=r.ownerDocument)?o.defaultView||o.parentWindow:window,i?(i=t,t=(t=n.relatedTarget||n.toElement)?M(t):null):i=null,i===t)return null;var u=void 0,a=void 0,l=void 0,c=void 0;"mouseout"===e||"mouseover"===e?(u=Gt,a=Zt.mouseLeave,l=Zt.mouseEnter,c="mouse"):"pointerout"!==e&&"pointerover"!==e||(u=Xt,a=Zt.pointerLeave,l=Zt.pointerEnter,c="pointer");var s=null==i?o:L(i);if(o=null==t?o:L(t),(e=u.getPooled(a,i,n,r)).type=c+"leave",e.target=s,e.relatedTarget=o,(n=u.getPooled(l,t,n,r)).type=c+"enter",n.target=o,n.relatedTarget=s,r=t,i&&r)e:{for(o=r,c=0,u=t=i;u;u=W(u))c++;for(u=0,l=o;l;l=W(l))u++;for(;0<c-u;)t=W(t),c--;for(;0<u-c;)o=W(o),u--;for(;c--;){if(t===o||t===o.alternate)break e;t=W(t),o=W(o)}t=null}else t=null;for(o=t,t=[];i&&i!==o&&(null===(c=i.alternate)||c!==o);)t.push(i),i=W(i);for(i=[];r&&r!==o&&(null===(c=r.alternate)||c!==o);)i.push(r),r=W(r);for(r=0;r<t.length;r++)V(t[r],"bubbled",e);for(r=i.length;0<r--;)V(i[r],"captured",n);return[e,n]}},en=Object.prototype.hasOwnProperty;function tn(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function nn(e,t){if(tn(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++)if(!en.call(t,n[r])||!tn(e[n[r]],t[n[r]]))return!1;return!0}function rn(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!=(2&t.effectTag))return 1;for(;t.return;)if(0!=(2&(t=t.return).effectTag))return 1}return 3===t.tag?2:3}function on(e){2!==rn(e)&&u("188")}function un(e){if(!(e=function(e){var t=e.alternate;if(!t)return 3===(t=rn(e))&&u("188"),1===t?null:e;for(var n=e,r=t;;){var o=n.return,i=o?o.alternate:null;if(!o||!i)break;if(o.child===i.child){for(var a=o.child;a;){if(a===n)return on(o),e;if(a===r)return on(o),t;a=a.sibling}u("188")}if(n.return!==r.return)n=o,r=i;else{a=!1;for(var l=o.child;l;){if(l===n){a=!0,n=o,r=i;break}if(l===r){a=!0,r=o,n=i;break}l=l.sibling}if(!a){for(l=i.child;l;){if(l===n){a=!0,n=i,r=o;break}if(l===r){a=!0,r=i,n=o;break}l=l.sibling}a||u("189")}}n.alternate!==r&&u("190")}return 3!==n.tag&&u("188"),n.stateNode.current===n?e:t}(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}var an=se.extend({animationName:null,elapsedTime:null,pseudoElement:null}),ln=se.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),cn=Bt.extend({relatedTarget:null});function sn(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}var fn={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},pn={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},dn=Bt.extend({key:function(e){if(e.key){var t=fn[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?13===(e=sn(e))?"Enter":String.fromCharCode(e):"keydown"===e.type||"keyup"===e.type?pn[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Ht,charCode:function(e){return"keypress"===e.type?sn(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?sn(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),hn=Gt.extend({dataTransfer:null}),mn=Bt.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Ht}),yn=se.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),vn=Gt.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),bn=[["abort","abort"],[J,"animationEnd"],[ee,"animationIteration"],[te,"animationStart"],["canplay","canPlay"],["canplaythrough","canPlayThrough"],["drag","drag"],["dragenter","dragEnter"],["dragexit","dragExit"],["dragleave","dragLeave"],["dragover","dragOver"],["durationchange","durationChange"],["emptied","emptied"],["encrypted","encrypted"],["ended","ended"],["error","error"],["gotpointercapture","gotPointerCapture"],["load","load"],["loadeddata","loadedData"],["loadedmetadata","loadedMetadata"],["loadstart","loadStart"],["lostpointercapture","lostPointerCapture"],["mousemove","mouseMove"],["mouseout","mouseOut"],["mouseover","mouseOver"],["playing","playing"],["pointermove","pointerMove"],["pointerout","pointerOut"],["pointerover","pointerOver"],["progress","progress"],["scroll","scroll"],["seeking","seeking"],["stalled","stalled"],["suspend","suspend"],["timeupdate","timeUpdate"],["toggle","toggle"],["touchmove","touchMove"],[ne,"transitionEnd"],["waiting","waiting"],["wheel","wheel"]],gn={},wn={};function _n(e,t){var n=e[0],r="on"+((e=e[1])[0].toUpperCase()+e.slice(1));t={phasedRegistrationNames:{bubbled:r,captured:r+"Capture"},dependencies:[n],isInteractive:t},gn[e]=t,wn[n]=t}[["blur","blur"],["cancel","cancel"],["click","click"],["close","close"],["contextmenu","contextMenu"],["copy","copy"],["cut","cut"],["auxclick","auxClick"],["dblclick","doubleClick"],["dragend","dragEnd"],["dragstart","dragStart"],["drop","drop"],["focus","focus"],["input","input"],["invalid","invalid"],["keydown","keyDown"],["keypress","keyPress"],["keyup","keyUp"],["mousedown","mouseDown"],["mouseup","mouseUp"],["paste","paste"],["pause","pause"],["play","play"],["pointercancel","pointerCancel"],["pointerdown","pointerDown"],["pointerup","pointerUp"],["ratechange","rateChange"],["reset","reset"],["seeked","seeked"],["submit","submit"],["touchcancel","touchCancel"],["touchend","touchEnd"],["touchstart","touchStart"],["volumechange","volumeChange"]].forEach(function(e){_n(e,!0)}),bn.forEach(function(e){_n(e,!1)});var En={eventTypes:gn,isInteractiveTopLevelEventType:function(e){return void 0!==(e=wn[e])&&!0===e.isInteractive},extractEvents:function(e,t,n,r){var o=wn[e];if(!o)return null;switch(e){case"keypress":if(0===sn(n))return null;case"keydown":case"keyup":e=dn;break;case"blur":case"focus":e=cn;break;case"click":if(2===n.button)return null;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":e=Gt;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":e=hn;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":e=mn;break;case J:case ee:case te:e=an;break;case ne:e=yn;break;case"scroll":e=Bt;break;case"wheel":e=vn;break;case"copy":case"cut":case"paste":e=ln;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":e=Xt;break;default:e=se}return q(t=e.getPooled(o,t,n,r)),t}},On=En.isInteractiveTopLevelEventType,Sn=[];function xn(e){var t=e.targetInst,n=t;do{if(!n){e.ancestors.push(n);break}var r;for(r=n;r.return;)r=r.return;if(!(r=3!==r.tag?null:r.stateNode.containerInfo))break;e.ancestors.push(n),n=M(r)}while(n);for(n=0;n<e.ancestors.length;n++){t=e.ancestors[n];var o=We(e.nativeEvent);r=e.topLevelType;for(var i=e.nativeEvent,u=null,a=0;a<v.length;a++){var l=v[a];l&&(l=l.extractEvents(r,t,i,o))&&(u=x(u,l))}D(u,!1)}}var kn=!0;function Cn(e,t){if(!t)return null;var n=(On(e)?Tn:jn).bind(null,e);t.addEventListener(e,n,!1)}function Pn(e,t){if(!t)return null;var n=(On(e)?Tn:jn).bind(null,e);t.addEventListener(e,n,!0)}function Tn(e,t){Ae(jn,e,t)}function jn(e,t){if(kn){var n=We(t);if(null===(n=M(n))||"number"!=typeof n.tag||2===rn(n)||(n=null),Sn.length){var r=Sn.pop();r.topLevelType=e,r.nativeEvent=t,r.targetInst=n,e=r}else e={topLevelType:e,nativeEvent:t,targetInst:n,ancestors:[]};try{Fe(xn,e)}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>Sn.length&&Sn.push(e)}}}var Nn={},Rn=0,Dn="_reactListenersID"+(""+Math.random()).slice(2);function In(e){return Object.prototype.hasOwnProperty.call(e,Dn)||(e[Dn]=Rn++,Nn[e[Dn]]={}),Nn[e[Dn]]}function An(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}function Un(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Mn(e,t){var n,r=Un(e);for(e=0;r;){if(3===r.nodeType){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Un(r)}}function Fn(){for(var e=window,t=An();t instanceof e.HTMLIFrameElement;){try{e=t.contentDocument.defaultView}catch(e){break}t=An(e.document)}return t}function Ln(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&("text"===e.type||"search"===e.type||"tel"===e.type||"url"===e.type||"password"===e.type)||"textarea"===t||"true"===e.contentEditable)}var zn=K&&"documentMode"in document&&11>=document.documentMode,Wn={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Bn=null,$n=null,Vn=null,Hn=!1;function qn(e,t){var n=t.window===t?t.document:9===t.nodeType?t:t.ownerDocument;return Hn||null==Bn||Bn!==An(n)?null:("selectionStart"in(n=Bn)&&Ln(n)?n={start:n.selectionStart,end:n.selectionEnd}:n={anchorNode:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection()).anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset},Vn&&nn(Vn,n)?null:(Vn=n,(e=se.getPooled(Wn.select,$n,e,t)).type="select",e.target=Bn,q(e),e))}var Kn={eventTypes:Wn,extractEvents:function(e,t,n,r){var o,i=r.window===r?r.document:9===r.nodeType?r:r.ownerDocument;if(!(o=!i)){e:{i=In(i),o=w.onSelect;for(var u=0;u<o.length;u++){var a=o[u];if(!i.hasOwnProperty(a)||!i[a]){i=!1;break e}}i=!0}o=!i}if(o)return null;switch(i=t?L(t):window,e){case"focus":(ze(i)||"true"===i.contentEditable)&&(Bn=i,$n=t,Vn=null);break;case"blur":Vn=$n=Bn=null;break;case"mousedown":Hn=!0;break;case"contextmenu":case"mouseup":case"dragend":return Hn=!1,qn(n,r);case"selectionchange":if(zn)break;case"keydown":case"keyup":return qn(n,r)}return null}};function Yn(e,t){return e=o({children:void 0},t),(t=function(e){var t="";return r.Children.forEach(e,function(e){null!=e&&(t+=e)}),t}(t.children))&&(e.children=t),e}function Qn(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+wt(n),t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function Gn(e,t){return null!=t.dangerouslySetInnerHTML&&u("91"),o({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Xn(e,t){var n=t.value;null==n&&(n=t.defaultValue,null!=(t=t.children)&&(null!=n&&u("92"),Array.isArray(t)&&(1>=t.length||u("93"),t=t[0]),n=t),null==n&&(n="")),e._wrapperState={initialValue:wt(n)}}function Zn(e,t){var n=wt(t.value),r=wt(t.defaultValue);null!=n&&((n=""+n)!==e.value&&(e.value=n),null==t.defaultValue&&e.defaultValue!==n&&(e.defaultValue=n)),null!=r&&(e.defaultValue=""+r)}function Jn(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}N.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),_=z,E=F,O=L,N.injectEventPluginsByName({SimpleEventPlugin:En,EnterLeaveEventPlugin:Jt,ChangeEventPlugin:Wt,SelectEventPlugin:Kn,BeforeInputEventPlugin:Ce});var er={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function tr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function nr(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?tr(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}var rr=void 0,or=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n)})}:e}(function(e,t){if(e.namespaceURI!==er.svg||"innerHTML"in e)e.innerHTML=t;else{for((rr=rr||document.createElement("div")).innerHTML="<svg>"+t+"</svg>",t=rr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ir(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}var ur={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ar=["Webkit","ms","Moz","O"];function lr(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=n,i=t[n];o=null==i||"boolean"==typeof i||""===i?"":r||"number"!=typeof i||0===i||ur.hasOwnProperty(o)&&ur[o]?(""+i).trim():i+"px","float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}Object.keys(ur).forEach(function(e){ar.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),ur[t]=ur[e]})});var cr=o({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function sr(e,t){t&&(cr[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&u("137",e,""),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&u("60"),"object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML||u("61")),null!=t.style&&"object"!=typeof t.style&&u("62",""))}function fr(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function pr(e,t){var n=In(e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument);t=w[t];for(var r=0;r<t.length;r++){var o=t[r];if(!n.hasOwnProperty(o)||!n[o]){switch(o){case"scroll":Pn("scroll",e);break;case"focus":case"blur":Pn("focus",e),Pn("blur",e),n.blur=!0,n.focus=!0;break;case"cancel":case"close":Be(o)&&Pn(o,e);break;case"invalid":case"submit":case"reset":break;default:-1===re.indexOf(o)&&Cn(o,e)}n[o]=!0}}}function dr(){}var hr=null,mr=null;function yr(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function vr(e,t){return"textarea"===e||"option"===e||"noscript"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&null!=t.dangerouslySetInnerHTML.__html}var br=setTimeout,gr=clearTimeout;function wr(e){for(e=e.nextSibling;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}function _r(e){for(e=e.firstChild;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}new Set;var Er=[],Or=-1;function Sr(e){0>Or||(e.current=Er[Or],Er[Or]=null,Or--)}function xr(e,t){Er[++Or]=e.current,e.current=t}var kr={},Cr={current:kr},Pr={current:!1},Tr=kr;function jr(e,t){var n=e.type.contextTypes;if(!n)return kr;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o,i={};for(o in n)i[o]=t[o];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function Nr(e){return null!==(e=e.childContextTypes)&&void 0!==e}function Rr(e){Sr(Pr),Sr(Cr)}function Dr(e){Sr(Pr),Sr(Cr)}function Ir(e,t,n){Cr.current!==kr&&u("168"),xr(Cr,t),xr(Pr,n)}function Ar(e,t,n){var r=e.stateNode;if(e=t.childContextTypes,"function"!=typeof r.getChildContext)return n;for(var i in r=r.getChildContext())i in e||u("108",ct(t)||"Unknown",i);return o({},n,r)}function Ur(e){var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||kr,Tr=Cr.current,xr(Cr,t),xr(Pr,Pr.current),!0}function Mr(e,t,n){var r=e.stateNode;r||u("169"),n?(t=Ar(e,t,Tr),r.__reactInternalMemoizedMergedChildContext=t,Sr(Pr),Sr(Cr),xr(Cr,t)):Sr(Pr),xr(Pr,n)}var Fr=null,Lr=null;function zr(e){return function(t){try{return e(t)}catch(e){}}}function Wr(e,t,n,r){return new function(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.firstContextDependency=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.childExpirationTime=this.expirationTime=0,this.alternate=null}(e,t,n,r)}function Br(e){return!(!(e=e.prototype)||!e.isReactComponent)}function $r(e,t){var n=e.alternate;return null===n?((n=Wr(e.tag,t,e.key,e.mode)).elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.effectTag=0,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.childExpirationTime=e.childExpirationTime,n.expirationTime=e.expirationTime,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,n.firstContextDependency=e.firstContextDependency,n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Vr(e,t,n,r,o,i){var a=2;if(r=e,"function"==typeof e)Br(e)&&(a=1);else if("string"==typeof e)a=5;else e:switch(e){case Xe:return Hr(n.children,o,i,t);case nt:return qr(n,3|o,i,t);case Ze:return qr(n,2|o,i,t);case Je:return(e=Wr(12,n,t,4|o)).elementType=Je,e.type=Je,e.expirationTime=i,e;case ot:return(e=Wr(13,n,t,o)).elementType=ot,e.type=ot,e.expirationTime=i,e;default:if("object"==typeof e&&null!==e)switch(e.$$typeof){case et:a=10;break e;case tt:a=9;break e;case rt:a=11;break e;case it:a=14;break e;case ut:a=16,r=null;break e}u("130",null==e?e:typeof e,"")}return(t=Wr(a,n,t,o)).elementType=e,t.type=r,t.expirationTime=i,t}function Hr(e,t,n,r){return(e=Wr(7,e,r,t)).expirationTime=n,e}function qr(e,t,n,r){return e=Wr(8,e,r,t),t=0==(1&t)?Ze:nt,e.elementType=t,e.type=t,e.expirationTime=n,e}function Kr(e,t,n){return(e=Wr(6,e,null,t)).expirationTime=n,e}function Yr(e,t,n){return(t=Wr(4,null!==e.children?e.children:[],e.key,t)).expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Qr(e,t){e.didError=!1;var n=e.earliestPendingTime;0===n?e.earliestPendingTime=e.latestPendingTime=t:n>t?e.earliestPendingTime=t:e.latestPendingTime<t&&(e.latestPendingTime=t),Zr(t,e)}function Gr(e,t){e.didError=!1;var n=e.latestPingedTime;0!==n&&n<=t&&(e.latestPingedTime=0),n=e.earliestPendingTime;var r=e.latestPendingTime;n===t?e.earliestPendingTime=r===t?e.latestPendingTime=0:r:r===t&&(e.latestPendingTime=n),n=e.earliestSuspendedTime,r=e.latestSuspendedTime,0===n?e.earliestSuspendedTime=e.latestSuspendedTime=t:n>t?e.earliestSuspendedTime=t:r<t&&(e.latestSuspendedTime=t),Zr(t,e)}function Xr(e,t){var n=e.earliestPendingTime;return e=e.earliestSuspendedTime,(0===t||0!==n&&n<t)&&(t=n),(0===t||0!==e&&e<t)&&(t=e),t}function Zr(e,t){var n=t.earliestSuspendedTime,r=t.latestSuspendedTime,o=t.earliestPendingTime,i=t.latestPingedTime;0===(o=0!==o?o:i)&&(0===e||r>e)&&(o=r),0!==(e=o)&&0!==n&&n<e&&(e=n),t.nextExpirationTimeToWorkOn=o,t.expirationTime=e}var Jr=!1;function eo(e){return{baseState:e,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function to(e){return{baseState:e.baseState,firstUpdate:e.firstUpdate,lastUpdate:e.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function no(e){return{expirationTime:e,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function ro(e,t){null===e.lastUpdate?e.firstUpdate=e.lastUpdate=t:(e.lastUpdate.next=t,e.lastUpdate=t)}function oo(e,t){var n=e.alternate;if(null===n){var r=e.updateQueue,o=null;null===r&&(r=e.updateQueue=eo(e.memoizedState))}else r=e.updateQueue,o=n.updateQueue,null===r?null===o?(r=e.updateQueue=eo(e.memoizedState),o=n.updateQueue=eo(n.memoizedState)):r=e.updateQueue=to(o):null===o&&(o=n.updateQueue=to(r));null===o||r===o?ro(r,t):null===r.lastUpdate||null===o.lastUpdate?(ro(r,t),ro(o,t)):(ro(r,t),o.lastUpdate=t)}function io(e,t){var n=e.updateQueue;null===(n=null===n?e.updateQueue=eo(e.memoizedState):uo(e,n)).lastCapturedUpdate?n.firstCapturedUpdate=n.lastCapturedUpdate=t:(n.lastCapturedUpdate.next=t,n.lastCapturedUpdate=t)}function uo(e,t){var n=e.alternate;return null!==n&&t===n.updateQueue&&(t=e.updateQueue=to(t)),t}function ao(e,t,n,r,i,u){switch(n.tag){case 1:return"function"==typeof(e=n.payload)?e.call(u,r,i):e;case 3:e.effectTag=-1025&e.effectTag|64;case 0:if(null===(i="function"==typeof(e=n.payload)?e.call(u,r,i):e)||void 0===i)break;return o({},r,i);case 2:Jr=!0}return r}function lo(e,t,n,r,o){Jr=!1;for(var i=(t=uo(e,t)).baseState,u=null,a=0,l=t.firstUpdate,c=i;null!==l;){var s=l.expirationTime;s>o?(null===u&&(u=l,i=c),(0===a||a>s)&&(a=s)):(c=ao(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastEffect?t.firstEffect=t.lastEffect=l:(t.lastEffect.nextEffect=l,t.lastEffect=l))),l=l.next}for(s=null,l=t.firstCapturedUpdate;null!==l;){var f=l.expirationTime;f>o?(null===s&&(s=l,null===u&&(i=c)),(0===a||a>f)&&(a=f)):(c=ao(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastCapturedEffect?t.firstCapturedEffect=t.lastCapturedEffect=l:(t.lastCapturedEffect.nextEffect=l,t.lastCapturedEffect=l))),l=l.next}null===u&&(t.lastUpdate=null),null===s?t.lastCapturedUpdate=null:e.effectTag|=32,null===u&&null===s&&(i=c),t.baseState=i,t.firstUpdate=u,t.firstCapturedUpdate=s,e.expirationTime=a,e.memoizedState=c}function co(e,t,n){null!==t.firstCapturedUpdate&&(null!==t.lastUpdate&&(t.lastUpdate.next=t.firstCapturedUpdate,t.lastUpdate=t.lastCapturedUpdate),t.firstCapturedUpdate=t.lastCapturedUpdate=null),so(t.firstEffect,n),t.firstEffect=t.lastEffect=null,so(t.firstCapturedEffect,n),t.firstCapturedEffect=t.lastCapturedEffect=null}function so(e,t){for(;null!==e;){var n=e.callback;if(null!==n){e.callback=null;var r=t;"function"!=typeof n&&u("191",n),n.call(r)}e=e.nextEffect}}function fo(e,t){return{value:e,source:t,stack:st(t)}}var po={current:null},ho=null,mo=null,yo=null;function vo(e,t){var n=e.type._context;xr(po,n._currentValue),n._currentValue=t}function bo(e){var t=po.current;Sr(po),e.type._context._currentValue=t}function go(e){ho=e,yo=mo=null,e.firstContextDependency=null}function wo(e,t){return yo!==e&&!1!==t&&0!==t&&("number"==typeof t&&1073741823!==t||(yo=e,t=1073741823),t={context:e,observedBits:t,next:null},null===mo?(null===ho&&u("293"),ho.firstContextDependency=mo=t):mo=mo.next=t),e._currentValue}var _o={},Eo={current:_o},Oo={current:_o},So={current:_o};function xo(e){return e===_o&&u("174"),e}function ko(e,t){xr(So,t),xr(Oo,e),xr(Eo,_o);var n=t.nodeType;switch(n){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:nr(null,"");break;default:t=nr(t=(n=8===n?t.parentNode:t).namespaceURI||null,n=n.tagName)}Sr(Eo),xr(Eo,t)}function Co(e){Sr(Eo),Sr(Oo),Sr(So)}function Po(e){xo(So.current);var t=xo(Eo.current),n=nr(t,e.type);t!==n&&(xr(Oo,e),xr(Eo,n))}function To(e){Oo.current===e&&(Sr(Eo),Sr(Oo))}var jo=qe.ReactCurrentOwner,No=(new r.Component).refs;function Ro(e,t,n,r){n=null===(n=n(r,t=e.memoizedState))||void 0===n?t:o({},t,n),e.memoizedState=n,null!==(r=e.updateQueue)&&0===e.expirationTime&&(r.baseState=n)}var Do={isMounted:function(e){return!!(e=e._reactInternalFiber)&&2===rn(e)},enqueueSetState:function(e,t,n){e=e._reactInternalFiber;var r=Ou(),o=no(r=qi(r,e));o.payload=t,void 0!==n&&null!==n&&(o.callback=n),oo(e,o),Qi(e,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternalFiber;var r=Ou(),o=no(r=qi(r,e));o.tag=1,o.payload=t,void 0!==n&&null!==n&&(o.callback=n),oo(e,o),Qi(e,r)},enqueueForceUpdate:function(e,t){e=e._reactInternalFiber;var n=Ou(),r=no(n=qi(n,e));r.tag=2,void 0!==t&&null!==t&&(r.callback=t),oo(e,r),Qi(e,n)}};function Io(e,t,n,r,o,i,u){return"function"==typeof(e=e.stateNode).shouldComponentUpdate?e.shouldComponentUpdate(r,i,u):!t.prototype||!t.prototype.isPureReactComponent||(!nn(n,r)||!nn(o,i))}function Ao(e,t,n){var r=!1,o=kr,i=t.contextType;return"object"==typeof i&&null!==i?i=jo.currentDispatcher.readContext(i):(o=Nr(t)?Tr:Cr.current,i=(r=null!==(r=t.contextTypes)&&void 0!==r)?jr(e,o):kr),t=new t(n,i),e.memoizedState=null!==t.state&&void 0!==t.state?t.state:null,t.updater=Do,e.stateNode=t,t._reactInternalFiber=e,r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=i),t}function Uo(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Do.enqueueReplaceState(t,t.state,null)}function Mo(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs=No;var i=t.contextType;"object"==typeof i&&null!==i?o.context=jo.currentDispatcher.readContext(i):(i=Nr(t)?Tr:Cr.current,o.context=jr(e,i)),null!==(i=e.updateQueue)&&(lo(e,i,n,o,r),o.state=e.memoizedState),"function"==typeof(i=t.getDerivedStateFromProps)&&(Ro(e,t,i,n),o.state=e.memoizedState),"function"==typeof t.getDerivedStateFromProps||"function"==typeof o.getSnapshotBeforeUpdate||"function"!=typeof o.UNSAFE_componentWillMount&&"function"!=typeof o.componentWillMount||(t=o.state,"function"==typeof o.componentWillMount&&o.componentWillMount(),"function"==typeof o.UNSAFE_componentWillMount&&o.UNSAFE_componentWillMount(),t!==o.state&&Do.enqueueReplaceState(o,o.state,null),null!==(i=e.updateQueue)&&(lo(e,i,n,o,r),o.state=e.memoizedState)),"function"==typeof o.componentDidMount&&(e.effectTag|=4)}var Fo=Array.isArray;function Lo(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){var r=void 0;(n=n._owner)&&(1!==n.tag&&u("289"),r=n.stateNode),r||u("147",e);var o=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===o?t.ref:((t=function(e){var t=r.refs;t===No&&(t=r.refs={}),null===e?delete t[o]:t[o]=e})._stringRef=o,t)}"string"!=typeof e&&u("284"),n._owner||u("290",e)}return e}function zo(e,t){"textarea"!==e.type&&u("31","[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function Wo(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t,n){return(e=$r(e,t)).index=0,e.sibling=null,e}function i(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.effectTag=2,n):r:(t.effectTag=2,n):n}function a(t){return e&&null===t.alternate&&(t.effectTag=2),t}function l(e,t,n,r){return null===t||6!==t.tag?((t=Kr(n,e.mode,r)).return=e,t):((t=o(t,n)).return=e,t)}function c(e,t,n,r){return null!==t&&t.elementType===n.type?((r=o(t,n.props)).ref=Lo(e,t,n),r.return=e,r):((r=Vr(n.type,n.key,n.props,null,e.mode,r)).ref=Lo(e,t,n),r.return=e,r)}function s(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=Yr(n,e.mode,r)).return=e,t):((t=o(t,n.children||[])).return=e,t)}function f(e,t,n,r,i){return null===t||7!==t.tag?((t=Hr(n,e.mode,r,i)).return=e,t):((t=o(t,n)).return=e,t)}function p(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=Kr(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case Qe:return(n=Vr(t.type,t.key,t.props,null,e.mode,n)).ref=Lo(e,null,t),n.return=e,n;case Ge:return(t=Yr(t,e.mode,n)).return=e,t}if(Fo(t)||lt(t))return(t=Hr(t,e.mode,n,null)).return=e,t;zo(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:l(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case Qe:return n.key===o?n.type===Xe?f(e,t,n.props.children,r,o):c(e,t,n,r):null;case Ge:return n.key===o?s(e,t,n,r):null}if(Fo(n)||lt(n))return null!==o?null:f(e,t,n,r,null);zo(e,n)}return null}function h(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return l(t,e=e.get(n)||null,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case Qe:return e=e.get(null===r.key?n:r.key)||null,r.type===Xe?f(t,e,r.props.children,o,r.key):c(t,e,r,o);case Ge:return s(t,e=e.get(null===r.key?n:r.key)||null,r,o)}if(Fo(r)||lt(r))return f(t,e=e.get(n)||null,r,o,null);zo(t,r)}return null}function m(o,u,a,l){for(var c=null,s=null,f=u,m=u=0,y=null;null!==f&&m<a.length;m++){f.index>m?(y=f,f=null):y=f.sibling;var v=d(o,f,a[m],l);if(null===v){null===f&&(f=y);break}e&&f&&null===v.alternate&&t(o,f),u=i(v,u,m),null===s?c=v:s.sibling=v,s=v,f=y}if(m===a.length)return n(o,f),c;if(null===f){for(;m<a.length;m++)(f=p(o,a[m],l))&&(u=i(f,u,m),null===s?c=f:s.sibling=f,s=f);return c}for(f=r(o,f);m<a.length;m++)(y=h(f,o,m,a[m],l))&&(e&&null!==y.alternate&&f.delete(null===y.key?m:y.key),u=i(y,u,m),null===s?c=y:s.sibling=y,s=y);return e&&f.forEach(function(e){return t(o,e)}),c}function y(o,a,l,c){var s=lt(l);"function"!=typeof s&&u("150"),null==(l=s.call(l))&&u("151");for(var f=s=null,m=a,y=a=0,v=null,b=l.next();null!==m&&!b.done;y++,b=l.next()){m.index>y?(v=m,m=null):v=m.sibling;var g=d(o,m,b.value,c);if(null===g){m||(m=v);break}e&&m&&null===g.alternate&&t(o,m),a=i(g,a,y),null===f?s=g:f.sibling=g,f=g,m=v}if(b.done)return n(o,m),s;if(null===m){for(;!b.done;y++,b=l.next())null!==(b=p(o,b.value,c))&&(a=i(b,a,y),null===f?s=b:f.sibling=b,f=b);return s}for(m=r(o,m);!b.done;y++,b=l.next())null!==(b=h(m,o,y,b.value,c))&&(e&&null!==b.alternate&&m.delete(null===b.key?y:b.key),a=i(b,a,y),null===f?s=b:f.sibling=b,f=b);return e&&m.forEach(function(e){return t(o,e)}),s}return function(e,r,i,l){var c="object"==typeof i&&null!==i&&i.type===Xe&&null===i.key;c&&(i=i.props.children);var s="object"==typeof i&&null!==i;if(s)switch(i.$$typeof){case Qe:e:{for(s=i.key,c=r;null!==c;){if(c.key===s){if(7===c.tag?i.type===Xe:c.elementType===i.type){n(e,c.sibling),(r=o(c,i.type===Xe?i.props.children:i.props)).ref=Lo(e,c,i),r.return=e,e=r;break e}n(e,c);break}t(e,c),c=c.sibling}i.type===Xe?((r=Hr(i.props.children,e.mode,l,i.key)).return=e,e=r):((l=Vr(i.type,i.key,i.props,null,e.mode,l)).ref=Lo(e,r,i),l.return=e,e=l)}return a(e);case Ge:e:{for(c=i.key;null!==r;){if(r.key===c){if(4===r.tag&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),(r=o(r,i.children||[])).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=Yr(i,e.mode,l)).return=e,e=r}return a(e)}if("string"==typeof i||"number"==typeof i)return i=""+i,null!==r&&6===r.tag?(n(e,r.sibling),(r=o(r,i)).return=e,e=r):(n(e,r),(r=Kr(i,e.mode,l)).return=e,e=r),a(e);if(Fo(i))return m(e,r,i,l);if(lt(i))return y(e,r,i,l);if(s&&zo(e,i),void 0===i&&!c)switch(e.tag){case 1:case 0:u("152",(l=e.type).displayName||l.name||"Component")}return n(e,r)}}var Bo=Wo(!0),$o=Wo(!1),Vo=null,Ho=null,qo=!1;function Ko(e,t){var n=Wr(5,null,null,0);n.elementType="DELETED",n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function Yo(e,t){switch(e.tag){case 5:var n=e.type;return null!==(t=1!==t.nodeType||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t)&&(e.stateNode=t,!0);case 6:return null!==(t=""===e.pendingProps||3!==t.nodeType?null:t)&&(e.stateNode=t,!0);default:return!1}}function Qo(e){if(qo){var t=Ho;if(t){var n=t;if(!Yo(e,t)){if(!(t=wr(n))||!Yo(e,t))return e.effectTag|=2,qo=!1,void(Vo=e);Ko(Vo,n)}Vo=e,Ho=_r(t)}else e.effectTag|=2,qo=!1,Vo=e}}function Go(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag;)e=e.return;Vo=e}function Xo(e){if(e!==Vo)return!1;if(!qo)return Go(e),qo=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!vr(t,e.memoizedProps))for(t=Ho;t;)Ko(e,t),t=wr(t);return Go(e),Ho=Vo?wr(e.stateNode):null,!0}function Zo(){Ho=Vo=null,qo=!1}var Jo=qe.ReactCurrentOwner;function ei(e,t,n,r){t.child=null===e?$o(t,null,n,r):Bo(t,e.child,n,r)}function ti(e,t,n,r,o){n=n.render;var i=t.ref;return Pr.current||t.memoizedProps!==r||i!==(null!==e?e.ref:null)?(ei(e,t,r=n(r,i),o),t.child):fi(e,t,o)}function ni(e,t,n,r,o,i){if(null===e){var u=n.type;return"function"!=typeof u||Br(u)||void 0!==u.defaultProps||null!==n.compare?((e=Vr(n.type,null,r,null,t.mode,i)).ref=t.ref,e.return=t,t.child=e):(t.tag=15,t.type=u,ri(e,t,u,r,o,i))}return u=e.child,(0===o||o>i)&&(o=u.memoizedProps,(n=null!==(n=n.compare)?n:nn)(o,r)&&e.ref===t.ref)?fi(e,t,i):((e=$r(u,r)).ref=t.ref,e.return=t,t.child=e)}function ri(e,t,n,r,o,i){return null!==e&&(0===o||o>i)&&nn(e.memoizedProps,r)&&e.ref===t.ref?fi(e,t,i):ii(e,t,n,r,i)}function oi(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function ii(e,t,n,r,o){var i=Nr(n)?Tr:Cr.current;return i=jr(t,i),go(t),n=n(r,i),t.effectTag|=1,ei(e,t,n,o),t.child}function ui(e,t,n,r,o){if(Nr(n)){var i=!0;Ur(t)}else i=!1;if(go(t),null===t.stateNode)null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),Ao(t,n,r),Mo(t,n,r,o),r=!0;else if(null===e){var u=t.stateNode,a=t.memoizedProps;u.props=a;var l=u.context,c=n.contextType;"object"==typeof c&&null!==c?c=jo.currentDispatcher.readContext(c):c=jr(t,c=Nr(n)?Tr:Cr.current);var s=n.getDerivedStateFromProps,f="function"==typeof s||"function"==typeof u.getSnapshotBeforeUpdate;f||"function"!=typeof u.UNSAFE_componentWillReceiveProps&&"function"!=typeof u.componentWillReceiveProps||(a!==r||l!==c)&&Uo(t,u,r,c),Jr=!1;var p=t.memoizedState;l=u.state=p;var d=t.updateQueue;null!==d&&(lo(t,d,r,u,o),l=t.memoizedState),a!==r||p!==l||Pr.current||Jr?("function"==typeof s&&(Ro(t,n,s,r),l=t.memoizedState),(a=Jr||Io(t,n,a,r,p,l,c))?(f||"function"!=typeof u.UNSAFE_componentWillMount&&"function"!=typeof u.componentWillMount||("function"==typeof u.componentWillMount&&u.componentWillMount(),"function"==typeof u.UNSAFE_componentWillMount&&u.UNSAFE_componentWillMount()),"function"==typeof u.componentDidMount&&(t.effectTag|=4)):("function"==typeof u.componentDidMount&&(t.effectTag|=4),t.memoizedProps=r,t.memoizedState=l),u.props=r,u.state=l,u.context=c,r=a):("function"==typeof u.componentDidMount&&(t.effectTag|=4),r=!1)}else u=t.stateNode,a=t.memoizedProps,u.props=a,l=u.context,"object"==typeof(c=n.contextType)&&null!==c?c=jo.currentDispatcher.readContext(c):c=jr(t,c=Nr(n)?Tr:Cr.current),(f="function"==typeof(s=n.getDerivedStateFromProps)||"function"==typeof u.getSnapshotBeforeUpdate)||"function"!=typeof u.UNSAFE_componentWillReceiveProps&&"function"!=typeof u.componentWillReceiveProps||(a!==r||l!==c)&&Uo(t,u,r,c),Jr=!1,l=t.memoizedState,p=u.state=l,null!==(d=t.updateQueue)&&(lo(t,d,r,u,o),p=t.memoizedState),a!==r||l!==p||Pr.current||Jr?("function"==typeof s&&(Ro(t,n,s,r),p=t.memoizedState),(s=Jr||Io(t,n,a,r,l,p,c))?(f||"function"!=typeof u.UNSAFE_componentWillUpdate&&"function"!=typeof u.componentWillUpdate||("function"==typeof u.componentWillUpdate&&u.componentWillUpdate(r,p,c),"function"==typeof u.UNSAFE_componentWillUpdate&&u.UNSAFE_componentWillUpdate(r,p,c)),"function"==typeof u.componentDidUpdate&&(t.effectTag|=4),"function"==typeof u.getSnapshotBeforeUpdate&&(t.effectTag|=256)):("function"!=typeof u.componentDidUpdate||a===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof u.getSnapshotBeforeUpdate||a===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),t.memoizedProps=r,t.memoizedState=p),u.props=r,u.state=p,u.context=c,r=s):("function"!=typeof u.componentDidUpdate||a===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof u.getSnapshotBeforeUpdate||a===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),r=!1);return ai(e,t,n,r,i,o)}function ai(e,t,n,r,o,i){oi(e,t);var u=0!=(64&t.effectTag);if(!r&&!u)return o&&Mr(t,n,!1),fi(e,t,i);r=t.stateNode,Jo.current=t;var a=u&&"function"!=typeof n.getDerivedStateFromError?null:r.render();return t.effectTag|=1,null!==e&&u?(t.child=Bo(t,e.child,null,i),t.child=Bo(t,null,a,i)):ei(e,t,a,i),t.memoizedState=r.state,o&&Mr(t,n,!0),t.child}function li(e){var t=e.stateNode;t.pendingContext?Ir(0,t.pendingContext,t.pendingContext!==t.context):t.context&&Ir(0,t.context,!1),ko(e,t.containerInfo)}function ci(e,t){if(e&&e.defaultProps)for(var n in t=o({},t),e=e.defaultProps)void 0===t[n]&&(t[n]=e[n]);return t}function si(e,t,n){var r=t.mode,o=t.pendingProps,i=t.memoizedState;null!==i&&(i.alreadyCaptured?null!==e&&i===e.memoizedState?i={alreadyCaptured:!0,didTimeout:!0,timedOutAt:i.timedOutAt}:(i.alreadyCaptured=!0,i.didTimeout=!0):i=null);var u=null!==i&&i.didTimeout;if(null===e)u?(u=o.fallback,o=Hr(null,r,0,null),r=Hr(u,r,n,null),o.sibling=r,(n=o).return=r.return=t):n=r=$o(t,null,o.children,n);else{var a=e.memoizedState;null!==a&&a.didTimeout?(e=(r=e.child).sibling,u?(n=o.fallback,(r=$r(r,r.pendingProps)).effectTag|=2,(o=r.sibling=$r(e,n,e.expirationTime)).effectTag|=2,n=r,r.childExpirationTime=0,r=o,n.return=r.return=t):(u=e.child,r=Bo(t,r.child,o.children,n),Bo(t,u,null,n),n=r)):(e=e.child,u?(u=o.fallback,(o=Hr(null,r,0,null)).effectTag|=2,o.child=e,e.return=o,(r=o.sibling=Hr(u,r,n,null)).effectTag|=2,n=o,o.childExpirationTime=0,n.return=r.return=t):r=n=Bo(t,e,o.children,n))}return t.memoizedState=i,t.child=n,r}function fi(e,t,n){null!==e&&(t.firstContextDependency=e.firstContextDependency);var r=t.childExpirationTime;if(0===r||r>n)return null;if(null!==e&&t.child!==e.child&&u("153"),null!==t.child){for(n=$r(e=t.child,e.pendingProps,e.expirationTime),t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=$r(e,e.pendingProps,e.expirationTime)).return=t;n.sibling=null}return t.child}function pi(e,t,n){var r=t.expirationTime;if(null!==e&&e.memoizedProps===t.pendingProps&&!Pr.current&&(0===r||r>n)){switch(t.tag){case 3:li(t),Zo();break;case 5:Po(t);break;case 1:Nr(t.type)&&Ur(t);break;case 4:ko(t,t.stateNode.containerInfo);break;case 10:vo(t,t.memoizedProps.value);break;case 13:if(null!==(r=t.memoizedState)&&r.didTimeout)return 0!==(r=t.child.childExpirationTime)&&r<=n?si(e,t,n):null!==(t=fi(e,t,n))?t.sibling:null}return fi(e,t,n)}switch(t.expirationTime=0,t.tag){case 2:r=t.elementType,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),e=t.pendingProps;var o=jr(t,Cr.current);if(go(t),o=r(e,o),t.effectTag|=1,"object"==typeof o&&null!==o&&"function"==typeof o.render&&void 0===o.$$typeof){if(t.tag=1,Nr(r)){var i=!0;Ur(t)}else i=!1;t.memoizedState=null!==o.state&&void 0!==o.state?o.state:null;var a=r.getDerivedStateFromProps;"function"==typeof a&&Ro(t,r,a,e),o.updater=Do,t.stateNode=o,o._reactInternalFiber=t,Mo(t,r,e,n),t=ai(null,t,r,!0,i,n)}else t.tag=0,ei(null,t,o,n),t=t.child;return t;case 16:switch(o=t.elementType,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),i=t.pendingProps,e=function(e){var t=e._result;switch(e._status){case 1:return t;case 2:case 0:throw t;default:throw e._status=0,(t=(t=e._ctor)()).then(function(t){0===e._status&&(t=t.default,e._status=1,e._result=t)},function(t){0===e._status&&(e._status=2,e._result=t)}),e._result=t,t}}(o),t.type=e,o=t.tag=function(e){if("function"==typeof e)return Br(e)?1:0;if(void 0!==e&&null!==e){if((e=e.$$typeof)===rt)return 11;if(e===it)return 14}return 2}(e),i=ci(e,i),a=void 0,o){case 0:a=ii(null,t,e,i,n);break;case 1:a=ui(null,t,e,i,n);break;case 11:a=ti(null,t,e,i,n);break;case 14:a=ni(null,t,e,ci(e.type,i),r,n);break;default:u("283",e)}return a;case 0:return r=t.type,o=t.pendingProps,ii(e,t,r,o=t.elementType===r?o:ci(r,o),n);case 1:return r=t.type,o=t.pendingProps,ui(e,t,r,o=t.elementType===r?o:ci(r,o),n);case 3:return li(t),null===(r=t.updateQueue)&&u("282"),o=null!==(o=t.memoizedState)?o.element:null,lo(t,r,t.pendingProps,null,n),(r=t.memoizedState.element)===o?(Zo(),t=fi(e,t,n)):(o=t.stateNode,(o=(null===e||null===e.child)&&o.hydrate)&&(Ho=_r(t.stateNode.containerInfo),Vo=t,o=qo=!0),o?(t.effectTag|=2,t.child=$o(t,null,r,n)):(ei(e,t,r,n),Zo()),t=t.child),t;case 5:return Po(t),null===e&&Qo(t),r=t.type,o=t.pendingProps,i=null!==e?e.memoizedProps:null,a=o.children,vr(r,o)?a=null:null!==i&&vr(r,i)&&(t.effectTag|=16),oi(e,t),1073741823!==n&&1&t.mode&&o.hidden?(t.expirationTime=1073741823,t=null):(ei(e,t,a,n),t=t.child),t;case 6:return null===e&&Qo(t),null;case 13:return si(e,t,n);case 4:return ko(t,t.stateNode.containerInfo),r=t.pendingProps,null===e?t.child=Bo(t,null,r,n):ei(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,ti(e,t,r,o=t.elementType===r?o:ci(r,o),n);case 7:return ei(e,t,t.pendingProps,n),t.child;case 8:case 12:return ei(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,a=t.memoizedProps,vo(t,i=o.value),null!==a){var l=a.value;if(0===(i=l===i&&(0!==l||1/l==1/i)||l!=l&&i!=i?0:0|("function"==typeof r._calculateChangedBits?r._calculateChangedBits(l,i):1073741823))){if(a.children===o.children&&!Pr.current){t=fi(e,t,n);break e}}else for(null!==(a=t.child)&&(a.return=t);null!==a;){if(null!==(l=a.firstContextDependency))do{if(l.context===r&&0!=(l.observedBits&i)){if(1===a.tag){var c=no(n);c.tag=2,oo(a,c)}(0===a.expirationTime||a.expirationTime>n)&&(a.expirationTime=n),null!==(c=a.alternate)&&(0===c.expirationTime||c.expirationTime>n)&&(c.expirationTime=n);for(var s=a.return;null!==s;){if(c=s.alternate,0===s.childExpirationTime||s.childExpirationTime>n)s.childExpirationTime=n,null!==c&&(0===c.childExpirationTime||c.childExpirationTime>n)&&(c.childExpirationTime=n);else{if(null===c||!(0===c.childExpirationTime||c.childExpirationTime>n))break;c.childExpirationTime=n}s=s.return}}c=a.child,l=l.next}while(null!==l);else c=10===a.tag&&a.type===t.type?null:a.child;if(null!==c)c.return=a;else for(c=a;null!==c;){if(c===t){c=null;break}if(null!==(a=c.sibling)){a.return=c.return,c=a;break}c=c.return}a=c}}ei(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=(i=t.pendingProps).children,go(t),r=r(o=wo(o,i.unstable_observedBits)),t.effectTag|=1,ei(e,t,r,n),t.child;case 14:return ni(e,t,o=t.type,i=ci(o.type,t.pendingProps),r,n);case 15:return ri(e,t,t.type,t.pendingProps,r,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:ci(r,o),null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),t.tag=1,Nr(r)?(e=!0,Ur(t)):e=!1,go(t),Ao(t,r,o),Mo(t,r,o,n),ai(null,t,r,!0,e,n);default:u("156")}}function di(e){e.effectTag|=4}var hi=void 0,mi=void 0,yi=void 0,vi=void 0;function bi(e,t){var n=t.source,r=t.stack;null===r&&null!==n&&(r=st(n)),null!==n&&ct(n.type),t=t.value,null!==e&&1===e.tag&&ct(e.type);try{console.error(t)}catch(e){setTimeout(function(){throw e})}}function gi(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){Hi(e,t)}else t.current=null}function wi(e){switch("function"==typeof Lr&&Lr(e),e.tag){case 1:gi(e);var t=e.stateNode;if("function"==typeof t.componentWillUnmount)try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(t){Hi(e,t)}break;case 5:gi(e);break;case 4:Oi(e)}}function _i(e){return 5===e.tag||3===e.tag||4===e.tag}function Ei(e){e:{for(var t=e.return;null!==t;){if(_i(t)){var n=t;break e}t=t.return}u("160"),n=void 0}var r=t=void 0;switch(n.tag){case 5:t=n.stateNode,r=!1;break;case 3:case 4:t=n.stateNode.containerInfo,r=!0;break;default:u("161")}16&n.effectTag&&(ir(t,""),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||_i(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}for(var o=e;;){if(5===o.tag||6===o.tag)if(n)if(r){var i=t,a=o.stateNode,l=n;8===i.nodeType?i.parentNode.insertBefore(a,l):i.insertBefore(a,l)}else t.insertBefore(o.stateNode,n);else r?(a=t,l=o.stateNode,8===a.nodeType?(i=a.parentNode).insertBefore(l,a):(i=a).appendChild(l),null!==(a=a._reactRootContainer)&&void 0!==a||null!==i.onclick||(i.onclick=dr)):t.appendChild(o.stateNode);else if(4!==o.tag&&null!==o.child){o.child.return=o,o=o.child;continue}if(o===e)break;for(;null===o.sibling;){if(null===o.return||o.return===e)return;o=o.return}o.sibling.return=o.return,o=o.sibling}}function Oi(e){for(var t=e,n=!1,r=void 0,o=void 0;;){if(!n){n=t.return;e:for(;;){switch(null===n&&u("160"),n.tag){case 5:r=n.stateNode,o=!1;break e;case 3:case 4:r=n.stateNode.containerInfo,o=!0;break e}n=n.return}n=!0}if(5===t.tag||6===t.tag){e:for(var i=t,a=i;;)if(wi(a),null!==a.child&&4!==a.tag)a.child.return=a,a=a.child;else{if(a===i)break;for(;null===a.sibling;){if(null===a.return||a.return===i)break e;a=a.return}a.sibling.return=a.return,a=a.sibling}o?(i=r,a=t.stateNode,8===i.nodeType?i.parentNode.removeChild(a):i.removeChild(a)):r.removeChild(t.stateNode)}else if(4===t.tag?(r=t.stateNode.containerInfo,o=!0):wi(t),null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;4===(t=t.return).tag&&(n=!1)}t.sibling.return=t.return,t=t.sibling}}function Si(e,t){switch(t.tag){case 1:break;case 5:var n=t.stateNode;if(null!=n){var r=t.memoizedProps,o=null!==e?e.memoizedProps:r;e=t.type;var i=t.updateQueue;if(t.updateQueue=null,null!==i){for(n[U]=r,"input"===e&&"radio"===r.type&&null!=r.name&&Ot(n,r),fr(e,o),t=fr(e,r),o=0;o<i.length;o+=2){var a=i[o],l=i[o+1];"style"===a?lr(n,l):"dangerouslySetInnerHTML"===a?or(n,l):"children"===a?ir(n,l):gt(n,a,l,t)}switch(e){case"input":St(n,r);break;case"textarea":Zn(n,r);break;case"select":e=n._wrapperState.wasMultiple,n._wrapperState.wasMultiple=!!r.multiple,null!=(i=r.value)?Qn(n,!!r.multiple,i,!1):e!==!!r.multiple&&(null!=r.defaultValue?Qn(n,!!r.multiple,r.defaultValue,!0):Qn(n,!!r.multiple,r.multiple?[]:"",!1))}}}break;case 6:null===t.stateNode&&u("162"),t.stateNode.nodeValue=t.memoizedProps;break;case 3:case 12:case 13:case 17:break;default:u("163")}}function xi(e,t,n){(n=no(n)).tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ru(r),bi(e,t)},n}function ki(e,t,n){(n=no(n)).tag=3;var r=e.type.getDerivedStateFromError;if("function"==typeof r){var o=t.value;n.payload=function(){return r(o)}}var i=e.stateNode;return null!==i&&"function"==typeof i.componentDidCatch&&(n.callback=function(){"function"!=typeof r&&(null===zi?zi=new Set([this]):zi.add(this));var n=t.value,o=t.stack;bi(e,t),this.componentDidCatch(n,{componentStack:null!==o?o:""})}),n}function Ci(e){switch(e.tag){case 1:Nr(e.type)&&Rr();var t=e.effectTag;return 1024&t?(e.effectTag=-1025&t|64,e):null;case 3:return Co(),Dr(),0!=(64&(t=e.effectTag))&&u("285"),e.effectTag=-1025&t|64,e;case 5:return To(e),null;case 13:if(1024&(t=e.effectTag)){e.effectTag=-1025&t|64,t=null!==(t=e.alternate)?t.memoizedState:null;var n=e.memoizedState;return null===n?n={alreadyCaptured:!0,didTimeout:!1,timedOutAt:0}:t===n?n={alreadyCaptured:!0,didTimeout:n.didTimeout,timedOutAt:n.timedOutAt}:n.alreadyCaptured=!0,e.memoizedState=n,e}return null;case 4:return Co(),null;case 10:return bo(e),null;default:return null}}hi=function(e,t){for(var n=t.child;null!==n;){if(5===n.tag||6===n.tag)e.appendChild(n.stateNode);else if(4!==n.tag&&null!==n.child){n.child.return=n,n=n.child;continue}if(n===t)break;for(;null===n.sibling;){if(null===n.return||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},mi=function(){},yi=function(e,t,n,r,i){var u=e.memoizedProps;if(u!==r){var a=t.stateNode;switch(xo(Eo.current),e=null,n){case"input":u=_t(a,u),r=_t(a,r),e=[];break;case"option":u=Yn(a,u),r=Yn(a,r),e=[];break;case"select":u=o({},u,{value:void 0}),r=o({},r,{value:void 0}),e=[];break;case"textarea":u=Gn(a,u),r=Gn(a,r),e=[];break;default:"function"!=typeof u.onClick&&"function"==typeof r.onClick&&(a.onclick=dr)}sr(n,r),a=n=void 0;var l=null;for(n in u)if(!r.hasOwnProperty(n)&&u.hasOwnProperty(n)&&null!=u[n])if("style"===n){var c=u[n];for(a in c)c.hasOwnProperty(a)&&(l||(l={}),l[a]="")}else"dangerouslySetInnerHTML"!==n&&"children"!==n&&"suppressContentEditableWarning"!==n&&"suppressHydrationWarning"!==n&&"autoFocus"!==n&&(g.hasOwnProperty(n)?e||(e=[]):(e=e||[]).push(n,null));for(n in r){var s=r[n];if(c=null!=u?u[n]:void 0,r.hasOwnProperty(n)&&s!==c&&(null!=s||null!=c))if("style"===n)if(c){for(a in c)!c.hasOwnProperty(a)||s&&s.hasOwnProperty(a)||(l||(l={}),l[a]="");for(a in s)s.hasOwnProperty(a)&&c[a]!==s[a]&&(l||(l={}),l[a]=s[a])}else l||(e||(e=[]),e.push(n,l)),l=s;else"dangerouslySetInnerHTML"===n?(s=s?s.__html:void 0,c=c?c.__html:void 0,null!=s&&c!==s&&(e=e||[]).push(n,""+s)):"children"===n?c===s||"string"!=typeof s&&"number"!=typeof s||(e=e||[]).push(n,""+s):"suppressContentEditableWarning"!==n&&"suppressHydrationWarning"!==n&&(g.hasOwnProperty(n)?(null!=s&&pr(i,n),e||c===s||(e=[])):(e=e||[]).push(n,s))}l&&(e=e||[]).push("style",l),i=e,(t.updateQueue=i)&&di(t)}},vi=function(e,t,n,r){n!==r&&di(t)};var Pi={readContext:wo},Ti=qe.ReactCurrentOwner,ji=0,Ni=0,Ri=!1,Di=null,Ii=null,Ai=0,Ui=-1,Mi=!1,Fi=null,Li=!1,zi=null;function Wi(){if(null!==Di)for(var e=Di.return;null!==e;){var t=e;switch(t.tag){case 1:var n=t.type.childContextTypes;null!==n&&void 0!==n&&Rr();break;case 3:Co(),Dr();break;case 5:To(t);break;case 4:Co();break;case 10:bo(t)}e=e.return}Ii=null,Ai=0,Ui=-1,Mi=!1,Di=null}function Bi(e){for(;;){var t=e.alternate,n=e.return,r=e.sibling;if(0==(512&e.effectTag)){var i=t,a=(t=e).pendingProps;switch(t.tag){case 2:case 16:break;case 15:case 0:break;case 1:Nr(t.type)&&Rr();break;case 3:Co(),Dr(),(a=t.stateNode).pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),null!==i&&null!==i.child||(Xo(t),t.effectTag&=-3),mi(t);break;case 5:To(t);var l=xo(So.current),c=t.type;if(null!==i&&null!=t.stateNode)yi(i,t,c,a,l),i.ref!==t.ref&&(t.effectTag|=128);else if(a){var s=xo(Eo.current);if(Xo(t)){i=(a=t).stateNode;var f=a.type,p=a.memoizedProps,d=l;switch(i[A]=a,i[U]=p,c=void 0,l=f){case"iframe":case"object":Cn("load",i);break;case"video":case"audio":for(f=0;f<re.length;f++)Cn(re[f],i);break;case"source":Cn("error",i);break;case"img":case"image":case"link":Cn("error",i),Cn("load",i);break;case"form":Cn("reset",i),Cn("submit",i);break;case"details":Cn("toggle",i);break;case"input":Et(i,p),Cn("invalid",i),pr(d,"onChange");break;case"select":i._wrapperState={wasMultiple:!!p.multiple},Cn("invalid",i),pr(d,"onChange");break;case"textarea":Xn(i,p),Cn("invalid",i),pr(d,"onChange")}for(c in sr(l,p),f=null,p)p.hasOwnProperty(c)&&(s=p[c],"children"===c?"string"==typeof s?i.textContent!==s&&(f=["children",s]):"number"==typeof s&&i.textContent!==""+s&&(f=["children",""+s]):g.hasOwnProperty(c)&&null!=s&&pr(d,c));switch(l){case"input":Ve(i),xt(i,p,!0);break;case"textarea":Ve(i),Jn(i);break;case"select":case"option":break;default:"function"==typeof p.onClick&&(i.onclick=dr)}c=f,a.updateQueue=c,(a=null!==c)&&di(t)}else{p=t,i=c,d=a,f=9===l.nodeType?l:l.ownerDocument,s===er.html&&(s=tr(i)),s===er.html?"script"===i?((i=f.createElement("div")).innerHTML="<script><\/script>",f=i.removeChild(i.firstChild)):"string"==typeof d.is?f=f.createElement(i,{is:d.is}):(f=f.createElement(i),"select"===i&&d.multiple&&(f.multiple=!0)):f=f.createElementNS(s,i),(i=f)[A]=p,i[U]=a,hi(i,t,!1,!1),d=i;var h=l,m=fr(f=c,p=a);switch(f){case"iframe":case"object":Cn("load",d),l=p;break;case"video":case"audio":for(l=0;l<re.length;l++)Cn(re[l],d);l=p;break;case"source":Cn("error",d),l=p;break;case"img":case"image":case"link":Cn("error",d),Cn("load",d),l=p;break;case"form":Cn("reset",d),Cn("submit",d),l=p;break;case"details":Cn("toggle",d),l=p;break;case"input":Et(d,p),l=_t(d,p),Cn("invalid",d),pr(h,"onChange");break;case"option":l=Yn(d,p);break;case"select":d._wrapperState={wasMultiple:!!p.multiple},l=o({},p,{value:void 0}),Cn("invalid",d),pr(h,"onChange");break;case"textarea":Xn(d,p),l=Gn(d,p),Cn("invalid",d),pr(h,"onChange");break;default:l=p}sr(f,l),s=void 0;var y=f,v=d,b=l;for(s in b)if(b.hasOwnProperty(s)){var w=b[s];"style"===s?lr(v,w):"dangerouslySetInnerHTML"===s?null!=(w=w?w.__html:void 0)&&or(v,w):"children"===s?"string"==typeof w?("textarea"!==y||""!==w)&&ir(v,w):"number"==typeof w&&ir(v,""+w):"suppressContentEditableWarning"!==s&&"suppressHydrationWarning"!==s&&"autoFocus"!==s&&(g.hasOwnProperty(s)?null!=w&&pr(h,s):null!=w&&gt(v,s,w,m))}switch(f){case"input":Ve(d),xt(d,p,!1);break;case"textarea":Ve(d),Jn(d);break;case"option":null!=p.value&&d.setAttribute("value",""+wt(p.value));break;case"select":(l=d).multiple=!!p.multiple,null!=(d=p.value)?Qn(l,!!p.multiple,d,!1):null!=p.defaultValue&&Qn(l,!!p.multiple,p.defaultValue,!0);break;default:"function"==typeof l.onClick&&(d.onclick=dr)}(a=yr(c,a))&&di(t),t.stateNode=i}null!==t.ref&&(t.effectTag|=128)}else null===t.stateNode&&u("166");break;case 6:i&&null!=t.stateNode?vi(i,t,i.memoizedProps,a):("string"!=typeof a&&(null===t.stateNode&&u("166")),i=xo(So.current),xo(Eo.current),Xo(t)?(c=(a=t).stateNode,i=a.memoizedProps,c[A]=a,(a=c.nodeValue!==i)&&di(t)):(c=t,(a=(9===i.nodeType?i:i.ownerDocument).createTextNode(a))[A]=t,c.stateNode=a));break;case 11:break;case 13:a=t.memoizedState,c=null!==i?i.memoizedState:null,(null!==a&&a.didTimeout)!==(null!==c&&c.didTimeout)&&(t.effectTag|=4);break;case 7:case 8:case 12:break;case 4:Co(),mi(t);break;case 10:bo(t);break;case 9:case 14:break;case 17:Nr(t.type)&&Rr();break;default:u("156")}if(Di=null,t=e,1073741823===Ai||1073741823!==t.childExpirationTime){for(a=0,c=t.child;null!==c;)i=c.expirationTime,l=c.childExpirationTime,(0===a||0!==i&&i<a)&&(a=i),(0===a||0!==l&&l<a)&&(a=l),c=c.sibling;t.childExpirationTime=a}null!==n&&0==(512&n.effectTag)&&(null===n.firstEffect&&(n.firstEffect=e.firstEffect),null!==e.lastEffect&&(null!==n.lastEffect&&(n.lastEffect.nextEffect=e.firstEffect),n.lastEffect=e.lastEffect),1<e.effectTag&&(null!==n.lastEffect?n.lastEffect.nextEffect=e:n.firstEffect=e,n.lastEffect=e))}else{if(null!==(e=Ci(e)))return e.effectTag&=511,e;null!==n&&(n.firstEffect=n.lastEffect=null,n.effectTag|=512)}if(null!==r)return r;if(null===n)break;e=n}return null}function $i(e){var t=pi(e.alternate,e,Ai);return e.memoizedProps=e.pendingProps,null===t&&(t=Bi(e)),Ti.current=null,t}function Vi(e,t,n){Ri&&u("243"),Ri=!0,Ti.currentDispatcher=Pi;var r=e.nextExpirationTimeToWorkOn;r===Ai&&e===Ii&&null!==Di||(Wi(),Ai=r,Di=$r((Ii=e).current,null),e.pendingCommitExpirationTime=0);for(var o=!1;;){try{if(t)for(;null!==Di&&!Nu();)Di=$i(Di);else for(;null!==Di;)Di=$i(Di)}catch(t){if(null===Di)o=!0,Ru(t);else{null===Di&&u("271");var i=Di,a=i.return;if(null!==a){e:{var l=e,c=a,s=i,f=t;if(a=Ai,s.effectTag|=512,s.firstEffect=s.lastEffect=null,null!==f&&"object"==typeof f&&"function"==typeof f.then){var p=f;f=c;var d=-1,h=-1;do{if(13===f.tag){var m=f.alternate;if(null!==m&&(null!==(m=m.memoizedState)&&m.didTimeout)){h=10*(m.timedOutAt-2);break}"number"==typeof(m=f.pendingProps.maxDuration)&&(0>=m?d=0:(-1===d||m<d)&&(d=m))}f=f.return}while(null!==f);f=c;do{if((m=13===f.tag)&&(void 0===f.memoizedProps.fallback?m=!1:m=null===(m=f.memoizedState)||!m.didTimeout),m){if(c=Ki.bind(null,l,f,s,0==(1&f.mode)?1:a),p.then(c,c),0==(1&f.mode)){f.effectTag|=32,ei(s.alternate,s,null,a),s.effectTag&=-513,1===s.tag&&(s.effectTag&=-421,null===s.alternate&&(s.tag=17));break e}-1===d?l=1073741823:(-1===h&&(h=10*(Xr(l,a)-2)-5e3),l=h+d),0<=l&&Ui<l&&(Ui=l),f.effectTag|=1024,f.expirationTime=a;break e}f=f.return}while(null!==f);f=Error("An update was suspended, but no placeholder UI was provided.")}Mi=!0,f=fo(f,s),l=c;do{switch(l.tag){case 3:s=f,l.effectTag|=1024,l.expirationTime=a,io(l,a=xi(l,s,a));break e;case 1:if(s=f,c=l.type,p=l.stateNode,0==(64&l.effectTag)&&("function"==typeof c.getDerivedStateFromError||null!==p&&"function"==typeof p.componentDidCatch&&(null===zi||!zi.has(p)))){l.effectTag|=1024,l.expirationTime=a,io(l,a=ki(l,s,a));break e}}l=l.return}while(null!==l)}Di=Bi(i);continue}o=!0,Ru(t)}}break}if(Ri=!1,yo=mo=ho=Ti.currentDispatcher=null,o)Ii=null,e.finishedWork=null;else if(null!==Di)e.finishedWork=null;else{if(null===(t=e.current.alternate)&&u("281"),Ii=null,Mi){if(o=e.latestPendingTime,i=e.latestSuspendedTime,a=e.latestPingedTime,0!==o&&o>r||0!==i&&i>r||0!==a&&a>r)return Gr(e,r),void Eu(e,t,r,e.expirationTime,-1);if(!e.didError&&!n)return e.didError=!0,r=e.nextExpirationTimeToWorkOn=r,n=e.expirationTime=1,void Eu(e,t,r,n,-1)}n||-1===Ui?(e.pendingCommitExpirationTime=r,e.finishedWork=t):(Gr(e,r),(n=10*(Xr(e,r)-2))<Ui&&(Ui=n),n=10*(Ou()-2),n=Ui-n,Eu(e,t,r,e.expirationTime,0>n?0:n))}}function Hi(e,t){var n;e:{for(Ri&&!Li&&u("263"),n=e.return;null!==n;){switch(n.tag){case 1:var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromError||"function"==typeof r.componentDidCatch&&(null===zi||!zi.has(r))){oo(n,e=ki(n,e=fo(t,e),1)),Qi(n,1),n=void 0;break e}break;case 3:oo(n,e=xi(n,e=fo(t,e),1)),Qi(n,1),n=void 0;break e}n=n.return}3===e.tag&&(oo(e,n=xi(e,n=fo(t,e),1)),Qi(e,1)),n=void 0}return n}function qi(e,t){return 0!==Ni?e=Ni:Ri?e=Li?1:Ai:1&t.mode?(e=fu?2+10*(1+((e-2+15)/10|0)):2+25*(1+((e-2+500)/25|0)),null!==Ii&&e===Ai&&(e+=1)):e=1,fu&&e>ou&&(ou=e),e}function Ki(e,t,n,r){var o=e.earliestSuspendedTime,i=e.latestSuspendedTime;if(0!==o&&r>=o&&r<=i){i=o=r,e.didError=!1;var u=e.latestPingedTime;(0===u||u<i)&&(e.latestPingedTime=i),Zr(i,e)}else Qr(e,o=qi(o=Ou(),t));0!=(1&t.mode)&&e===Ii&&Ai===r&&(Ii=null),Yi(t,o),0==(1&t.mode)&&(Yi(n,o),1===n.tag&&null!==n.stateNode&&((t=no(o)).tag=2,oo(n,t))),0!==(n=e.expirationTime)&&Su(e,n)}function Yi(e,t){(0===e.expirationTime||e.expirationTime>t)&&(e.expirationTime=t);var n=e.alternate;null!==n&&(0===n.expirationTime||n.expirationTime>t)&&(n.expirationTime=t);var r=e.return,o=null;if(null===r&&3===e.tag)o=e.stateNode;else for(;null!==r;){if(n=r.alternate,(0===r.childExpirationTime||r.childExpirationTime>t)&&(r.childExpirationTime=t),null!==n&&(0===n.childExpirationTime||n.childExpirationTime>t)&&(n.childExpirationTime=t),null===r.return&&3===r.tag){o=r.stateNode;break}r=r.return}return null===o?null:o}function Qi(e,t){null!==(e=Yi(e,t))&&(!Ri&&0!==Ai&&t<Ai&&Wi(),Qr(e,t),Ri&&!Li&&Ii===e||Su(e,e.expirationTime),vu>yu&&(vu=0,u("185")))}function Gi(e,t,n,r,o){var i=Ni;Ni=1;try{return e(t,n,r,o)}finally{Ni=i}}var Xi=null,Zi=null,Ji=0,eu=void 0,tu=!1,nu=null,ru=0,ou=0,iu=!1,uu=!1,au=null,lu=null,cu=!1,su=!1,fu=!1,pu=null,du=i.unstable_now(),hu=2+(du/10|0),mu=hu,yu=50,vu=0,bu=null,gu=1;function wu(){hu=2+((i.unstable_now()-du)/10|0)}function _u(e,t){if(0!==Ji){if(t>Ji)return;null!==eu&&i.unstable_cancelCallback(eu)}Ji=t,e=i.unstable_now()-du,eu=i.unstable_scheduleCallback(ku,{timeout:10*(t-2)-e})}function Eu(e,t,n,r,o){e.expirationTime=r,0!==o||Nu()?0<o&&(e.timeoutHandle=br(function(e,t,n){e.pendingCommitExpirationTime=n,e.finishedWork=t,wu(),mu=hu,Pu(e,n)}.bind(null,e,t,n),o)):(e.pendingCommitExpirationTime=n,e.finishedWork=t)}function Ou(){return tu?mu:(xu(),0!==ru&&1073741823!==ru||(wu(),mu=hu),mu)}function Su(e,t){if(null===e.nextScheduledRoot)e.expirationTime=t,null===Zi?(Xi=Zi=e,e.nextScheduledRoot=e):(Zi=Zi.nextScheduledRoot=e).nextScheduledRoot=Xi;else{var n=e.expirationTime;(0===n||t<n)&&(e.expirationTime=t)}tu||(cu?su&&(nu=e,ru=1,Tu(e,1,!0)):1===t?Cu(1,null):_u(e,t))}function xu(){var e=0,t=null;if(null!==Zi)for(var n=Zi,r=Xi;null!==r;){var o=r.expirationTime;if(0===o){if((null===n||null===Zi)&&u("244"),r===r.nextScheduledRoot){Xi=Zi=r.nextScheduledRoot=null;break}if(r===Xi)Xi=o=r.nextScheduledRoot,Zi.nextScheduledRoot=o,r.nextScheduledRoot=null;else{if(r===Zi){(Zi=n).nextScheduledRoot=Xi,r.nextScheduledRoot=null;break}n.nextScheduledRoot=r.nextScheduledRoot,r.nextScheduledRoot=null}r=n.nextScheduledRoot}else{if((0===e||o<e)&&(e=o,t=r),r===Zi)break;if(1===e)break;n=r,r=r.nextScheduledRoot}}nu=t,ru=e}function ku(e){if(e.didTimeout&&null!==Xi){wu();var t=Xi;do{var n=t.expirationTime;0!==n&&hu>=n&&(t.nextExpirationTimeToWorkOn=hu),t=t.nextScheduledRoot}while(t!==Xi)}Cu(0,e)}function Cu(e,t){if(lu=t,xu(),null!==lu)for(wu(),mu=hu;null!==nu&&0!==ru&&(0===e||e>=ru)&&(!iu||hu>=ru);)Tu(nu,ru,hu>=ru),xu(),wu(),mu=hu;else for(;null!==nu&&0!==ru&&(0===e||e>=ru);)Tu(nu,ru,!0),xu();if(null!==lu&&(Ji=0,eu=null),0!==ru&&_u(nu,ru),lu=null,iu=!1,vu=0,bu=null,null!==pu)for(e=pu,pu=null,t=0;t<e.length;t++){var n=e[t];try{n._onComplete()}catch(e){uu||(uu=!0,au=e)}}if(uu)throw e=au,au=null,uu=!1,e}function Pu(e,t){tu&&u("253"),nu=e,ru=t,Tu(e,t,!0),Cu(1,null)}function Tu(e,t,n){if(tu&&u("245"),tu=!0,null===lu||n){var r=e.finishedWork;null!==r?ju(e,r,t):(e.finishedWork=null,-1!==(r=e.timeoutHandle)&&(e.timeoutHandle=-1,gr(r)),Vi(e,!1,n),null!==(r=e.finishedWork)&&ju(e,r,t))}else null!==(r=e.finishedWork)?ju(e,r,t):(e.finishedWork=null,-1!==(r=e.timeoutHandle)&&(e.timeoutHandle=-1,gr(r)),Vi(e,!0,n),null!==(r=e.finishedWork)&&(Nu()?e.finishedWork=r:ju(e,r,t)));tu=!1}function ju(e,t,n){var r=e.firstBatch;if(null!==r&&r._expirationTime<=n&&(null===pu?pu=[r]:pu.push(r),r._defer))return e.finishedWork=t,void(e.expirationTime=0);e.finishedWork=null,e===bu?vu++:(bu=e,vu=0),Li=Ri=!0,e.current===t&&u("177");var o=e.pendingCommitExpirationTime;0===o&&u("261"),e.pendingCommitExpirationTime=0;var i=t.expirationTime,a=t.childExpirationTime,l=0===i||0!==a&&a<i?a:i;if(e.didError=!1,0===l)e.earliestPendingTime=0,e.latestPendingTime=0,e.earliestSuspendedTime=0,e.latestSuspendedTime=0,e.latestPingedTime=0;else{var c=e.latestPendingTime;0!==c&&(c<l?e.earliestPendingTime=e.latestPendingTime=0:e.earliestPendingTime<l&&(e.earliestPendingTime=e.latestPendingTime));var s=e.earliestSuspendedTime;0===s?Qr(e,l):l>e.latestSuspendedTime?(e.earliestSuspendedTime=0,e.latestSuspendedTime=0,e.latestPingedTime=0,Qr(e,l)):l<s&&Qr(e,l)}if(Zr(0,e),Ti.current=null,1<t.effectTag)if(null!==t.lastEffect){t.lastEffect.nextEffect=t;var f=t.firstEffect}else f=t;else f=t.firstEffect;hr=kn;var p=Fn();if(Ln(p)){if("selectionStart"in p)var d={start:p.selectionStart,end:p.selectionEnd};else e:{var h=p.ownerDocument,m=h&&h.defaultView||window,y=m.getSelection&&m.getSelection();if(y&&0!==y.rangeCount){var v=y.anchorNode,b=y.anchorOffset,g=y.focusNode,w=y.focusOffset;try{v.nodeType,g.nodeType}catch(e){d=null;break e}var _=0,E=-1,O=-1,S=0,x=0,k=p,C=null;t:for(;;){for(var P;k!==v||0!==b&&3!==k.nodeType||(E=_+b),k!==g||0!==w&&3!==k.nodeType||(O=_+w),3===k.nodeType&&(_+=k.nodeValue.length),null!==(P=k.firstChild);)C=k,k=P;for(;;){if(k===p)break t;if(C===v&&++S===b&&(E=_),C===g&&++x===w&&(O=_),null!==(P=k.nextSibling))break;C=(k=C).parentNode}k=P}d=-1===E||-1===O?null:{start:E,end:O}}else d=null}var T=d||{start:0,end:0}}else T=null;for(mr={focusedElem:p,selectionRange:T},kn=!1,Fi=f;null!==Fi;){var j=!1,N=void 0;try{for(;null!==Fi;){if(256&Fi.effectTag){var R=Fi.alternate;e:{var D=Fi;switch(D.tag){case 1:if(256&D.effectTag&&null!==R){var I=R.memoizedProps,A=R.memoizedState,U=D.stateNode;U.props=D.memoizedProps,U.state=D.memoizedState;var M=U.getSnapshotBeforeUpdate(I,A);U.__reactInternalSnapshotBeforeUpdate=M}break e;case 3:case 5:case 6:case 4:case 17:break e;default:u("163")}}}Fi=Fi.nextEffect}}catch(e){j=!0,N=e}j&&(null===Fi&&u("178"),Hi(Fi,N),null!==Fi&&(Fi=Fi.nextEffect))}for(Fi=f;null!==Fi;){var F=!1,L=void 0;try{for(;null!==Fi;){var z=Fi.effectTag;if(16&z&&ir(Fi.stateNode,""),128&z){var W=Fi.alternate;if(null!==W){var B=W.ref;null!==B&&("function"==typeof B?B(null):B.current=null)}}switch(14&z){case 2:Ei(Fi),Fi.effectTag&=-3;break;case 6:Ei(Fi),Fi.effectTag&=-3,Si(Fi.alternate,Fi);break;case 4:Si(Fi.alternate,Fi);break;case 8:var $=Fi;Oi($);var V=$;V.return=null,V.child=null,V.alternate&&(V.alternate.child=null,V.alternate.return=null)}Fi=Fi.nextEffect}}catch(e){F=!0,L=e}F&&(null===Fi&&u("178"),Hi(Fi,L),null!==Fi&&(Fi=Fi.nextEffect))}var H=mr,q=Fn(),K=H.focusedElem,Y=H.selectionRange;if(q!==K&&K&&K.ownerDocument&&function e(t,n){return!(!t||!n)&&(t===n||(!t||3!==t.nodeType)&&(n&&3===n.nodeType?e(t,n.parentNode):"contains"in t?t.contains(n):!!t.compareDocumentPosition&&!!(16&t.compareDocumentPosition(n))))}(K.ownerDocument.documentElement,K)){if(null!==Y&&Ln(K)){var Q=Y.start,G=Y.end;if(void 0===G&&(G=Q),"selectionStart"in K)K.selectionStart=Q,K.selectionEnd=Math.min(G,K.value.length);else{var X=K.ownerDocument||document,Z=(X&&X.defaultView||window).getSelection(),J=K.textContent.length,ee=Math.min(Y.start,J),te=void 0===Y.end?ee:Math.min(Y.end,J);if(!Z.extend&&ee>te){var ne=te;te=ee,ee=ne}var re=Mn(K,ee),oe=Mn(K,te);if(re&&oe&&(1!==Z.rangeCount||Z.anchorNode!==re.node||Z.anchorOffset!==re.offset||Z.focusNode!==oe.node||Z.focusOffset!==oe.offset)){var ie=X.createRange();ie.setStart(re.node,re.offset),Z.removeAllRanges(),ee>te?(Z.addRange(ie),Z.extend(oe.node,oe.offset)):(ie.setEnd(oe.node,oe.offset),Z.addRange(ie))}}}for(var ue=[],ae=K;ae=ae.parentNode;)1===ae.nodeType&&ue.push({element:ae,left:ae.scrollLeft,top:ae.scrollTop});"function"==typeof K.focus&&K.focus();for(var le=0;le<ue.length;le++){var ce=ue[le];ce.element.scrollLeft=ce.left,ce.element.scrollTop=ce.top}}for(mr=null,kn=!!hr,hr=null,e.current=t,Fi=f;null!==Fi;){var se=!1,fe=void 0;try{for(;null!==Fi;){var pe=Fi.effectTag;if(36&pe){var de=void 0,he=Fi.alternate,me=Fi;switch(me.tag){case 1:var ye=me.stateNode;if(4&me.effectTag)if(null===he)ye.props=me.memoizedProps,ye.state=me.memoizedState,ye.componentDidMount();else{var ve=he.memoizedProps,be=he.memoizedState;ye.props=me.memoizedProps,ye.state=me.memoizedState,ye.componentDidUpdate(ve,be,ye.__reactInternalSnapshotBeforeUpdate)}var ge=me.updateQueue;null!==ge&&(ye.props=me.memoizedProps,ye.state=me.memoizedState,co(0,ge,ye));break;case 3:var we=me.updateQueue;if(null!==we){var _e=null;if(null!==me.child)switch(me.child.tag){case 5:_e=me.child.stateNode;break;case 1:_e=me.child.stateNode}co(0,we,_e)}break;case 5:var Ee=me.stateNode;null===he&&4&me.effectTag&&yr(me.type,me.memoizedProps)&&Ee.focus();break;case 6:case 4:case 12:break;case 13:if(32&me.effectTag){me.memoizedState={alreadyCaptured:!0,didTimeout:!1,timedOutAt:0},Qi(me,1);break}var Oe=null!==he?he.memoizedState:null,Se=me.memoizedState,xe=null!==Oe&&Oe.didTimeout,ke=me;if(null===Se?de=!1:(de=Se.didTimeout)&&(ke=me.child,Se.alreadyCaptured=!1,0===Se.timedOutAt&&(Se.timedOutAt=Ou())),de!==xe&&null!==ke)e:for(var Ce=ke,Pe=de,Te=Ce;;){if(5===Te.tag){var je=Te.stateNode;if(Pe)je.style.display="none";else{var Ne=Te.stateNode,Re=Te.memoizedProps.style,De=void 0!==Re&&null!==Re&&Re.hasOwnProperty("display")?Re.display:null;Ne.style.display=De}}else if(6===Te.tag)Te.stateNode.nodeValue=Pe?"":Te.memoizedProps;else if(null!==Te.child){Te.child.return=Te,Te=Te.child;continue}if(Te===Ce)break e;for(;null===Te.sibling;){if(null===Te.return||Te.return===Ce)break e;Te=Te.return}Te.sibling.return=Te.return,Te=Te.sibling}break;case 17:break;default:u("163")}}if(128&pe){var Ie=Fi.ref;if(null!==Ie){var Ae=Fi.stateNode;switch(Fi.tag){case 5:var Ue=Ae;break;default:Ue=Ae}"function"==typeof Ie?Ie(Ue):Ie.current=Ue}}var Me=Fi.nextEffect;Fi.nextEffect=null,Fi=Me}}catch(e){se=!0,fe=e}se&&(null===Fi&&u("178"),Hi(Fi,fe),null!==Fi&&(Fi=Fi.nextEffect))}Ri=Li=!1,"function"==typeof Fr&&Fr(t.stateNode);var Fe=t.expirationTime,Le=t.childExpirationTime,ze=0===Fe||0!==Le&&Le<Fe?Le:Fe;0===ze&&(zi=null),e.expirationTime=ze,e.finishedWork=null}function Nu(){return!!iu||!(null===lu||lu.timeRemaining()>gu)&&(iu=!0)}function Ru(e){null===nu&&u("246"),nu.expirationTime=0,uu||(uu=!0,au=e)}function Du(e,t){var n=cu;cu=!0;try{return e(t)}finally{(cu=n)||tu||Cu(1,null)}}function Iu(e,t){if(cu&&!su){su=!0;try{return e(t)}finally{su=!1}}return e(t)}function Au(e,t,n){if(fu)return e(t,n);cu||tu||0===ou||(Cu(ou,null),ou=0);var r=fu,o=cu;cu=fu=!0;try{return e(t,n)}finally{fu=r,(cu=o)||tu||Cu(1,null)}}function Uu(e,t,n,r,o){var i=t.current;e:if(n){n=n._reactInternalFiber;t:{2===rn(n)&&1===n.tag||u("170");var a=n;do{switch(a.tag){case 3:a=a.stateNode.context;break t;case 1:if(Nr(a.type)){a=a.stateNode.__reactInternalMemoizedMergedChildContext;break t}}a=a.return}while(null!==a);u("171"),a=void 0}if(1===n.tag){var l=n.type;if(Nr(l)){n=Ar(n,l,a);break e}}n=a}else n=kr;return null===t.context?t.context=n:t.pendingContext=n,t=o,(o=no(r)).payload={element:e},null!==(t=void 0===t?null:t)&&(o.callback=t),oo(i,o),Qi(i,r),r}function Mu(e,t,n,r){var o=t.current;return Uu(e,t,n,o=qi(Ou(),o),r)}function Fu(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:default:return e.child.stateNode}}function Lu(e){var t=2+25*(1+((Ou()-2+500)/25|0));t<=ji&&(t=ji+1),this._expirationTime=ji=t,this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function zu(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function Wu(e,t,n){e={current:t=Wr(3,null,null,t?3:0),containerInfo:e,pendingChildren:null,earliestPendingTime:0,latestPendingTime:0,earliestSuspendedTime:0,latestSuspendedTime:0,latestPingedTime:0,didError:!1,pendingCommitExpirationTime:0,finishedWork:null,timeoutHandle:-1,context:null,pendingContext:null,hydrate:n,nextExpirationTimeToWorkOn:0,expirationTime:0,firstBatch:null,nextScheduledRoot:null},this._internalRoot=t.stateNode=e}function Bu(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function $u(e,t,n,r,o){Bu(n)||u("200");var i=n._reactRootContainer;if(i){if("function"==typeof o){var a=o;o=function(){var e=Fu(i._internalRoot);a.call(e)}}null!=e?i.legacy_renderSubtreeIntoContainer(e,t,o):i.render(t,o)}else{if(i=n._reactRootContainer=function(e,t){if(t||(t=!(!(t=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new Wu(e,!1,t)}(n,r),"function"==typeof o){var l=o;o=function(){var e=Fu(i._internalRoot);l.call(e)}}Iu(function(){null!=e?i.legacy_renderSubtreeIntoContainer(e,t,o):i.render(t,o)})}return Fu(i._internalRoot)}function Vu(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return Bu(t)||u("200"),function(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:Ge,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}(e,t,null,n)}Pe=function(e,t,n){switch(t){case"input":if(St(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=z(r);o||u("90"),He(r),St(r,o)}}}break;case"textarea":Zn(e,n);break;case"select":null!=(t=n.value)&&Qn(e,!!n.multiple,t,!1)}},Lu.prototype.render=function(e){this._defer||u("250"),this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,r=new zu;return Uu(e,t,null,n,r._onCommit),r},Lu.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},Lu.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(this._defer&&null!==t||u("251"),this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var r=null,o=t;o!==this;)r=o,o=o._next;null===r&&u("251"),r._next=o._next,this._next=t,e.firstBatch=this}this._defer=!1,Pu(e,n),t=this._next,this._next=null,null!==(t=e.firstBatch=t)&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},Lu.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},zu.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},zu.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];"function"!=typeof n&&u("191",n),n()}}},Wu.prototype.render=function(e,t){var n=this._internalRoot,r=new zu;return null!==(t=void 0===t?null:t)&&r.then(t),Mu(e,n,null,r._onCommit),r},Wu.prototype.unmount=function(e){var t=this._internalRoot,n=new zu;return null!==(e=void 0===e?null:e)&&n.then(e),Mu(null,t,null,n._onCommit),n},Wu.prototype.legacy_renderSubtreeIntoContainer=function(e,t,n){var r=this._internalRoot,o=new zu;return null!==(n=void 0===n?null:n)&&o.then(n),Mu(t,r,e,o._onCommit),o},Wu.prototype.createBatch=function(){var e=new Lu(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime<=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e},Ie=Du,Ae=Au,Ue=function(){tu||0===ou||(Cu(ou,null),ou=0)};var Hu={createPortal:Vu,findDOMNode:function(e){if(null==e)return null;if(1===e.nodeType)return e;var t=e._reactInternalFiber;return void 0===t&&("function"==typeof e.render?u("188"):u("268",Object.keys(e))),e=null===(e=un(t))?null:e.stateNode},hydrate:function(e,t,n){return $u(null,e,t,!0,n)},render:function(e,t,n){return $u(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,r){return(null==e||void 0===e._reactInternalFiber)&&u("38"),$u(e,t,n,!1,r)},unmountComponentAtNode:function(e){return Bu(e)||u("40"),!!e._reactRootContainer&&(Iu(function(){$u(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:function(){return Vu.apply(void 0,arguments)},unstable_batchedUpdates:Du,unstable_interactiveUpdates:Au,flushSync:function(e,t){tu&&u("187");var n=cu;cu=!0;try{return Gi(e,t)}finally{cu=n,Cu(1,null)}},unstable_flushControlled:function(e){var t=cu;cu=!0;try{Gi(e)}finally{(cu=t)||tu||Cu(1,null)}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[F,L,z,N.injectEventPluginsByName,b,q,function(e){k(e,H)},Re,De,jn,D]},unstable_createRoot:function(e,t){return Bu(e)||u("278"),new Wu(e,!0,null!=t&&!0===t.hydrate)}};!function(e){var t=e.findFiberByHostInstance;(function(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);Fr=zr(function(e){return t.onCommitFiberRoot(n,e)}),Lr=zr(function(e){return t.onCommitFiberUnmount(n,e)})}catch(e){}})(o({},e,{findHostInstanceByFiber:function(e){return null===(e=un(e))?null:e.stateNode},findFiberByHostInstance:function(e){return t?t(e):null}}))}({findFiberByHostInstance:M,bundleType:0,version:"16.6.0",rendererPackageName:"react-dom"});var qu={default:Hu},Ku=qu&&Hu||qu;e.exports=Ku.default||Ku},function(e,t,n){"use strict";e.exports=n(28)},function(e,t,n){"use strict";
/** @license React v16.6.0
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Object.defineProperty(t,"__esModule",{value:!0});var r=null,o=3,i=-1,u=-1,a=!1,l=!1,c="object"==typeof performance&&"function"==typeof performance.now,s={timeRemaining:c?function(){if(null!==r&&r.expirationTime<u)return 0;var e=g()-performance.now();return 0<e?e:0}:function(){if(null!==r&&r.expirationTime<u)return 0;var e=g()-Date.now();return 0<e?e:0},didTimeout:!1};function f(){if(!a){var e=r.expirationTime;l?b():l=!0,v(h,e)}}function p(){var e=r,t=r.next;if(r===t)r=null;else{var n=r.previous;r=n.next=t,t.previous=n}e.next=e.previous=null,n=e.callback,t=e.expirationTime,e=e.priorityLevel;var i=o,a=u;o=e,u=t;try{var l=n(s)}finally{o=i,u=a}if("function"==typeof l)if(l={callback:l,priorityLevel:e,expirationTime:t,next:null,previous:null},null===r)r=l.next=l.previous=l;else{n=null,e=r;do{if(e.expirationTime>=t){n=e;break}e=e.next}while(e!==r);null===n?n=r:n===r&&(r=l,f()),(t=n.previous).next=n.previous=l,l.next=n,l.previous=t}}function d(){if(-1===i&&null!==r&&1===r.priorityLevel){a=!0,s.didTimeout=!0;try{do{p()}while(null!==r&&1===r.priorityLevel)}finally{a=!1,null!==r?f():l=!1}}}function h(e){a=!0,s.didTimeout=e;try{if(e)for(;null!==r;){var n=t.unstable_now();if(!(r.expirationTime<=n))break;do{p()}while(null!==r&&r.expirationTime<=n)}else if(null!==r)do{p()}while(null!==r&&0<g()-t.unstable_now())}finally{a=!1,null!==r?f():l=!1,d()}}var m,y,v,b,g,w=Date,_="function"==typeof setTimeout?setTimeout:void 0,E="function"==typeof clearTimeout?clearTimeout:void 0,O="function"==typeof requestAnimationFrame?requestAnimationFrame:void 0,S="function"==typeof cancelAnimationFrame?cancelAnimationFrame:void 0;function x(e){m=O(function(t){E(y),e(t)}),y=_(function(){S(m),e(t.unstable_now())},100)}if(c){var k=performance;t.unstable_now=function(){return k.now()}}else t.unstable_now=function(){return w.now()};if("undefined"!=typeof window&&window._schedMock){var C=window._schedMock;v=C[0],b=C[1],g=C[2]}else if("undefined"==typeof window||"function"!=typeof window.addEventListener){var P=null,T=-1,j=function(e,t){if(null!==P){var n=P;P=null;try{T=t,n(e)}finally{T=-1}}};v=function(e,t){-1!==T?setTimeout(v,0,e,t):(P=e,setTimeout(j,t,!0,t),setTimeout(j,1073741823,!1,1073741823))},b=function(){P=null},g=function(){return 1/0},t.unstable_now=function(){return-1===T?0:T}}else{"undefined"!=typeof console&&("function"!=typeof O&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!=typeof S&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));var N=null,R=!1,D=-1,I=!1,A=!1,U=0,M=33,F=33;g=function(){return U};var L="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(e){if(e.source===window&&e.data===L){R=!1,e=N;var n=D;N=null,D=-1;var r=t.unstable_now(),o=!1;if(0>=U-r){if(!(-1!==n&&n<=r))return I||(I=!0,x(z)),N=e,void(D=n);o=!0}if(null!==e){A=!0;try{e(o)}finally{A=!1}}}},!1);var z=function(e){if(null!==N){x(z);var t=e-U+F;t<F&&M<F?(8>t&&(t=8),F=t<M?M:t):M=t,U=e+F,R||(R=!0,window.postMessage(L,"*"))}else I=!1};v=function(e,t){N=e,D=t,A||0>t?window.postMessage(L,"*"):I||(I=!0,x(z))},b=function(){N=null,R=!1,D=-1}}t.unstable_ImmediatePriority=1,t.unstable_UserBlockingPriority=2,t.unstable_NormalPriority=3,t.unstable_IdlePriority=4,t.unstable_runWithPriority=function(e,n){switch(e){case 1:case 2:case 3:case 4:break;default:e=3}var r=o,u=i;o=e,i=t.unstable_now();try{return n()}finally{o=r,i=u,d()}},t.unstable_scheduleCallback=function(e,n){var u=-1!==i?i:t.unstable_now();if("object"==typeof n&&null!==n&&"number"==typeof n.timeout)n=u+n.timeout;else switch(o){case 1:n=u+-1;break;case 2:n=u+250;break;case 4:n=u+1073741823;break;default:n=u+5e3}if(e={callback:e,priorityLevel:o,expirationTime:n,next:null,previous:null},null===r)r=e.next=e.previous=e,f();else{u=null;var a=r;do{if(a.expirationTime>n){u=a;break}a=a.next}while(a!==r);null===u?u=r:u===r&&(r=e,f()),(n=u.previous).next=u.previous=e,e.next=u,e.previous=n}return e},t.unstable_cancelCallback=function(e){var t=e.next;if(null!==t){if(t===e)r=null;else{e===r&&(r=t);var n=e.previous;n.next=t,t.previous=n}e.next=e.previous=null}},t.unstable_wrapCallback=function(e){var n=o;return function(){var r=o,u=i;o=n,i=t.unstable_now();try{return e.apply(this,arguments)}finally{o=r,i=u,d()}}},t.unstable_getCurrentPriorityLevel=function(){return o}},function(e,t,n){"use strict";var r=n(30);function o(){}e.exports=function(){function e(e,t,n,o,i,u){if(u!==r){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=o,n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";
/** @license React v16.6.0
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&Symbol.for,o=r?Symbol.for("react.element"):60103,i=r?Symbol.for("react.portal"):60106,u=r?Symbol.for("react.fragment"):60107,a=r?Symbol.for("react.strict_mode"):60108,l=r?Symbol.for("react.profiler"):60114,c=r?Symbol.for("react.provider"):60109,s=r?Symbol.for("react.context"):60110,f=r?Symbol.for("react.concurrent_mode"):60111,p=r?Symbol.for("react.forward_ref"):60112,d=r?Symbol.for("react.suspense"):60113,h=r?Symbol.for("react.memo"):60115,m=r?Symbol.for("react.lazy"):60116;function y(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case o:switch(e=e.type){case f:case u:case l:case a:return e;default:switch(e=e&&e.$$typeof){case s:case p:case c:return e;default:return t}}case i:return t}}}function v(e){return y(e)===f}t.typeOf=y,t.AsyncMode=f,t.ConcurrentMode=f,t.ContextConsumer=s,t.ContextProvider=c,t.Element=o,t.ForwardRef=p,t.Fragment=u,t.Profiler=l,t.Portal=i,t.StrictMode=a,t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===u||e===f||e===l||e===a||e===d||"object"==typeof e&&null!==e&&(e.$$typeof===m||e.$$typeof===h||e.$$typeof===c||e.$$typeof===s||e.$$typeof===p)},t.isAsyncMode=function(e){return v(e)},t.isConcurrentMode=v,t.isContextConsumer=function(e){return y(e)===s},t.isContextProvider=function(e){return y(e)===c},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o},t.isForwardRef=function(e){return y(e)===p},t.isFragment=function(e){return y(e)===u},t.isProfiler=function(e){return y(e)===l},t.isPortal=function(e){return y(e)===i},t.isStrictMode=function(e){return y(e)===a}},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){var r=n(35);e.exports=function(e,t){return r(t,function(t){return e[t]})}},function(e,t){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}},function(e,t,n){var r=n(37),o=n(51),i=n(55);e.exports=function(e){return i(e)?r(e):o(e)}},function(e,t,n){var r=n(38),o=n(39),i=n(43),u=n(44),a=n(46),l=n(47),c=Object.prototype.hasOwnProperty;e.exports=function(e,t){var n=i(e),s=!n&&o(e),f=!n&&!s&&u(e),p=!n&&!s&&!f&&l(e),d=n||s||f||p,h=d?r(e.length,String):[],m=h.length;for(var y in e)!t&&!c.call(e,y)||d&&("length"==y||f&&("offset"==y||"parent"==y)||p&&("buffer"==y||"byteLength"==y||"byteOffset"==y)||a(y,m))||h.push(y);return h}},function(e,t){e.exports=function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}},function(e,t,n){var r=n(40),o=n(10),i=Object.prototype,u=i.hasOwnProperty,a=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&u.call(e,"callee")&&!a.call(e,"callee")};e.exports=l},function(e,t,n){var r=n(9),o=n(10),i="[object Arguments]";e.exports=function(e){return o(e)&&r(e)==i}},function(e,t,n){var r=n(15),o=Object.prototype,i=o.hasOwnProperty,u=o.toString,a=r?r.toStringTag:void 0;e.exports=function(e){var t=i.call(e,a),n=e[a];try{e[a]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[a]=n:delete e[a]),o}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t){var n=Array.isArray;e.exports=n},function(e,t,n){(function(e){var r=n(16),o=n(45),i=t&&!t.nodeType&&t,u=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=u&&u.exports===i?r.Buffer:void 0,l=(a?a.isBuffer:void 0)||o;e.exports=l}).call(this,n(11)(e))},function(e,t){e.exports=function(){return!1}},function(e,t){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;e.exports=function(e,t){var o=typeof e;return!!(t=null==t?n:t)&&("number"==o||"symbol"!=o&&r.test(e))&&e>-1&&e%1==0&&e<t}},function(e,t,n){var r=n(48),o=n(49),i=n(50),u=i&&i.isTypedArray,a=u?o(u):r;e.exports=a},function(e,t,n){var r=n(9),o=n(18),i=n(10),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,e.exports=function(e){return i(e)&&o(e.length)&&!!u[r(e)]}},function(e,t){e.exports=function(e){return function(t){return e(t)}}},function(e,t,n){(function(e){var r=n(17),o=t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===o&&r.process,a=function(){try{var e=i&&i.require&&i.require("util").types;return e||u&&u.binding&&u.binding("util")}catch(e){}}();e.exports=a}).call(this,n(11)(e))},function(e,t,n){var r=n(52),o=n(53),i=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return o(e);var t=[];for(var n in Object(e))i.call(e,n)&&"constructor"!=n&&t.push(n);return t}},function(e,t){var n=Object.prototype;e.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)}},function(e,t,n){var r=n(54)(Object.keys,Object);e.exports=r},function(e,t){e.exports=function(e,t){return function(n){return e(t(n))}}},function(e,t,n){var r=n(56),o=n(18);e.exports=function(e){return null!=e&&o(e.length)&&!r(e)}},function(e,t,n){var r=n(9),o=n(57),i="[object AsyncFunction]",u="[object Function]",a="[object GeneratorFunction]",l="[object Proxy]";e.exports=function(e){if(!o(e))return!1;var t=r(e);return t==u||t==a||t==i||t==l}},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),i=n(19),u=n.n(i);function a(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var l=n(1),c=n.n(l),s=c.a.shape({trySubscribe:c.a.func.isRequired,tryUnsubscribe:c.a.func.isRequired,notifyNestedSubs:c.a.func.isRequired,isSubscribed:c.a.func.isRequired}),f=c.a.shape({subscribe:c.a.func.isRequired,dispatch:c.a.func.isRequired,getState:c.a.func.isRequired});var p=function(e){var t;void 0===e&&(e="store");var n=e+"Subscription",o=function(t){a(i,t);var o=i.prototype;function i(n,r){var o;return(o=t.call(this,n,r)||this)[e]=n.store,o}return o.getChildContext=function(){var t;return(t={})[e]=this[e],t[n]=null,t},o.render=function(){return r.Children.only(this.props.children)},i}(r.Component);return o.propTypes={store:f.isRequired,children:c.a.element.isRequired},o.childContextTypes=((t={})[e]=f.isRequired,t[n]=s,t),o}();function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(){return(h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function m(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}var y=n(20),v=n.n(y),b=n(4),g=n.n(b),w=n(12),_=null,E={notify:function(){}};var O=function(){function e(e,t,n){this.store=e,this.parentSub=t,this.onStateChange=n,this.unsubscribe=null,this.listeners=E}var t=e.prototype;return t.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},t.notifyNestedSubs=function(){this.listeners.notify()},t.isSubscribed=function(){return Boolean(this.unsubscribe)},t.trySubscribe=function(){this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=function(){var e=[],t=[];return{clear:function(){t=_,e=_},notify:function(){for(var n=e=t,r=0;r<n.length;r++)n[r]()},get:function(){return t},subscribe:function(n){var r=!0;return t===e&&(t=e.slice()),t.push(n),function(){r&&e!==_&&(r=!1,t===e&&(t=e.slice()),t.splice(t.indexOf(n),1))}}}}())},t.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=E)},e}(),S=0,x={};function k(){}function C(e,t){var n,o;void 0===t&&(t={});var i=t,u=i.getDisplayName,l=void 0===u?function(e){return"ConnectAdvanced("+e+")"}:u,c=i.methodName,p=void 0===c?"connectAdvanced":c,y=i.renderCountProp,b=void 0===y?void 0:y,_=i.shouldHandleStateChanges,E=void 0===_||_,C=i.storeKey,P=void 0===C?"store":C,T=i.withRef,j=void 0!==T&&T,N=m(i,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),R=P+"Subscription",D=S++,I=((n={})[P]=f,n[R]=s,n),A=((o={})[R]=s,o);return function(t){g()(Object(w.isValidElementType)(t),"You must pass a component to the function returned by "+p+". Instead received "+JSON.stringify(t));var n=t.displayName||t.name||"Component",o=l(n),i=h({},N,{getDisplayName:l,methodName:p,renderCountProp:b,shouldHandleStateChanges:E,storeKey:P,withRef:j,displayName:o,wrappedComponentName:n,WrappedComponent:t}),u=function(n){function u(e,t){var r;return(r=n.call(this,e,t)||this).version=D,r.state={},r.renderCount=0,r.store=e[P]||t[P],r.propsMode=Boolean(e[P]),r.setWrappedInstance=r.setWrappedInstance.bind(d(d(r))),g()(r.store,'Could not find "'+P+'" in either the context or props of "'+o+'". Either wrap the root component in a <Provider>, or explicitly pass "'+P+'" as a prop to "'+o+'".'),r.initSelector(),r.initSubscription(),r}a(u,n);var l=u.prototype;return l.getChildContext=function(){var e,t=this.propsMode?null:this.subscription;return(e={})[R]=t||this.context[R],e},l.componentDidMount=function(){E&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},l.componentWillReceiveProps=function(e){this.selector.run(e)},l.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},l.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=k,this.store=null,this.selector.run=k,this.selector.shouldComponentUpdate=!1},l.getWrappedInstance=function(){return g()(j,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+p+"() call."),this.wrappedInstance},l.setWrappedInstance=function(e){this.wrappedInstance=e},l.initSelector=function(){var t=e(this.store.dispatch,i);this.selector=function(e,t){var n={run:function(r){try{var o=e(t.getState(),r);(o!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=o,n.error=null)}catch(e){n.shouldComponentUpdate=!0,n.error=e}}};return n}(t,this.store),this.selector.run(this.props)},l.initSubscription=function(){if(E){var e=(this.propsMode?this.props:this.context)[R];this.subscription=new O(this.store,e,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},l.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(x)):this.notifyNestedSubs()},l.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},l.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},l.addExtraProps=function(e){if(!(j||b||this.propsMode&&this.subscription))return e;var t=h({},e);return j&&(t.ref=this.setWrappedInstance),b&&(t[b]=this.renderCount++),this.propsMode&&this.subscription&&(t[R]=this.subscription),t},l.render=function(){var e=this.selector;if(e.shouldComponentUpdate=!1,e.error)throw e.error;return Object(r.createElement)(t,this.addExtraProps(e.props))},u}(r.Component);return u.WrappedComponent=t,u.displayName=o,u.childContextTypes=A,u.contextTypes=I,u.propTypes=I,v()(u,t)}}var P=Object.prototype.hasOwnProperty;function T(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function j(e,t){if(T(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!P.call(t,n[o])||!T(e[n[o]],t[n[o]]))return!1;return!0}var N=n(13),R=function(){return Math.random().toString(36).substring(7).split("").join(".")},D={INIT:"@@redux/INIT"+R(),REPLACE:"@@redux/REPLACE"+R(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+R()}};function I(e){if("object"!=typeof e||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function A(e,t,n){var r;if("function"==typeof t&&"function"==typeof n||"function"==typeof n&&"function"==typeof arguments[3])throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function");if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(A)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var o=e,i=t,u=[],a=u,l=!1;function c(){a===u&&(a=u.slice())}function s(){if(l)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return i}function f(e){if("function"!=typeof e)throw new Error("Expected the listener to be a function.");if(l)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");var t=!0;return c(),a.push(e),function(){if(t){if(l)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");t=!1,c();var n=a.indexOf(e);a.splice(n,1)}}}function p(e){if(!I(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(l)throw new Error("Reducers may not dispatch actions.");try{l=!0,i=o(i,e)}finally{l=!1}for(var t=u=a,n=0;n<t.length;n++){(0,t[n])()}return e}return p({type:D.INIT}),(r={dispatch:p,subscribe:f,getState:s,replaceReducer:function(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");o=e,p({type:D.REPLACE})}})[N.a]=function(){var e,t=f;return(e={subscribe:function(e){if("object"!=typeof e||null===e)throw new TypeError("Expected the observer to be an object.");function n(){e.next&&e.next(s())}return n(),{unsubscribe:t(n)}}})[N.a]=function(){return this},e},r}function U(e,t){var n=t&&t.type;return"Given "+(n&&'action "'+String(n)+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function M(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var o=t[r];0,"function"==typeof e[o]&&(n[o]=e[o])}var i,u=Object.keys(n);try{!function(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:D.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:D.PROBE_UNKNOWN_ACTION()}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+D.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}(n)}catch(e){i=e}return function(e,t){if(void 0===e&&(e={}),i)throw i;for(var r=!1,o={},a=0;a<u.length;a++){var l=u[a],c=n[l],s=e[l],f=c(s,t);if(void 0===f){var p=U(l,t);throw new Error(p)}o[l]=f,r=r||f!==s}return r?o:e}}function F(e,t){return function(){return t(e.apply(this,arguments))}}function L(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function z(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){var n=e.apply(void 0,arguments),r=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},o={getState:n.getState,dispatch:function(){return r.apply(void 0,arguments)}},i=t.map(function(e){return e(o)});return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){L(e,t,n[t])})}return e}({},n,{dispatch:r=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}.apply(void 0,i)(n.dispatch)})}}}function W(e){return function(t,n){var r=e(t,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function B(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function V(e,t){return function(t,n){n.displayName;var r=function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)};return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=B(e);var o=r(t,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=B(o),o=r(t,n)),o},r}}var H=[function(e){return"function"==typeof e?V(e):void 0},function(e){return e?void 0:W(function(e){return{dispatch:e}})},function(e){return e&&"object"==typeof e?W(function(t){return function(e,t){if("function"==typeof e)return F(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),r={},o=0;o<n.length;o++){var i=n[o],u=e[i];"function"==typeof u&&(r[i]=F(u,t))}return r}(e,t)}):void 0}];var q=[function(e){return"function"==typeof e?V(e):void 0},function(e){return e?void 0:W(function(){return{}})}];function K(e,t,n){return h({},n,e,t)}var Y=[function(e){return"function"==typeof e?function(e){return function(t,n){n.displayName;var r,o=n.pure,i=n.areMergedPropsEqual,u=!1;return function(t,n,a){var l=e(t,n,a);return u?o&&i(l,r)||(r=l):(u=!0,r=l),r}}}(e):void 0},function(e){return e?void 0:function(){return K}}];function Q(e,t,n,r){return function(o,i){return n(e(o,i),t(r,i),i)}}function G(e,t,n,r,o){var i,u,a,l,c,s=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1;function h(o,d){var h=!f(d,u),m=!s(o,i);return i=o,u=d,h&&m?(a=e(i,u),t.dependsOnOwnProps&&(l=t(r,u)),c=n(a,l,u)):h?(e.dependsOnOwnProps&&(a=e(i,u)),t.dependsOnOwnProps&&(l=t(r,u)),c=n(a,l,u)):m?function(){var t=e(i,u),r=!p(t,a);return a=t,r&&(c=n(a,l,u)),c}():c}return function(o,s){return d?h(o,s):function(o,s){return a=e(i=o,u=s),l=t(r,u),c=n(a,l,u),d=!0,c}(o,s)}}function X(e,t){var n=t.initMapStateToProps,r=t.initMapDispatchToProps,o=t.initMergeProps,i=m(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),u=n(e,i),a=r(e,i),l=o(e,i);return(i.pure?G:Q)(u,a,l,e,i)}function Z(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function J(e,t){return e===t}var ee=function(e){var t=void 0===e?{}:e,n=t.connectHOC,r=void 0===n?C:n,o=t.mapStateToPropsFactories,i=void 0===o?q:o,u=t.mapDispatchToPropsFactories,a=void 0===u?H:u,l=t.mergePropsFactories,c=void 0===l?Y:l,s=t.selectorFactory,f=void 0===s?X:s;return function(e,t,n,o){void 0===o&&(o={});var u=o,l=u.pure,s=void 0===l||l,p=u.areStatesEqual,d=void 0===p?J:p,y=u.areOwnPropsEqual,v=void 0===y?j:y,b=u.areStatePropsEqual,g=void 0===b?j:b,w=u.areMergedPropsEqual,_=void 0===w?j:w,E=m(u,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),O=Z(e,i,"mapStateToProps"),S=Z(t,a,"mapDispatchToProps"),x=Z(n,c,"mergeProps");return r(f,h({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:O,initMapDispatchToProps:S,initMergeProps:x,pure:s,areStatesEqual:d,areOwnPropsEqual:v,areStatePropsEqual:g,areMergedPropsEqual:_},E))}}(),te=n(5),ne=n.n(te),re=n(3),oe=n.n(re);function ie(e){return"/"===e.charAt(0)}function ue(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}var ae=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],r=t&&t.split("/")||[],o=e&&ie(e),i=t&&ie(t),u=o||i;if(e&&ie(e)?r=n:n.length&&(r.pop(),r=r.concat(n)),!r.length)return"/";var a=void 0;if(r.length){var l=r[r.length-1];a="."===l||".."===l||""===l}else a=!1;for(var c=0,s=r.length;s>=0;s--){var f=r[s];"."===f?ue(r,s):".."===f?(ue(r,s),c++):c&&(ue(r,s),c--)}if(!u)for(;c--;c)r.unshift("..");!u||""===r[0]||r[0]&&ie(r[0])||r.unshift("");var p=r.join("/");return a&&"/"!==p.substr(-1)&&(p+="/"),p},le="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var ce=function e(t,n){if(t===n)return!0;if(null==t||null==n)return!1;if(Array.isArray(t))return Array.isArray(n)&&t.length===n.length&&t.every(function(t,r){return e(t,n[r])});var r=void 0===t?"undefined":le(t);if(r!==(void 0===n?"undefined":le(n)))return!1;if("object"===r){var o=t.valueOf(),i=n.valueOf();if(o!==t||i!==n)return e(o,i);var u=Object.keys(t),a=Object.keys(n);return u.length===a.length&&u.every(function(r){return e(t[r],n[r])})}return!1},se=function(e){return"/"===e.charAt(0)?e:"/"+e},fe=function(e){return"/"===e.charAt(0)?e.substr(1):e},pe=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)},de=function(e,t){return pe(e,t)?e.substr(t.length):e},he=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},me=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o},ye=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ve=function(e,t,n,r){var o=void 0;"string"==typeof e?(o=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}}(e)).state=t:(void 0===(o=ye({},e)).pathname&&(o.pathname=""),o.search?"?"!==o.search.charAt(0)&&(o.search="?"+o.search):o.search="",o.hash?"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash):o.hash="",void 0!==t&&void 0===o.state&&(o.state=t));try{o.pathname=decodeURI(o.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(o.key=n),r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=ae(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o},be=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&ce(e.state,t.state)},ge=function(){var e=null,t=[];return{setPrompt:function(t){return oe()(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},confirmTransitionTo:function(t,n,r,o){if(null!=e){var i="function"==typeof e?e(t,n):e;"string"==typeof i?"function"==typeof r?r(i,o):(oe()(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),o(!0)):o(!1!==i)}else o(!0)},appendListener:function(e){var n=!0,r=function(){n&&e.apply(void 0,arguments)};return t.push(r),function(){n=!1,t=t.filter(function(e){return e!==r})}},notifyListeners:function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];t.forEach(function(e){return e.apply(void 0,n)})}}},we=!("undefined"==typeof window||!window.document||!window.document.createElement),_e=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},Ee=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},Oe=function(e,t){return t(window.confirm(e))},Se=("function"==typeof Symbol&&Symbol.iterator,Object.assign,Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}),xe={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+fe(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:fe,decodePath:se},slash:{encodePath:se,decodePath:se}},ke=function(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)},Ce=function(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)},Pe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};g()(we,"Hash history needs a DOM");var t=window.history,n=-1===window.navigator.userAgent.indexOf("Firefox"),r=e.getUserConfirmation,o=void 0===r?Oe:r,i=e.hashType,u=void 0===i?"slash":i,a=e.basename?he(se(e.basename)):"",l=xe[u],c=l.encodePath,s=l.decodePath,f=function(){var e=s(ke());return oe()(!a||pe(e,a),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+e+'" to begin with "'+a+'".'),a&&(e=de(e,a)),ve(e)},p=ge(),d=function(e){Se(P,e),P.length=t.length,p.notifyListeners(P.location,P.action)},h=!1,m=null,y=function(){var e=ke(),t=c(e);if(e!==t)Ce(t);else{var n=f(),r=P.location;if(!h&&be(r,n))return;if(m===me(n))return;m=null,v(n)}},v=function(e){h?(h=!1,d()):p.confirmTransitionTo(e,"POP",o,function(t){t?d({action:"POP",location:e}):b(e)})},b=function(e){var t=P.location,n=O.lastIndexOf(me(t));-1===n&&(n=0);var r=O.lastIndexOf(me(e));-1===r&&(r=0);var o=n-r;o&&(h=!0,S(o))},w=ke(),_=c(w);w!==_&&Ce(_);var E=f(),O=[me(E)],S=function(e){oe()(n,"Hash history go(n) causes a full page reload in this browser"),t.go(e)},x=0,k=function(e){1===(x+=e)?_e(window,"hashchange",y):0===x&&Ee(window,"hashchange",y)},C=!1,P={length:t.length,action:"POP",location:E,createHref:function(e){return"#"+c(a+me(e))},push:function(e,t){oe()(void 0===t,"Hash history cannot push state; it is ignored");var n=ve(e,void 0,void 0,P.location);p.confirmTransitionTo(n,"PUSH",o,function(e){if(e){var t=me(n),r=c(a+t);if(ke()!==r){m=t,function(e){window.location.hash=e}(r);var o=O.lastIndexOf(me(P.location)),i=O.slice(0,-1===o?0:o+1);i.push(t),O=i,d({action:"PUSH",location:n})}else oe()(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),d()}})},replace:function(e,t){oe()(void 0===t,"Hash history cannot replace state; it is ignored");var n=ve(e,void 0,void 0,P.location);p.confirmTransitionTo(n,"REPLACE",o,function(e){if(e){var t=me(n),r=c(a+t);ke()!==r&&(m=t,Ce(r));var o=O.indexOf(me(P.location));-1!==o&&(O[o]=t),d({action:"REPLACE",location:n})}})},go:S,goBack:function(){return S(-1)},goForward:function(){return S(1)},block:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=p.setPrompt(e);return C||(k(1),C=!0),function(){return C&&(C=!1,k(-1)),t()}},listen:function(e){var t=p.appendListener(e);return k(1),function(){k(-1),t()}}};return P},Te=("function"==typeof Symbol&&Symbol.iterator,Object.assign,Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e});function je(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var Ne=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),u=0;u<o;u++)i[u]=arguments[u];return n=r=je(this,e.call.apply(e,[this].concat(i))),r.state={match:r.computeMatch(r.props.history.location.pathname)},je(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:Te({},this.context.router,{history:this.props.history,route:{location:this.props.history.location,match:this.state.match}})}},t.prototype.computeMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}},t.prototype.componentWillMount=function(){var e=this,t=this.props,n=t.children,r=t.history;g()(null==n||1===o.a.Children.count(n),"A <Router> may have only one child element"),this.unlisten=r.listen(function(){e.setState({match:e.computeMatch(r.location.pathname)})})},t.prototype.componentWillReceiveProps=function(e){ne()(this.props.history===e.history,"You cannot change <Router history>")},t.prototype.componentWillUnmount=function(){this.unlisten()},t.prototype.render=function(){var e=this.props.children;return e?o.a.Children.only(e):null},t}(o.a.Component);Ne.propTypes={history:c.a.object.isRequired,children:c.a.node},Ne.contextTypes={router:c.a.object},Ne.childContextTypes={router:c.a.object.isRequired};var Re=Ne;function De(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var Ie=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),u=0;u<o;u++)i[u]=arguments[u];return n=r=De(this,e.call.apply(e,[this].concat(i))),r.history=Pe(r.props),De(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){ne()(!this.props.history,"<HashRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { HashRouter as Router }`.")},t.prototype.render=function(){return o.a.createElement(Re,{history:this.history,children:this.props.children})},t}(o.a.Component);Ie.propTypes={basename:c.a.string,getUserConfirmation:c.a.func,hashType:c.a.oneOf(["hashbang","noslash","slash"]),children:c.a.node};var Ae=Ie,Ue=n(8),Me=n.n(Ue),Fe={},Le=0,ze=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return"/"===e?e:function(e){var t=e,n=Fe[t]||(Fe[t]={});if(n[e])return n[e];var r=Me.a.compile(e);return Le<1e4&&(n[e]=r,Le++),r}(e)(t,{pretty:!0})},We=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var Be=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){g()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=ve(e.to),n=ve(this.props.to);be(t,n)?ne()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"'):this.perform()},t.prototype.computeTo=function(e){var t=e.computedMatch,n=e.to;return t?"string"==typeof n?ze(n,t.params):We({},n,{pathname:ze(n.pathname,t.params)}):n},t.prototype.perform=function(){var e=this.context.router.history,t=this.props.push,n=this.computeTo(this.props);t?e.push(n):e.replace(n)},t.prototype.render=function(){return null},t}(o.a.Component);Be.propTypes={computedMatch:c.a.object,push:c.a.bool,from:c.a.string,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired},Be.defaultProps={push:!1},Be.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired}).isRequired,staticContext:c.a.object}).isRequired};var $e=Be,Ve=n(22),He=n.n(Ve),qe={},Ke=0,Ye=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments[2];"string"==typeof t&&(t={path:t});var r=t,o=r.path,i=r.exact,u=void 0!==i&&i,a=r.strict,l=void 0!==a&&a,c=r.sensitive,s=void 0!==c&&c;if(null==o)return n;var f=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=qe[n]||(qe[n]={});if(r[e])return r[e];var o=[],i={re:Me()(e,o,t),keys:o};return Ke<1e4&&(r[e]=i,Ke++),i}(o,{end:u,strict:l,sensitive:s}),p=f.re,d=f.keys,h=p.exec(e);if(!h)return null;var m=h[0],y=h.slice(1),v=e===m;return u&&!v?null:{path:o,url:"/"===o&&""===m?"/":m,isExact:v,params:d.reduce(function(e,t,n){return e[t.name]=y[n],e},{})}},Qe=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function Ge(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var Xe=function(e){return 0===o.a.Children.count(e)},Ze=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),u=0;u<o;u++)i[u]=arguments[u];return n=r=Ge(this,e.call.apply(e,[this].concat(i))),r.state={match:r.computeMatch(r.props,r.context.router)},Ge(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:Qe({},this.context.router,{route:{location:this.props.location||this.context.router.route.location,match:this.state.match}})}},t.prototype.computeMatch=function(e,t){var n=e.computedMatch,r=e.location,o=e.path,i=e.strict,u=e.exact,a=e.sensitive;if(n)return n;g()(t,"You should not use <Route> or withRouter() outside a <Router>");var l=t.route,c=(r||l.location).pathname;return Ye(c,{path:o,strict:i,exact:u,sensitive:a},l.match)},t.prototype.componentWillMount=function(){ne()(!(this.props.component&&this.props.render),"You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"),ne()(!(this.props.component&&this.props.children&&!Xe(this.props.children)),"You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"),ne()(!(this.props.render&&this.props.children&&!Xe(this.props.children)),"You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored")},t.prototype.componentWillReceiveProps=function(e,t){ne()(!(e.location&&!this.props.location),'<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),ne()(!(!e.location&&this.props.location),'<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'),this.setState({match:this.computeMatch(e,t.router)})},t.prototype.render=function(){var e=this.state.match,t=this.props,n=t.children,r=t.component,i=t.render,u=this.context.router,a=u.history,l=u.route,c=u.staticContext,s={match:e,location:this.props.location||l.location,history:a,staticContext:c};return r?e?o.a.createElement(r,s):null:i?e?i(s):null:"function"==typeof n?n(s):n&&!Xe(n)?o.a.Children.only(n):null},t}(o.a.Component);Ze.propTypes={computedMatch:c.a.object,path:c.a.string,exact:c.a.bool,strict:c.a.bool,sensitive:c.a.bool,component:c.a.func,render:c.a.func,children:c.a.oneOfType([c.a.func,c.a.node]),location:c.a.object},Ze.contextTypes={router:c.a.shape({history:c.a.object.isRequired,route:c.a.object.isRequired,staticContext:c.a.object})},Ze.childContextTypes={router:c.a.object.isRequired};var Je=Ze,et=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var tt=function(e){var t=function(t){var n=t.wrappedComponentRef,r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["wrappedComponentRef"]);return o.a.createElement(Je,{children:function(t){return o.a.createElement(e,et({},r,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,t.propTypes={wrappedComponentRef:c.a.func},He()(t,e)},nt=function(e){return{type:"RECEIVE_ERRORS",errors:e}},rt=function(e){return{type:"RECEIVE_CURRENT_USER",user:e}},ot=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/users",data:{user:e}})}(e).then(function(e){return t(rt(e))},function(e){t(nt([e.statusText]))})}},it=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/session",data:{user:e}})}(e).then(function(e){return t(rt(e))},function(e){return t(nt(e))})}},ut=function(){return function(e){return $.ajax({method:"DELETE",url:"/api/session"}).then(function(){return e(rt(null))},function(t){return e(nt(t))})}};function at(e){return(at="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function lt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ct(e){return(ct=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function st(e,t){return(st=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function ft(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var pt=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==at(t)&&"function"!=typeof t?ft(e):t}(this,ct(t).call(this,e))).state={email:"",password:""},n.handleSubmit=n.handleSubmit.bind(ft(ft(n))),n.handlePassword=n.handlePassword.bind(ft(ft(n))),n.handleEmail=n.handleEmail.bind(ft(ft(n))),n.demoLogin=n.demoLogin.bind(ft(ft(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&st(e,t)}(t,o.a.Component),function(e,t,n){t&&lt(e.prototype,t),n&&lt(e,n)}(t,[{key:"handleEmail",value:function(e){e.preventDefault(),this.setState({email:e.currentTarget.value})}},{key:"handlePassword",value:function(e){e.preventDefault(),this.setState({password:e.currentTarget.value})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.processForm(this.state).then(function(){t.props.history.push("/feed")})}},{key:"demoLogin",value:function(e){var t=this;e.preventDefault(),this.props.processForm({email:"mufasa@lionking.com",password:"password"}).then(function(){t.props.history.push("/feed")})}},{key:"render",value:function(){return this.props.loggedIn&&o.a.createElement($e,{to:"/feed"}),o.a.createElement("div",{id:"login"},o.a.createElement("h1",null,"disneyBook"),o.a.createElement("form",{id:"login-form"},o.a.createElement("label",null,"Email",o.a.createElement("input",{onChange:this.handleEmail,value:this.state.email})),o.a.createElement("br",null),o.a.createElement("label",null,"Password",o.a.createElement("input",{type:"password",onChange:this.handlePassword,value:this.state.password})),o.a.createElement("button",{onClick:this.handleSubmit},"Log In"),o.a.createElement("button",{onClick:this.demoLogin},"Demo Mufasa")))}}]),t}(),dt=tt(ee(function(e,t){return{loggedIn:Boolean(e.session.currentUser),errors:e.session.errors,formType:"login"}},function(e,t){return{processForm:function(t){return e(it(t))}}})(pt));function ht(e){return(ht="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function mt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function yt(e,t){return!t||"object"!==ht(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function vt(e){return(vt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function bt(e,t){return(bt=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var gt=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),yt(this,vt(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&bt(e,t)}(t,o.a.Component),function(e,t,n){t&&mt(e.prototype,t),n&&mt(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("div",{id:"signup-info-component"},o.a.createElement("h3",null,"Connect with characters from"),o.a.createElement("h3",null,"your movie, and now also"),o.a.createElement("h3",null,"from other disney movies!"),o.a.createElement("p",null,"See their photos and updates"),o.a.createElement("p",null,"See whats new"),o.a.createElement("p",null,"Find more characters!"))}}]),t}();function wt(e){return(wt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Et(e){return(Et=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Ot(e,t){return(Ot=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function St(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var xt=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==wt(t)&&"function"!=typeof t?St(e):t}(this,Et(t).call(this,e))).state={email:"",password:"",name:"",movie:""},n.handleSubmit=n.handleSubmit.bind(St(St(n))),n.handlePassword=n.handlePassword.bind(St(St(n))),n.handleEmail=n.handleEmail.bind(St(St(n))),n.handleName=n.handleName.bind(St(St(n))),n.handleMovie=n.handleMovie.bind(St(St(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Ot(e,t)}(t,o.a.Component),function(e,t,n){t&&_t(e.prototype,t),n&&_t(e,n)}(t,[{key:"handleEmail",value:function(e){e.preventDefault(),this.setState({email:e.currentTarget.value})}},{key:"handleName",value:function(e){e.preventDefault(),this.setState({name:e.currentTarget.value})}},{key:"handleMovie",value:function(e){e.preventDefault(),this.setState({movie:e.currentTarget.value})}},{key:"handlePassword",value:function(e){e.preventDefault(),this.setState({password:e.currentTarget.value})}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.processForm(this.state)}},{key:"render",value:function(){return this.props.loggedIn&&o.a.createElement($e,{to:"/feed"}),o.a.createElement("div",{id:"signup-info"},o.a.createElement(gt,null),o.a.createElement("div",{id:"signup-form"},o.a.createElement("h1",null,"Sign Up"),o.a.createElement("h4",null,"It's free and always will be"),o.a.createElement("form",{id:"sign-up-form"},o.a.createElement("input",{onChange:this.handleName,value:this.state.name,placeholder:" Name",id:"name-input"}),o.a.createElement("br",null),o.a.createElement("input",{onChange:this.handleMovie,value:this.state.movie,placeholder:" Movie",id:"movie-input"}),o.a.createElement("br",null),o.a.createElement("input",{onChange:this.handleEmail,value:this.state.email,placeholder:" Email",id:"email-input"}),o.a.createElement("br",null),o.a.createElement("input",{onChange:this.handlePassword,value:this.state.password,placeholder:" Password",id:"password-input"}),o.a.createElement("br",null),o.a.createElement("div",{id:"disclaimer"},o.a.createElement("p",null,"By clicking Create Account, you agree that although your"),o.a.createElement("p",null,"character may be a villain, you, in real life are not. If you"),o.a.createElement("p",null,"are found in violation of this you will be kicked off our site.")),o.a.createElement("button",{onClick:this.handleSubmit},"Create Account"))))}}]),t}(),kt=tt(ee(function(e,t){return{loggedIn:Boolean(e.session.currentUser),errors:e.session.errors,formType:"signup"}},function(e,t){return{processForm:function(t){return e(ot(t))}}})(xt));function Ct(e){return(Ct="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Pt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Tt(e,t){return!t||"object"!==Ct(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function jt(e){return(jt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Nt(e,t){return(Nt=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Rt=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Tt(this,jt(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Nt(e,t)}(t,o.a.Component),function(e,t,n){t&&Pt(e.prototype,t),n&&Pt(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("ul",{id:"footer-links"},o.a.createElement("a",{href:"http://movies.disney.com/all-movies"},"All Movies"),o.a.createElement("a",{href:"https://www.google.com/"},"Google Search"),o.a.createElement("a",{href:"https://www.google.com/search?q=best+disney+movies&oq=best+disney+movies&aqs=chrome.0.0l6.2691j0j4&sourceid=chrome&ie=UTF-8"},"Most Popular"),o.a.createElement("a",{href:"http://www.imdb.com/list/ls000422381/"},"Top 100"))}}]),t}(),Dt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function It(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var At=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},Ut=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),u=0;u<o;u++)i[u]=arguments[u];return n=r=It(this,e.call.apply(e,[this].concat(i))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!At(e)){e.preventDefault();var t=r.context.router.history,n=r.props,o=n.replace,i=n.to;o?t.replace(i):t.push(i)}},It(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),n=e.innerRef,r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["replace","to","innerRef"]);g()(this.context.router,"You should not use <Link> outside a <Router>"),g()(void 0!==t,'You must specify the "to" property');var i=this.context.router.history,u="string"==typeof t?ve(t,null,null,i.location):t,a=i.createHref(u);return o.a.createElement("a",Dt({},r,{onClick:this.handleClick,href:a,ref:n}))},t}(o.a.Component);Ut.propTypes={onClick:c.a.func,target:c.a.string,replace:c.a.bool,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired,innerRef:c.a.oneOfType([c.a.string,c.a.func])},Ut.defaultProps={replace:!1},Ut.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired,createHref:c.a.func.isRequired}).isRequired}).isRequired};var Mt=Ut;function Ft(e){return(Ft="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Lt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function zt(e){return(zt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Wt(e,t){return(Wt=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Bt(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var $t=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Ft(t)&&"function"!=typeof t?Bt(e):t}(this,zt(t).call(this,e))).handleLogout=n.handleLogout.bind(Bt(Bt(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Wt(e,t)}(t,o.a.Component),function(e,t,n){t&&Lt(e.prototype,t),n&&Lt(e,n)}(t,[{key:"handleLogout",value:function(){this.props.logout().then(this.props.hideDropdown)}},{key:"render",value:function(){return o.a.createElement("div",{id:"nav-bar-actions"},o.a.createElement("ul",null,o.a.createElement("li",null,o.a.createElement("button",{onClick:this.handleLogout},"Logout"))))}}]),t}(),Vt=tt(ee(null,function(e,t){return{hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})},logout:function(){return e(ut())}}})($t)),Ht=function(e){return{type:"RECEIVE_USERS",users:e}},qt=function(e){return{type:"RECEIVE_USER",user:e}},Kt=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"/api/users/".concat(e.id)})}(e).then(function(e){return t(qt(e))},function(e){return t(nt(e))})}},Yt=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"/api/search/".concat(e)})}(e).then(function(e){return t(function(e){return{type:"RECEIVE_SEACH_RESULTS",users:e}}(e))},function(e){return t(nt(e))})}},Qt=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/friendships",data:e})}(e).then(function(e){t(Ht(e.acceptedFriendIds)),t(Ht(e.pendingFriendIds)),t(rt(e))})}},Gt=function(e){return function(t){return function(e){return $.ajax({method:"PATCH",url:"/api/friendships/".concat(e.id),data:{friendship:{friendee_id:e.id}}})}(e).then(function(e){return t(rt(e))})}};function Xt(e){return(Xt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Zt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Jt(e){return(Jt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function en(e,t){return(en=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function tn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var nn=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Xt(t)&&"function"!=typeof t?tn(e):t}(this,Jt(t).call(this,e))).state={hello:"hello"},n.acceptFriend=n.acceptFriend.bind(tn(tn(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&en(e,t)}(t,o.a.Component),function(e,t,n){t&&Zt(e.prototype,t),n&&Zt(e,n)}(t,[{key:"acceptFriend",value:function(e,t){e.preventDefault(),this.props.acceptFriendship(t)}},{key:"render",value:function(){var e,t,n=this,r=this.props.pendingFriendIds;return r?(t=r.length,e=r.map(function(e){var t=n.props.users[parseInt(e)];return o.a.createElement("li",{key:t.id},o.a.createElement("img",{src:t.profilePic}),o.a.createElement(Mt,{to:"/users/".concat(t.id),onClick:n.props.hideDropdown},o.a.createElement("p",null,t.name," from ",t.movie)),o.a.createElement("button",{onClick:function(e){return n.acceptFriend(e,t)}},"Accept"))})):(e=null,t=0),o.a.createElement("div",null,o.a.createElement("ul",{id:"pending-friends"},o.a.createElement("p",{className:"pending-p-tag"},"You have ",t," pending requests!"),e))}}]),t}(),rn=tt(ee(function(e,t){return{pendingFriendIds:e.entities.users[e.session.currentUser.id].pendingFriendIds,users:e.entities.users}},function(e,t){return{hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})},acceptFriendship:function(t){return e(Gt(t))}}})(nn));function on(e){return(on="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function un(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function an(e,t){return!t||"object"!==on(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function ln(e){return(ln=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function cn(e,t){return(cn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var sn=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),an(this,ln(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&cn(e,t)}(t,o.a.Component),function(e,t,n){t&&un(e.prototype,t),n&&un(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"user-item"},o.a.createElement("img",{src:this.props.user.profilePic}),o.a.createElement(Mt,{to:"/users/".concat(this.props.user.id)},this.props.user.name))}}]),t}();function fn(e){return(fn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function pn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function dn(e,t){return!t||"object"!==fn(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function hn(e){return(hn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function mn(e,t){return(mn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var yn=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),dn(this,hn(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&mn(e,t)}(t,o.a.Component),function(e,t,n){t&&pn(e.prototype,t),n&&pn(e,n)}(t,[{key:"render",value:function(){var e=Object.values(this.props.users);if(e.length<1)return null;var t=e.map(function(e,t){return o.a.createElement("li",{key:t},o.a.createElement(sn,{user:e}))});return o.a.createElement("div",{className:"searched-users"},o.a.createElement("ul",{className:"users-list"},t))}}]),t}();function vn(e){return(vn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function bn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function gn(e){return(gn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function wn(e,t){return(wn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _n(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var En=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==vn(t)&&"function"!=typeof t?_n(e):t}(this,gn(t).call(this,e))).state={search:""},n.showActionsContainer=n.showActionsContainer.bind(_n(_n(n))),n.showPendingRequests=n.showPendingRequests.bind(_n(_n(n))),n.handleSearchInput=n.handleSearchInput.bind(_n(_n(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&wn(e,t)}(t,o.a.Component),function(e,t,n){t&&bn(e.prototype,t),n&&bn(e,n)}(t,[{key:"handleSearchInput",value:function(e){var t=this;""===e.currentTarget.value?this.props.hideDropdown():this.setState({search:e.currentTarget.value},function(){return t.props.fetchSearchedUsers(t.state.search).then(function(){t.props.showDropdown(o.a.createElement(yn,{users:t.props.searchedUsers}))})})}},{key:"showActionsContainer",value:function(e){e.stopPropagation(),this.props.showDropdown(o.a.createElement(Vt,null))}},{key:"showPendingRequests",value:function(e){e.stopPropagation(),this.props.showDropdown(o.a.createElement(rn,null))}},{key:"render",value:function(){var e,t;return this.props.currentUser?(e=o.a.createElement(Mt,{to:"/users/".concat(this.props.currentUser.id)},this.props.currentUser.name),t=o.a.createElement(Mt,{to:"/users/".concat(this.props.currentUser.id)},o.a.createElement("img",{src:this.props.currentUser.profilePic}))):(e=null,t=null),o.a.createElement("div",{className:"nav-bar"},o.a.createElement("form",{id:"search-form"},o.a.createElement("input",{onChange:this.handleSearchInput,placeholder:"Search Users"}),o.a.createElement("i",{className:"fa fa-search","aria-hidden":"true"})),o.a.createElement("div",null,o.a.createElement("div",{id:"nav-bar-welcome-logout"},t,o.a.createElement("div",{className:"user-pic-name-and-home"},o.a.createElement("p",{className:"user-name"},e),o.a.createElement("p",{className:"home-link"},o.a.createElement(Mt,{to:"/feed"},"Home"))),o.a.createElement("div",{id:"nav-bar-icons"},o.a.createElement("div",{id:"first-three-icons"},o.a.createElement("i",{className:"fa fa-users","aria-hidden":"true",onClick:this.showPendingRequests}),o.a.createElement("i",{className:"fa fa-comments","aria-hidden":"true"}),o.a.createElement("i",{className:"fa fa-globe","aria-hidden":"true"})),o.a.createElement("div",{className:"question-icon-and-options"},o.a.createElement("i",{className:"fa fa-question","aria-hidden":"true",id:"question"}),o.a.createElement("i",{className:"fa fa-bars","aria-hidden":"true",onClick:this.showActionsContainer}))))))}}]),t}(),On=tt(ee(function(e,t){return{currentUser:e.entities.users[e.session.currentUser.id],searchedUsers:e.entities.search}},function(e,t){return{hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})},showDropdown:function(t){return e(function(e){return{type:"SHOW_DROPDOWN",component:e}}(t))},fetchSearchedUsers:function(t){return e(Yt(t))}}})(En)),Sn=function(){return o.a.createElement(On,null)},xn=function(e){return{type:"RECEIVE_POST",post:e}},kn=function(e){var t=e.body,n=e.receiverId;return function(e){return function(e){return $.ajax({method:"POST",url:"/api/posts",data:{post:e}})}({receiver_id:n,body:t}).then(function(t){return e(xn(t))},function(t){return e(nt(t))})}},Cn=function(e){return function(t){return function(e){return $.ajax({method:"PATCH",url:"/api/posts/".concat(e.id),data:e})}(e).then(function(e){return t(function(e){return{type:"UPDATE_POST",post:e}}(e))},function(e){return t(nt(e))})}},Pn=function(e){return function(t){return function(e){return $.ajax({method:"DELETE",url:"/api/posts/".concat(e.id)})}(e).then(function(e){return t(function(e){return{type:"DELETE_POST",post:e}}(e))},function(e){return t(nt(e))})}},Tn=function(){return function(e){return $.ajax({method:"GET",url:"/api/posts"}).then(function(t){return e(function(e){return{type:"RECEIVE_POSTS",posts:e.posts,users:e.users}}(t))},function(t){return e(nt(t))})}},jn=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"/api/posts/".concat(e.id)})}(e).then(function(e){return t(xn(e))},function(e){return t(nt(e))})}};function Nn(e){return(Nn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Rn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Dn(e){return(Dn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function In(e,t){return(In=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function An(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var Un=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Nn(t)&&"function"!=typeof t?An(e):t}(this,Dn(t).call(this,e))).state={body:"",receiverId:null},n.handleSubmit=n.handleSubmit.bind(An(An(n))),n.handleChange=n.handleChange.bind(An(An(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&In(e,t)}(t,o.a.Component),function(e,t,n){t&&Rn(e.prototype,t),n&&Rn(e,n)}(t,[{key:"componentDidMount",value:function(){var e=this.props,t=e.user?e.currentUser:e.user;this.setState({receiverId:t.id})}},{key:"componentDidUpdate",value:function(e){var t=parseInt(e.match.params.userId);this.state.receiverId!==t&&t>0&&this.setState({receiverId:t})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.create(this.state).then(function(){return t.setState({body:""})})}},{key:"handleChange",value:function(e){e.preventDefault(),this.setState(Object.assign({},this.state,{body:e.target.value}))}},{key:"render",value:function(){return this.props.currentUser?o.a.createElement("form",{onSubmit:this.handleSubmit,className:"create-post"},o.a.createElement("textarea",{placeholder:"What's on your mind, ".concat(this.props.currentUser.name,"?"),height:"100",width:"500",value:this.state.body,onChange:this.handleChange}),o.a.createElement("button",null,"Post")):o.a.createElement("p",null,"Loading...")}}]),t}(),Mn=tt(ee(function(e,t){return{currentUser:e.session.currentUser||{},user:e.entities.users[t.match.params.userId]||e.session.currentUser}},function(e,t){return{create:function(t){return e(kn(t))}}})(Un));function Fn(e){return(Fn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Ln(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function zn(e){return(zn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Wn(e,t){return(Wn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Bn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var $n=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Fn(t)&&"function"!=typeof t?Bn(e):t}(this,zn(t).call(this,e))).handleEdit=n.handleEdit.bind(Bn(Bn(n))),n.handleChange=n.handleChange.bind(Bn(Bn(n))),n.state={comment:n.props.comment},n.modalClose=n.modalClose.bind(Bn(Bn(n))),n.handleDelete=n.handleDelete.bind(Bn(Bn(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Wn(e,t)}(t,o.a.Component),function(e,t,n){t&&Ln(e.prototype,t),n&&Ln(e,n)}(t,[{key:"handleDelete",value:function(){var e=this;this.props.deleteComment(this.state.comment).then(function(){e.modalClose()})}},{key:"handleEdit",value:function(){var e=this;this.props.updateComment(this.state).then(function(){e.modalClose()})}},{key:"modalClose",value:function(){this.props.hideModal()}},{key:"handleChange",value:function(e){var t=this;return function(n){var r=Object.assign({},t.state.comment,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},e,n.currentTarget.value));t.setState({comment:r})}}},{key:"render",value:function(){return o.a.createElement("div",{className:"edit-comment"},o.a.createElement("div",{className:"edit-comment-label"},o.a.createElement("label",null,"Edit"),o.a.createElement("button",{onClick:this.modalClose},"X")),o.a.createElement("form",{onSubmit:this.handleEdit},o.a.createElement("textarea",{value:this.state.comment.body,onChange:this.handleChange("body")}),o.a.createElement("button",null,"Save")),o.a.createElement("button",{onClick:this.handleDelete},"Delete"))}}]),t}(),Vn=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/comments",data:{comment:e}})}(e).then(function(e){return t(function(e){return{type:"RECEIVE_COMMENT",comment:e}}(e))},function(e){return t(nt(e))})}},Hn=function(e){return function(t){return function(e){return $.ajax({method:"PATCH",url:"/api/comments/".concat(e.id),data:e})}(e).then(function(e){return t(function(e){return{type:"UPDATE_COMMENT",comment:e}}(e))},function(e){return t(nt(e))})}},qn=function(e){return function(t){return function(e){return $.ajax({method:"DELETE",url:"/api/comments/".concat(e.id)})}(e).then(function(e){return t(function(e){return{type:"DELETE_COMMENT",comment:e}}(e))},function(e){return t(nt(e))})}},Kn=function(){return function(e){return $.ajax({method:"GET",url:"/api/comments"}).then(function(t){return e(function(e){return{type:"RECEIVE_COMMENTS",comments:e.comments,users:e.users}}(t))},function(t){return e(nt(t))})}},Yn=function(e){return{type:"SHOW_MODAL",component:e}};function Qn(e){return(Qn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Gn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Xn(e){return(Xn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Zn(e,t){return(Zn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Jn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var er=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Qn(t)&&"function"!=typeof t?Jn(e):t}(this,Xn(t).call(this,e))).handleModal=n.handleModal.bind(Jn(Jn(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Zn(e,t)}(t,o.a.Component),function(e,t,n){t&&Gn(e.prototype,t),n&&Gn(e,n)}(t,[{key:"handleModal",value:function(){this.props.showModal(o.a.createElement($n,{comment:this.props.comment,hideModal:this.props.hideModal,updateComment:this.props.updateComment,deleteComment:this.props.deleteComment,fetchPost:this.props.fetchPost,fetchAllComments:this.props.fetchAllComments}))}},{key:"render",value:function(){if(!this.props.comment)return null;var e;e=this.props.currentUser.id===this.props.comment.author_id?o.a.createElement("button",{onClick:this.handleModal},"…"):null;var t=this.props.users[this.props.comment.author_id];return t?o.a.createElement("div",{className:"comment"},o.a.createElement("div",{id:"comment-author"},o.a.createElement("div",{id:"comment-author-pic-and-name"},o.a.createElement("img",{src:t.profilePic}),o.a.createElement(Mt,{to:"/users/".concat(t.id)},t.name),o.a.createElement("p",{className:"comment-body"},this.props.comment.body)),e)):o.a.createElement("p",null,"Loading...")}}]),t}(),tr=tt(ee(function(e,t){return{currentUser:e.session.currentUser||{},comment:t.comment,users:e.entities.users}},function(e,t){return{updateComment:function(t){return e(Hn(t))},deleteComment:function(t){return e(qn(t))},showModal:function(t){return e(Yn(t))},hideModal:function(){return e({type:"HIDE_MODAL"})},fetchPost:function(t){return e(jn(t))},fetchAllComments:function(){return e(Kn())}}})(er));function nr(e){return(nr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function rr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function or(e){return(or=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function ir(e,t){return(ir=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function ur(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var ar=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==nr(t)&&"function"!=typeof t?ur(e):t}(this,or(t).call(this,e))).handleEdit=n.handleEdit.bind(ur(ur(n))),n.handleChange=n.handleChange.bind(ur(ur(n))),n.state={post:n.props.post},n.modalClose=n.modalClose.bind(ur(ur(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ir(e,t)}(t,o.a.Component),function(e,t,n){t&&rr(e.prototype,t),n&&rr(e,n)}(t,[{key:"componentDidMount",value:function(){this.props.hideDropdown()}},{key:"handleEdit",value:function(){var e=this;this.props.updatePost(this.state).then(function(){e.modalClose()})}},{key:"modalClose",value:function(){this.props.hideModal()}},{key:"handleChange",value:function(e){var t=this;return function(n){var r=Object.assign({},t.state.post,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},e,n.currentTarget.value));t.setState({post:r})}}},{key:"render",value:function(){return o.a.createElement("div",{className:"edit-post"},o.a.createElement("div",{className:"edit-post-label"},o.a.createElement("label",null,"Edit Post"),o.a.createElement("button",{onClick:this.modalClose},"X")),o.a.createElement("form",{onSubmit:this.handleEdit},o.a.createElement("textarea",{value:this.state.post.body,onChange:this.handleChange("body")}),o.a.createElement("button",null,"Save")))}}]),t}(),lr=tt(ee(function(e,t){return{post:t.post}},function(e,t){return{updatePost:function(t){return e(Cn(t))},hideModal:function(){return e({type:"HIDE_MODAL"})},hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})}}})(ar));function cr(e){return(cr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function sr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function fr(e){return(fr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function pr(e,t){return(pr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function dr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var hr=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==cr(t)&&"function"!=typeof t?dr(e):t}(this,fr(t).call(this,e))).handleDelete=n.handleDelete.bind(dr(dr(n))),n.handleEdit=n.handleEdit.bind(dr(dr(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&pr(e,t)}(t,o.a.Component),function(e,t,n){t&&sr(e.prototype,t),n&&sr(e,n)}(t,[{key:"handleDelete",value:function(){this.props.deletePost(this.props.post).then(this.props.hideDropdown)}},{key:"handleEdit",value:function(){this.props.showModal(o.a.createElement(lr,{post:this.props.post,updatePost:this.props.updatePost}))}},{key:"render",value:function(){var e=o.a.createElement("p",null,"no actions");return this.props.post.author_id===this.props.currentUser.id&&(e=o.a.createElement("ul",{id:"post-options"},o.a.createElement("li",{onClick:this.handleDelete},o.a.createElement("button",null,"Delete")),o.a.createElement("li",{onClick:this.handleEdit},o.a.createElement("button",null,"Edit")))),o.a.createElement("div",{className:"post-action-options"},e)}}]),t}(),mr=tt(ee(function(e,t){return{currentUser:e.session.currentUser||{},post:t.post}},function(e,t){return{deletePost:function(t){return e(Pn(t))},updatePost:function(t){return e(Cn(t))},showModal:function(t){return e(Yn(t))},hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})}}})(hr));function yr(e){return(yr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function vr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function br(e){return(br=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function gr(e,t){return(gr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function wr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var _r=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==yr(t)&&"function"!=typeof t?wr(e):t}(this,br(t).call(this,e))).state={body:"",post_id:e.post.id},n.handleSubmit=n.handleSubmit.bind(wr(wr(n))),n.handleChange=n.handleChange.bind(wr(wr(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&gr(e,t)}(t,o.a.Component),function(e,t,n){t&&vr(e.prototype,t),n&&vr(e,n)}(t,[{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.createComment(this.state).then(function(){t.props.fetchPost(t.props.post).then(function(){t.setState({body:""})})})}},{key:"handleChange",value:function(e){e.preventDefault(),this.setState(Object.assign({},this.state,{body:e.target.value}))}},{key:"render",value:function(){var e="Any thoughts, ".concat(this.props.currentUser.name,"?");return o.a.createElement("div",{id:"create-comment-all"},o.a.createElement("form",{onSubmit:this.handleSubmit,id:"create-comment"},o.a.createElement("textarea",{height:"80",width:"400",id:"create-comment-textarea-".concat(this.props.post.id),placeholder:e,value:this.state.body,onChange:this.handleChange,onSubmit:this.handleSubmit}),o.a.createElement("button",null,"Comment")))}}]),t}(),Er=tt(ee(function(e,t){return{currentUser:e.session.currentUser,post:t.post}},function(e,t){return{createComment:function(t){return e(Vn(t))},fetchPost:function(t){return e(jn(t))}}})(_r)),Or=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/likes",data:e})}(e).then(function(e){return t(function(e){return{type:"RECEIVE_LIKE",like:e}}(e))},function(e){return t(nt(e))})}},Sr=function(e){return function(t){return function(e){return $.ajax({method:"DELETE",url:"/api/likes/".concat(e.post_id),data:e})}(e).then(function(e){return t(function(e){return{type:"REMOVE_LIKE",like:e}}(e))},function(e){return t(nt(e))})}};function xr(e){return(xr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function kr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Cr(e){return(Cr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Pr(e,t){return(Pr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Tr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var jr=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==xr(t)&&"function"!=typeof t?Tr(e):t}(this,Cr(t).call(this,e))).handleDelete=n.handleDelete.bind(Tr(Tr(n))),n.commentFocus=n.commentFocus.bind(Tr(Tr(n))),n.handleDropdown=n.handleDropdown.bind(Tr(Tr(n))),n.handleLikeToggle=n.handleLikeToggle.bind(Tr(Tr(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Pr(e,t)}(t,o.a.Component),function(e,t,n){t&&kr(e.prototype,t),n&&kr(e,n)}(t,[{key:"handleDelete",value:function(){this.props.deletePost(this.props.post)}},{key:"handleLikeToggle",value:function(){this.props.post.currentUserLikes?this.props.deleteLike({post_id:this.props.post.id,liker_id:this.props.currentUser.id}):this.props.createLike({post:this.props.post})}},{key:"handleDropdown",value:function(e){e.stopPropagation(),this.props.displayDropdown(this.props.post.id)}},{key:"commentFocus",value:function(){document.getElementById("create-comment-textarea-".concat(this.props.post.id)).focus({preventScroll:!0})}},{key:"render",value:function(){var e,t=this;if(this.props.post.comments.length>0)if(Object.keys(this.props.comments).length<1)e=null;else{var n=this;e=this.props.post.comments.map(function(e){return o.a.createElement(tr,{key:e,comment:t.props.comments[e],post:n.props.post})})}else e=null;if(!this.props.post)return o.a.createElement("p",null,"Loading...");if(!this.props.users[this.props.post.author_id])return o.a.createElement("p",null,"Loading...");if(!this.props.users[this.props.post.receiver_id])return o.a.createElement("p",null,"Loading...");var r,i=this.props.users[this.props.post.author_id];return r=this.props.post.author_id===this.props.post.receiver_id?null:o.a.createElement(Mt,{to:"/users/".concat(this.props.post.receiver_id)},"> ".concat(this.props.users[this.props.post.receiver_id].name)),o.a.createElement("div",{className:"post-item"},o.a.createElement("div",{className:"post-author-info"},o.a.createElement("div",{id:"author-pic-and-name"},o.a.createElement("img",{src:i.profilePic,sizes:"(max-height: 40px; max-width: 40px;)"}),o.a.createElement(Mt,{to:"/users/".concat(i.id)},"".concat(i.name," >")),r),o.a.createElement("button",{onClick:this.handleDropdown},"ˇ"),this.props.dropdownVisible?o.a.createElement(mr,{post:this.props.post,updatePost:this.props.updatePost.bind(this)}):null),o.a.createElement("br",null),o.a.createElement("div",{id:"post-body"},this.props.post.body),o.a.createElement("div",{id:"create-comment-icons"},o.a.createElement("div",{className:"icons-create-comment",onClick:this.handleLikeToggle},o.a.createElement("p",null,this.props.post.likes.length),o.a.createElement("i",{className:"fa fa-thumbs-up","aria-hidden":"true"}),o.a.createElement("p",null,"Like")),o.a.createElement("div",{className:"icons-create-comment",onClick:this.commentFocus},o.a.createElement("i",{className:"fa fa-comment","aria-hidden":"true"}),o.a.createElement("p",null,"Comment"))),o.a.createElement("ul",null,e),o.a.createElement(Er,{post:this.props.post}))}}]),t}(),Nr=tt(ee(function(e,t){return{dropdownVisible:e.ui.dropdowns.displayed===t.post.id,currentUser:e.session.currentUser||{},comments:e.entities.comments,posts:e.entities.posts,users:e.entities.users,post:t.post}},function(e,t){return{deletePost:function(t){return e(Pn(t))},updatePost:function(t){return e(Cn(t))},createLike:function(t){return e(Or(t))},deleteLike:function(t){return e(Sr(t))},displayDropdown:function(t){return e(function(e){return{type:"DISPLAY_DROPDOWN",displayed:e}}(t))}}})(jr));function Rr(e){return(Rr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Dr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Ir(e,t){return!t||"object"!==Rr(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Ar(e){return(Ar=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Ur(e,t){return(Ur=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Mr=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Ir(this,Ar(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Ur(e,t)}(t,o.a.Component),function(e,t,n){t&&Dr(e.prototype,t),n&&Dr(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("div",{id:"left-info-component"},o.a.createElement("p",null,"Top Movies"),o.a.createElement("a",{href:"http://www.imdb.com/title/tt0110357/awards"},"Lion King"),o.a.createElement("a",{href:"http://www.imdb.com/title/tt0103639/awards"},"Aladdin"),o.a.createElement("a",{href:"http://www.imdb.com/title/tt0101414/awards"},"Beauty and the Beast"))}}]),t}();function Fr(e){return(Fr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Lr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function zr(e,t){return!t||"object"!==Fr(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Wr(e){return(Wr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Br(e,t){return(Br=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var $r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),zr(this,Wr(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Br(e,t)}(t,o.a.Component),function(e,t,n){t&&Lr(e.prototype,t),n&&Lr(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("div",{id:"right-info-component"},o.a.createElement("div",{className:"linkedIn"},o.a.createElement("i",{className:"fa fa-linkedin-square","aria-hidden":"true"},o.a.createElement("a",{href:"https://www.linkedin.com/in/matthew-duek-51489657"}))),o.a.createElement("div",{className:"github"},o.a.createElement("i",{className:"fa fa-github","aria-hidden":"true"},o.a.createElement("a",{href:"https://github.com/mashuDuek"}))))}}]),t}();function Vr(e){return(Vr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Hr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function qr(e){return(qr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Kr(e,t){return(Kr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Yr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var Qr=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Vr(t)&&"function"!=typeof t?Yr(e):t}(this,qr(t).call(this,e))).handleDropdown=n.handleDropdown.bind(Yr(Yr(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Kr(e,t)}(t,o.a.Component),function(e,t,n){t&&Hr(e.prototype,t),n&&Hr(e,n)}(t,[{key:"handleDropdown",value:function(){this.props.dropdownOpen&&this.props.hideDropdown()}},{key:"componentDidMount",value:function(){this.props.fetchAllPosts(),this.props.fetchAllComments()}},{key:"render",value:function(){var e=this;if(Object.keys(this.props.posts).length<1)return o.a.createElement("p",null,"Loading posts...");var t=this.props.currentUser.acceptedFriendIds,n=Object.values(this.props.posts).reverse().map(function(n){return t.includes(n.author_id)||n.author_id===e.props.currentUser.id||n.receiver_id===e.props.currentUser.id?o.a.createElement("li",{key:n.id,className:"individual-post"},o.a.createElement(Nr,{post:n})):null});return o.a.createElement("div",{className:"posts-and-info-components",onClick:this.handleDropdown},o.a.createElement(Mr,null),o.a.createElement("div",{className:"create-post-all-posts"},o.a.createElement(Mn,null),o.a.createElement("ul",{className:"all-posts-ul"},n)),o.a.createElement($r,null))}}]),t}(),Gr=tt(ee(function(e,t){return{currentUser:e.session.currentUser||{},posts:e.entities.posts,dropdownOpen:Boolean(e.ui.dropdowns.displayed)}},function(e,t){return{hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})},fetchAllComments:function(){return e(Kn())},fetchAllPosts:function(){return e(Tn())}}})(Qr));function Xr(e){return(Xr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Zr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Jr(e,t){return!t||"object"!==Xr(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function eo(e){return(eo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function to(e,t){return(to=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var no=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Jr(this,eo(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&to(e,t)}(t,o.a.Component),function(e,t,n){t&&Zr(e.prototype,t),n&&Zr(e,n)}(t,[{key:"render",value:function(){return this.props.component?o.a.createElement("div",{id:"modal-backdrop",className:"modal-backdrop",onClick:this.props.hide},o.a.createElement("div",{className:"modal",onClick:function(e){return e.stopPropagation()}},this.props.component)):null}}]),t}(),ro=tt(ee(function(e,t){return{component:e.ui.modals.component}},function(e,t){return{hide:function(){return e({type:"HIDE_MODAL"})}}})(no));function oo(e){return(oo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function io(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function uo(e,t){return!t||"object"!==oo(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function ao(e){return(ao=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function lo(e,t){return(lo=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var co=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),uo(this,ao(t).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&lo(e,t)}(t,o.a.Component),function(e,t,n){t&&io(e.prototype,t),n&&io(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"pic-modal-wrapper"},o.a.createElement("div",{className:"edit-profile-pic"},o.a.createElement("img",{src:this.props.user.profilePic})))}}]),t}();function so(e){return(so="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function fo(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function po(e){return(po=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function ho(e,t){return(ho=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function mo(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var yo=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==so(t)&&"function"!=typeof t?mo(e):t}(this,po(t).call(this,e))).state={imageUrl:null,imageFile:null,displayInput:!1},n.handleUpdateCover=n.handleUpdateCover.bind(mo(mo(n))),n.handleSubmit=n.handleSubmit.bind(mo(mo(n))),n.handleInput=n.handleInput.bind(mo(mo(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ho(e,t)}(t,o.a.Component),function(e,t,n){t&&fo(e.prototype,t),n&&fo(e,n)}(t,[{key:"handleUpdateCover",value:function(e){this.setState({displayInput:!this.state.displayInput})}},{key:"handleSubmit",value:function(){var e=this,t=this.state.imageFile,n=new FormData;n.append("user[id]",this.props.user.id),t&&n.append("user[profile_pic]",t),this.props.updateCover(n).then(function(){e.props.hideModal()})}},{key:"handleInput",value:function(e){var t=this,n=new FileReader,r=e.currentTarget.files[0];n.onloadend=function(){return t.setState({imageUrl:n.result,imageFile:r})},r?n.readAsDataURL(r):this.setState({imageUrl:"",imageFile:null})}},{key:"render",value:function(){var e,t;return e=this.state.displayInput?o.a.createElement("form",{onSubmit:this.handleSubmit},o.a.createElement("input",{type:"file",onChange:this.handleInput}),o.a.createElement("button",null,"Change Your Pic")):null,t=this.state.imageUrl?o.a.createElement("img",{src:this.state.imageUrl}):o.a.createElement("img",{src:this.props.user.profilePic}),o.a.createElement("div",{className:"pic-modal-wrapper"},t,o.a.createElement("div",{className:"form-and-button-edit-image"},o.a.createElement("button",{onClick:this.handleUpdateCover},"Edit Profile Pic"),e))}}]),t}(),vo=function(e){return function(t){return function(e){return $.ajax({method:"PATCH",processData:!1,contentType:!1,url:"/api/users/".concat(parseInt(e.get("user[id]"))),data:e})}(e).then(function(e){return t(qt(e))})}};function bo(e){return(bo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function go(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function wo(e){return(wo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _o(e,t){return(_o=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Eo(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var Oo=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==bo(t)&&"function"!=typeof t?Eo(e):t}(this,wo(t).call(this,e))).state={hover:!1},n.handleProfileModal=n.handleProfileModal.bind(Eo(Eo(n))),n.handleShowButton=n.handleShowButton.bind(Eo(Eo(n))),n.handleHideButton=n.handleHideButton.bind(Eo(Eo(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_o(e,t)}(t,o.a.Component),function(e,t,n){t&&go(e.prototype,t),n&&go(e,n)}(t,[{key:"handleShowButton",value:function(){this.props.user.id===this.props.currentUser.id?this.setState({hover:!0}):this.setState({hover:"friend"})}},{key:"handleProfileModal",value:function(e){this.props.user.id===this.props.currentUser.id?this.props.showModal(o.a.createElement(yo,{user:this.props.user,currentUser:this.props.currentUser,updateCover:this.props.updateCover,hideModal:this.props.hideModal})):this.props.showModal(o.a.createElement(co,{user:this.props.user,currentUser:this.props.currentUser,updateCover:this.props.updateCover}))}},{key:"handleHideButton",value:function(){this.setState({hover:!1})}},{key:"render",value:function(){var e;return this.props.user||o.a.createElement("p",null,"Loading..."),e=this.state.hover?(this.state.hover,o.a.createElement("div",{className:"icon-edit-profile",onClick:this.handleProfileModal},o.a.createElement("i",{className:"fa fa-camera",id:"camera-icon","aria-hidden":"true"}))):null,o.a.createElement("div",null,o.a.createElement("div",{id:"profile-photo",onMouseLeave:this.handleHideButton},e,o.a.createElement("img",{onMouseEnter:this.handleShowButton,onClick:this.handleProfileModal,src:this.props.user.profilePic})))}}]),t}(),So=tt(ee(function(e,t){return{user:e.entities.users[t.match.params.userId],currentUser:e.session.currentUser||{}}},function(e,t){return{showModal:function(t){return e(Yn(t))},hideModal:function(){return e({type:"HIDE_MODAL"})},updateCover:function(t){return e(vo(t))}}})(Oo)),xo=n(23),ko=n.n(xo);function Co(e){return(Co="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Po(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function To(e,t){return!t||"object"!==Co(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function jo(e){return(jo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function No(e,t){return(No=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Ro=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),To(this,jo(t).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&No(e,t)}(t,o.a.Component),function(e,t,n){t&&Po(e.prototype,t),n&&Po(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"profile-user-info"},this.props.user.name,o.a.createElement("p",null,"I acted in: ",this.props.user.movie),o.a.createElement("p",null,"For future gigs: ",this.props.user.email))}}]),t}();function Do(e){return(Do="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Io(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Ao(e,t){return!t||"object"!==Do(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Uo(e){return(Uo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Mo(e,t){return(Mo=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Fo=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Ao(this,Uo(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Mo(e,t)}(t,o.a.Component),function(e,t,n){t&&Io(e.prototype,t),n&&Io(e,n)}(t,[{key:"componentDidMount",value:function(){this.props.fetchAllPosts()}},{key:"render",value:function(){var e=this;if(!this.props.user)return o.a.createElement("p",null,"Loading...");if(Object.keys(this.props.posts).length<1)return o.a.createElement("p",null,"Loading...");var t=ko()(this.props.posts).filter(function(t){return t.receiver_id===e.props.user.id||t.author_id===e.props.user.id}).map(function(e){return o.a.createElement(Nr,{post:e,key:e.id})});return o.a.createElement("div",{className:"profile-info-and-posts"},o.a.createElement(Ro,{user:this.props.user}),o.a.createElement("div",{className:"profile-posts-and-create-post"},o.a.createElement(Mn,{user:this.props.user}),o.a.createElement("ul",{className:"profile-posts"},t)))}}]),t}(),Lo=tt(ee(function(e,t){return{posts:e.entities.posts,user:t.user}},function(e,t){return{fetchAllPosts:function(){return e(Tn())}}})(Fo));function zo(e){return(zo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Wo(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Bo(e){return(Bo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function $o(e,t){return($o=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Vo(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var Ho=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==zo(t)&&"function"!=typeof t?Vo(e):t}(this,Bo(t).call(this,e))).state={imageUrl:null,imageFile:null,displayInput:!1},n.handleUpdateCover=n.handleUpdateCover.bind(Vo(Vo(n))),n.handleSubmit=n.handleSubmit.bind(Vo(Vo(n))),n.handleInput=n.handleInput.bind(Vo(Vo(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&$o(e,t)}(t,o.a.Component),function(e,t,n){t&&Wo(e.prototype,t),n&&Wo(e,n)}(t,[{key:"handleUpdateCover",value:function(e){this.setState({displayInput:!this.state.displayInput})}},{key:"handleSubmit",value:function(){var e=this,t=this.state.imageFile,n=new FormData;n.append("user[id]",this.props.user.id),t&&n.append("user[cover_pic]",t),this.props.updateCover(n).then(function(){e.props.hideModal()})}},{key:"handleInput",value:function(e){var t=this,n=new FileReader,r=e.currentTarget.files[0];n.onloadend=function(){return t.setState({imageUrl:n.result,imageFile:r})},r?n.readAsDataURL(r):this.setState({imageUrl:"",imageFile:null})}},{key:"render",value:function(){var e,t;return e=this.state.displayInput?o.a.createElement("form",{onSubmit:this.handleSubmit},o.a.createElement("input",{type:"file",onChange:this.handleInput}),o.a.createElement("button",null,"Change Your Pic")):null,t=this.state.imageUrl?o.a.createElement("img",{src:this.state.imageUrl}):o.a.createElement("img",{src:this.props.user.coverPic}),o.a.createElement("div",{className:"pic-modal-wrapper"},t,o.a.createElement("div",{className:"form-and-button-edit-image"},o.a.createElement("button",{onClick:this.handleUpdateCover},"Edit Cover Pic"),e))}}]),t}();function qo(e){return(qo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Ko(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Yo(e,t){return!t||"object"!==qo(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Qo(e){return(Qo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Go(e,t){return(Go=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Xo=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Yo(this,Qo(t).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Go(e,t)}(t,o.a.Component),function(e,t,n){t&&Ko(e.prototype,t),n&&Ko(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"pic-modal-wrapper"},o.a.createElement("div",{className:"edit-cover-pic"},o.a.createElement("img",{src:this.props.user.coverPic})))}}]),t}();function Zo(e){return(Zo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Jo(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ei(e){return(ei=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function ti(e,t){return(ti=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function ni(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var ri=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Zo(t)&&"function"!=typeof t?ni(e):t}(this,ei(t).call(this,e))).state={hover:!1},n.handleCoverModal=n.handleCoverModal.bind(ni(ni(n))),n.handleShowButton=n.handleShowButton.bind(ni(ni(n))),n.handleHideButton=n.handleHideButton.bind(ni(ni(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ti(e,t)}(t,o.a.Component),function(e,t,n){t&&Jo(e.prototype,t),n&&Jo(e,n)}(t,[{key:"handleCoverModal",value:function(e){this.props.user.id===this.props.currentUser.id?this.props.showModal(o.a.createElement(Ho,{user:this.props.user,currentUser:this.props.currentUser,updateCover:this.props.updateCover,hideModal:this.props.hideModal})):this.props.showModal(o.a.createElement(Xo,{user:this.props.user,currentUser:this.props.currentUser,updateCover:this.props.updateCover}))}},{key:"handleShowButton",value:function(){this.props.user.id===this.props.currentUser.id?this.setState({hover:!0}):this.setState({hover:"friend"})}},{key:"handleHideButton",value:function(){this.setState({hover:!1})}},{key:"render",value:function(){return this.props.user?(e=this.state.hover?"friend"===this.state.hover?o.a.createElement("div",{className:"icon-edit-cover",onMouseEnter:this.handleShowButton,onClick:this.handleCoverModal},o.a.createElement("i",{className:"fa fa-camera",id:"camera-icon","aria-hidden":"true"}),o.a.createElement("p",null,"View Cover Pics")):o.a.createElement("div",{className:"icon-edit-cover",onMouseEnter:this.handleShowButton,onClick:this.handleCoverModal},o.a.createElement("i",{className:"fa fa-camera",id:"camera-icon","aria-hidden":"true"}),o.a.createElement("p",null,"Edit Cover Pic")):null,o.a.createElement("div",{id:"cover-photo",onMouseLeave:this.handleHideButton},e,o.a.createElement("img",{onMouseEnter:this.handleShowButton,onClick:this.handleCoverModal,src:this.props.user.coverPic}))):o.a.createElement("p",null,"Loading...");var e}}]),t}(),oi=tt(ee(function(e,t){return{user:e.entities.users[t.match.params.userId],currentUser:e.session.currentUser||{}}},function(e,t){return{showModal:function(t){return e(Yn(t))},hideModal:function(){return e({type:"HIDE_MODAL"})},updateCover:function(t){return e(vo(t))}}})(ri));function ii(e){return(ii="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ui(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ai(e,t){return!t||"object"!==ii(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function li(e){return(li=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function ci(e,t){return(ci=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var si=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),ai(this,li(t).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ci(e,t)}(t,o.a.Component),function(e,t,n){t&&ui(e.prototype,t),n&&ui(e,n)}(t,[{key:"render",value:function(){return o.a.createElement("li",{id:"friend-detail-component"},o.a.createElement("img",{src:this.props.user.profilePic}),o.a.createElement("div",{className:"friend-info"},o.a.createElement(Mt,{onClick:this.props.toggleFriends,to:"/users/".concat(this.props.user.id)},this.props.user.name),o.a.createElement("p",null,this.props.user.movie)))}}]),t}();function fi(e){return(fi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function pi(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function di(e,t){return!t||"object"!==fi(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function hi(e){return(hi=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function mi(e,t){return(mi=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var yi=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),di(this,hi(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&mi(e,t)}(t,o.a.Component),function(e,t,n){t&&pi(e.prototype,t),n&&pi(e,n)}(t,[{key:"render",value:function(){return this.props.user||o.a.createElement("p",null,"Loading..."),o.a.createElement("div",null,o.a.createElement("div",{id:"profile-photo"},o.a.createElement("img",{src:this.props.user.profilePic}),o.a.createElement("p",{className:"user-name"},this.props.user.name)))}}]),t}();function vi(e){return(vi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function bi(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function gi(e){return(gi=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function wi(e,t){return(wi=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _i(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var Ei=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==vi(t)&&"function"!=typeof t?_i(e):t}(this,gi(t).call(this,e))).state={showFriends:!1},n.toggleFriends=n.toggleFriends.bind(_i(_i(n))),n.handleAddFriend=n.handleAddFriend.bind(_i(_i(n))),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&wi(e,t)}(t,o.a.Component),function(e,t,n){t&&bi(e.prototype,t),n&&bi(e,n)}(t,[{key:"handleAddFriend",value:function(e){e.stopPropagation(),this.props.createFriendship({friendship:{friendee_id:this.props.users[this.props.match.params.userId].id}})}},{key:"toggleFriends",value:function(e){e.stopPropagation(),this.setState({showFriends:!this.state.showFriends})}},{key:"componentDidMount",value:function(){var e=this;this.props.fetchUser({id:this.props.match.params.userId}).then(function(){e.props.fetchAllComments()})}},{key:"render",value:function(){var e=this;if(!this.props.user)return o.a.createElement("p",null,"Loading...");var t,n,r=this.props.dropdowns;if(t=Boolean(r.displayed)||Boolean(r.component)?this.props.hideDropdown:function(e){return e.stopPropagation()},this.state.showFriends){var i;if(n="Back to Profile",this.props.acceptedFriendIds)i=Object.keys(this.props.acceptedFriendIds).map(function(t){var n=e.props.acceptedFriendIds[t];return o.a.createElement("li",{key:n.id},o.a.createElement(si,{user:n,status:"accepted",toggleFriends:e.toggleFriends}))});else i="".concat(this.props.user.name," has no friends yet!");return o.a.createElement("div",{onClick:t},o.a.createElement("div",{className:"nav-and-profile-pic-components"},o.a.createElement(On,null)),o.a.createElement("div",{id:"cover-and-profile-pics"},o.a.createElement(oi,{currentUser:this.props.currentUser,user:this.props.user,showModal:this.props.showModal,updateCover:this.props.updateCover}),o.a.createElement(yi,{user:this.props.user}),o.a.createElement("div",{id:"profile-bar-component"},o.a.createElement("button",{onClick:this.handleAddFriend},"Add Friend"),o.a.createElement("button",{onClick:this.toggleFriends},n))),o.a.createElement("div",{id:"all-friends"},o.a.createElement("div",{id:"friends-bar"},"All of ",this.props.user.name,"s friends!"),o.a.createElement("div",{id:"accepted-pending-friends"},o.a.createElement("ul",{id:"accepted"},i))))}return n="".concat(this.props.user.name,"'s Friends'"),o.a.createElement("div",{id:"profile-page",onClick:t},o.a.createElement("div",{id:"cover-and-profile-pics"},o.a.createElement(oi,{currentUser:this.props.currentUser,user:this.props.user,showModal:this.props.showModal,updateCover:this.props.updateCover}),o.a.createElement(So,{currentUser:this.props.currentUser,user:this.props.user,showModal:this.props.showModal,updateCover:this.props.updateCover}),o.a.createElement("div",{id:"profile-bar-component"},o.a.createElement("button",{onClick:this.handleAddFriend},"Add Friend"),o.a.createElement("button",{onClick:this.toggleFriends},n))),o.a.createElement(Lo,{user:this.props.user}))}}]),t}(),Oi=tt(ee(function(e,t){var n=null;return e.session.currentUserProfile&&(n=e.session.currentUserProfile.acceptedFriendIds),{acceptedFriendIds:n,user:e.entities.users[t.match.params.userId],currentUser:e.session.currentUser||{},dropdowns:e.ui.dropdowns,users:e.entities.users}},function(e,t){return{hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})},fetchUser:function(t){return e(Kt(t))},createFriendship:function(t){return e(Qt(t))},showModal:function(t){return e(Yn(t))},updateCover:function(t){return e(vo(t))},fetchAllComments:function(){return e(Kn())}}})(Ei));function Si(e){return(Si="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function xi(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ki(e,t){return!t||"object"!==Si(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Ci(e){return(Ci=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Pi(e,t){return(Pi=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Ti=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),ki(this,Ci(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Pi(e,t)}(t,o.a.Component),function(e,t,n){t&&xi(e.prototype,t),n&&xi(e,n)}(t,[{key:"render",value:function(){return this.props.component?o.a.createElement("div",{className:"dropdown-backdrop",onClick:this.props.hideDropdown},o.a.createElement("div",{className:"dropdown",onClick:function(e){return e.stopPropagation()}},this.props.component)):null}}]),t}(),ji=tt(ee(function(e,t){return{component:e.ui.dropdowns.component}},function(e,t){return{hideDropdown:function(){return e({type:"HIDE_DROPDOWN"})}}})(Ti)),Ni=Je,Ri=function(e){return{loggedIn:Boolean(e.session.currentUser)}},Di=tt(ee(Ri,null)(function(e){var t=e.component,n=e.path,r=e.loggedIn,i=e.location;return"/"===i.pathname&&r?o.a.createElement($e,{to:"/feed"}):o.a.createElement(Ni,{path:n,render:function(e){return r?o.a.createElement($e,{to:"".concat(i.pathname)}):o.a.createElement(t,e)}})})),Ii=tt(ee(Ri,null)(function(e){var t=e.component,n=e.path,r=e.loggedIn;return o.a.createElement(Ni,{path:n,render:function(e){return r?o.a.createElement(t,e):o.a.createElement($e,{to:"/"})}})})),Ai=function(e){return o.a.createElement("div",null,o.a.createElement(ro,null),o.a.createElement(ji,null),o.a.createElement(Ii,{path:"/",component:On}),o.a.createElement(Di,{exact:!0,path:"/",component:dt}),o.a.createElement(Di,{exact:!0,path:"/",component:kt}),o.a.createElement(Di,{exact:!0,path:"/",component:Rt}),o.a.createElement(Ii,{path:"/feed",component:Sn}),o.a.createElement(Ii,{path:"/feed",component:Gr}),o.a.createElement(Ii,{path:"/users/:userId",component:Oi}))},Ui=function(e){var t=e.store;return o.a.createElement(p,{store:t},o.a.createElement(Ae,null,o.a.createElement(Ai,null)))},Mi=n(6),Fi={currentUser:null};function Li(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var zi={};function Wi(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Bi={},$i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SHOW_MODAL":return{component:t.component};case"HIDE_MODAL":return{component:null};default:return e}},Vi=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SHOW_DROPDOWN":return{component:t.component};case"HIDE_DROPDOWN":return{component:null,displayed:null};case"DISPLAY_DROPDOWN":return{displayed:t.displayed};default:return e}},Hi={errors:{users:[],posts:[],session:[],comments:[]}},qi=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Hi,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"RECEIVE_ERRORS":return t.errors;default:return e}};var Ki={};var Yi={},Qi={},Gi=M({session:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Fi,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":var n=Object(Mi.merge)({},e);return n.currentUser=t.user,n;default:return e}},entities:M({comments:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Ki,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_COMMENT":case"UPDATE_COMMENT":return Object.assign({},e,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},t.comment.id,t.comment));case"RECEIVE_COMMENTS":return t.comments;case"DELETE_COMMENT":var n=Object.assign({},e);return delete n[t.comment.id],n;default:return e}},likes:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Yi,n=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(t),n.type){case"RECEIVE_LIKE":return Object.assign({},t,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},n.like.id,n.like));case"REMOVE_LIKE":return delete(e=Object.assign({},t))[n.like.id],e;default:return t}},posts:function(){var e,t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:zi,r=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(n),r.type){case"RECEIVE_POST":return Object.assign({},n,Li({},r.post.id,r.post));case"RECEIVE_POSTS":return r.posts;case"RECEIVE_COMMENT":case"UPDATE_COMMENT":var o=(e=Object.assign({},n))[r.comment.post_id].comments.map(function(e){return e.id===r.comment.id?r.comment:e});return e[r.comment.post_id].comments=o,e;case"UPDATE_POST":return Object.assign({},n,Li({},r.post.id,r.post));case"DELETE_POST":return delete(e=Object.assign({},n))[r.post.id],e;case"DELETE_COMMENT":var i=(e=Object.assign({},n))[r.comment.post_id];return i.comments=i.comments.filter(function(e){return e.id!==r.comment.id}),e;case"RECEIVE_LIKE":return r.like.post_id?((t=(e=Object.assign({},n))[r.like.post_id]).likes.push(r.like.id),t.currentUserLikes=!0,e):n;case"REMOVE_LIKE":var u=(t=(e=Object.assign({},n))[r.like.post_id]).likes.indexOf(r.like.id);return t.likes.splice(u,1),t.currentUserLikes=!1,e;default:return n}},users:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Bi,t=arguments.length>1?arguments[1]:void 0;Object.freeze(e);var n=Object.assign({},e);switch(t.type){case"RECEIVE_COMMENTS":case"RECEIVE_POSTS":case"RECEIVE_USERS":return Object.values(t.users).forEach(function(e){n[e.id]=e}),n;case"RECEIVE_CURRENT_USER":return t.user?Object.assign({},e,Wi({},t.user.id,t.user)):e;case"RECEIVE_USER":return Object.assign({},e,Wi({},t.user.id,t.user));case"RECEIVE_POST":return Object.assign({},e,t.users);default:return e}},search:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Qi,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_SEACH_RESULTS":return t.users;default:return e}}}),ui:M({dropdowns:Vi,errors:qi,modals:$i})}),Xi=n(24),Zi=n.n(Xi);function Ji(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}var eu=Ji();eu.withExtraArgument=Ji;var tu=eu,nu=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return A(Gi,e,z(tu,Zi.a))};document.addEventListener("DOMContentLoaded",function(){var e={};window.currentUser&&(e={session:{currentUser:window.currentUser}},delete window.currentUser);var t=nu(e),n=document.getElementById("root");u.a.render(o.a.createElement(Ui,{store:t}),n)})}]);
//# sourceMappingURL=bundle.js.map
;
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
