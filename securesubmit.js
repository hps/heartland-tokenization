//JSON2
/*ignore jslint start*//* jshint ignore:start */
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,a=e[t];switch(a&&"object"==typeof a&&"function"==typeof a.toJSON&&(a=a.toJSON(t)),"function"==typeof rep&&(a=rep.call(e,t,a)),typeof a){case"string":return quote(a);case"number":return isFinite(a)?a+"":"null";case"boolean":case"null":return a+"";case"object":if(!a)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(a)){for(f=a.length,r=0;f>r;r+=1)u[r]=str(r,a)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));else for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","    ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
/*ignore jslint end*//* jshint ignore:end */

(function (window, document) {
  'use strict';

  var heartland = window.heartland || {};
  heartland.Ajax = heartland.Ajax || {};
  heartland.DOM = heartland.DOM || {};
  heartland.Events = heartland.Events || {};
  heartland.Frames = heartland.Frames || {};
  heartland.Messages = heartland.Messages || {};
  heartland.Styles = heartland.Styles || {};
  heartland.Util = heartland.Util || {};

  var urls = {
    CERT: 'https://cert.api2.heartlandportico.com/Hps.Exchange.PosGateway.Hpf.v1/api/token',
    PROD: 'https://api2.heartlandportico.com/SecureSubmit.v1/api/token',
    iframeCERT: 'http://localhost:8889/iframeIndex.html',
    iframePROD: 'https://api2.heartlandportico.com/SecureSubmit.v1/token/2.0/'
  };

  var defaults = {
    'publicKey': '',
    'success': '',
    'error': '',
    'object': 'token',
    'token_type': 'supt',
    '_method': 'post',
    'card_number': '',
    'card_cvc': '',
    'card_exp_month': '',
    'card_exp_year': '',
    'form_id': '',
    'track': '',
    'track_number': '',
    'ktb': '',
    'pin_block': '',
    'type': 'pan',
    'useDefaultStyles': true
  };

  var fields = [
    'cardNumber',
    'cardCvv',
    'cardExpiration'
  ];

  /// Public API

  // heartland.HPS (constructor)
  //
  // Initializes options and adds the default form handler if a `form_id` is
  // passed as an option. This expects the default fields (see `getFields`) to
  // be present as children of `form_id`.
  heartland.HPS = window.HPS = function () {
    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = heartland.Util.applyOptions(defaults, arguments[0]);
    } else if (!arguments[0] && window.parent) {
      return;
    }

    this.options = heartland.Util.getUrlByEnv(this.options);

    if (this.options.form_id.length > 0) {
      addFormHandler(this.options);
    }

    this.frames = {};
    if (this.options.type === 'iframe') {
      this.iframe_url = '';

      this.Messages = new heartland.Messages(this);
      this.mailbox = [];
      this.cache_bust = 1;
      heartland.Frames.configureIframe(this);
    }
  };

  // heartland.HPS.tokenize
  //
  // Tokenizes card data. Used in manual integrations where the merchant's
  // credit card fields cannot/do not match the names expected in the default
  // form handler (see `getFields`).
  heartland.HPS.prototype.tokenize = function (options) {
    options = options || {};
    if (options) {
      this.options = heartland.Util.applyOptions(this.options, options);
      this.options = heartland.Util.getUrlByEnv(this.options);
    }
    if (this.options.type === 'iframe') {
      this.Messages.post({action: 'tokenize', message: this.options.publicKey}, 'child');
      return;
    }
    heartland.Ajax.call(this.options.type, this.options);
  };

  // heartland.HPS.configureInternalIframe
  //
  // Sets up a child iframe window to prepare it for communication with the
  // parent and for tokenization.
  heartland.HPS.prototype.configureInternalIframe = function (options) {
    this.Messages = new heartland.Messages(this);
    this.parent = window.postMessage ? window.parent.contentWindow : window.parent;
    this.frames = this.frames || {};
    this.frames.parent = {
      name: 'parent',
      frame: window.parent,
      url: decodeURIComponent(document.location.hash.replace(/^#/, ''))
    };

    heartland.Events.addHandler(window, 'load', (function (hps) {
      return function () {
        heartland.DOM.resizeFrame(hps);
      };
    }(this)));

    heartland.Events.addHandler(document, 'receiveMessageHandlerAdded', (function (hps) {
      return function () {
        hps.Messages.post({action: 'receiveMessageHandlerAdded'}, 'parent');
      };
    }(this)));

    this.Messages.receive(heartland.Events.frameHandleWith(this), '*');
  };

  // heartland.HPS.configureFieldIframe
  //
  // Sets up a child iframe window to prepare it for communication with the
  // parent and for tokenization.
  heartland.HPS.prototype.configureFieldIframe = function (options) {
    var hash = document.location.hash.replace(/^#/, '');
    var split = hash.split(':');
    this.Messages = new heartland.Messages(this);
    this.field = split.shift();
    this.parent = window.postMessage ? window.parent.contentWindow : window.parent;
    this.frames = this.frames || {};
    this.frames.parent = {
      name: 'parent',
      frame: window.parent,
      url: decodeURIComponent(split.join(':').replace(/^:/, ''))
    };

    heartland.Events.addHandler(window, 'load', (function (hps) {
      return function () {
        heartland.DOM.resizeFrame(hps);
        heartland.DOM.configureField(hps);
      };
    }(this)));

    heartland.Events.addHandler(document, 'receiveMessageHandlerAdded', (function (hps) {
      return function () {
        hps.Messages.post({action: 'receiveMessageHandlerAdded'}, 'parent');
      };
    }(this)));

    this.Messages.receive(heartland.Events.frameHandleWith(this), '*');
  };

  // heartland.HPS.resizeIFrame
  //
  // Called automatically when the child iframe window alerts the parent to
  // resize.
  heartland.HPS.prototype.resizeIFrame = function (frame, height) {
    frame.style.height = (parseInt(height, 10)) + 'px';
  };

  // heartland.HPS.setText
  //
  // Public API for setting an element's inner text.
  heartland.HPS.prototype.setText = function (elementid, elementtext) {
    this.Messages.post({action: 'setText', id: elementid, text: elementtext}, 'child');
  };

  // heartland.HPS.setStyle
  //
  // Public API for setting an element's style.
  heartland.HPS.prototype.setStyle = function (elementid, elementstyle) {
    this.Messages.post({action: 'setStyle', id: elementid, style: elementstyle}, 'child');
  };

  // heartland.HPS.appendStyle
  //
  // Public API for appending to an element's style.
  heartland.HPS.prototype.appendStyle = function (elementid, elementstyle) {
    this.Messages.post({action: 'appendStyle', id: elementid, style: elementstyle}, 'child');
  };

  /// Private API

  // heartland.Frames.configureIframe
  //
  // Prepares the pages iFrames for communication with the parent window.
  heartland.Frames.configureIframe = function configureIframe(hps) {
    var frame;
    var options = hps.options;
    var target = document.getElementById(options.iframeTarget);
    var useDefaultStyles = true;
    hps.Messages = hps.Messages || new heartland.Messages(hps);

    if (options.env === 'cert') {
      hps.iframe_url = urls.iframeCERT;
    } else {
      hps.iframe_url = urls.iframePROD;
    }

    if (options.targetType === 'myframe') {
      frame = target;
      hps.iframe_url = frame.src;
    } else {
      frame = heartland.DOM.makeFrame('securesubmit-iframe');
      target.appendChild(frame);
    }

    if (options.fields) {
      heartland.Frames.makeFieldAndLink(hps);
    }

    hps.iframe_url = hps.iframe_url + '#' + encodeURIComponent(document.location.href.split('#')[0]);
    frame.src = hps.iframe_url;

    hps.frames.child = {
      name: 'child',
      frame: window.postMessage ? frame.contentWindow : frame,
      url: hps.iframe_url
    };

    if (options.useDefaultStyles === false) {
      useDefaultStyles = false;
    }

    if (options.buttonTarget) {
      heartland.Events.addHandler(options.buttonTarget, 'click', function (e) {
        e.preventDefault();
        hps.Messages.post(
          {
            action: 'tokenize',
            message: options.publicKey,
            accumulateData: !!hps.frames.cardNumber
          },
          hps.frames.cardNumber ? 'cardNumber' : 'child'
        );
        return false;
      });
    }

    hps.Messages.receive(function(m){
      var fieldFrame = hps.frames[m.source.name];

      switch(m.data.action) {
        case 'onTokenSuccess': {
          options.onTokenSuccess(m.data.response);
          break;
        }
        case 'onTokenError': {
          options.onTokenError(m.data.response);
          break;
        }
        case 'resize': {
          if (fieldFrame) {
            hps.resizeIFrame(fieldFrame.frame, m.data.height);
          } else {
            hps.resizeIFrame(frame, m.data.height);
          }

          break;
        }
        case 'receiveMessageHandlerAdded': {
          if (!fieldFrame && useDefaultStyles) {
            heartland.Styles.Defaults.body(hps);
            heartland.Styles.Defaults.labelsAndLegend(hps);
            heartland.Styles.Defaults.inputsAndSelects(hps);
            heartland.Styles.Defaults.fieldset(hps);
            heartland.Styles.Defaults.selects(hps);
            heartland.Styles.Defaults.selectLabels(hps);
            heartland.Styles.Defaults.cvvContainer(hps);
            heartland.Styles.Defaults.cvv(hps);
          }

          if (fieldFrame && fieldFrame.options.placeholder) {
            hps.Messages.post(
              {
                action: 'setPlaceholder',
                id: 'heartland-field',
                text: fieldFrame.options.placeholder
              },
              fieldFrame.name
            );
          }

          heartland.Events.trigger('securesubmitIframeReady', document);
          break;
        }
        case 'accumulateData': {
          var i = 0;
          var field;

          for (i in hps.frames) {
            if (i === 'cardNumber') continue;
            field = hps.frames[i];
            hps.Messages.post(
              {
                action: 'getFieldData',
                id: 'heartland-field'
              },
              field.name
            );
          }
          break;
        }
        case 'passData': {
          var cardNumberFieldFrame = hps.frames.cardNumber;
          if (!cardNumberFieldFrame) {
            break;
          }

          hps.Messages.post(
            {
              action: 'setFieldData',
              id: fieldFrame.name,
              value: m.data.value
            },
            cardNumberFieldFrame.name
          );
          break;
        }
      }
    }, '*');
  };

  // heartland.Frames.makeFieldAndLink
  //
  // Creates a set of single field iFrames and stores a reference to
  // them in the parent window's state.
  heartland.Frames.makeFieldAndLink = function makeFieldAndLink(hps) {
    var fieldsLength = fields.length;
    var baseUrl = hps.iframe_url.replace('iframeIndex.html', '') + 'iframeField.html';
    var options = hps.options;

    for (var i = 0; i < fieldsLength; i++) {
      var field = fields[i];
      var fieldOptions = options.fields[field];
      var frame = heartland.DOM.makeFrame(field);
      var url = baseUrl + '#' + field + ':' + encodeURIComponent(document.location.href.split('#')[0]);
      frame.src = url;

      document
        .getElementById(fieldOptions.target)
        .appendChild(frame);

      hps.frames[field] = {
        name: field,
        frame: frame,
        options: fieldOptions,
        target: fieldOptions.target,
        targetNode: window.postMessage ? frame.contentWindow : frame,
        url: url
      };
    }
  };

  // heartland.DOM.configureField
  //
  // Configures an input field in a single field iFrame.
  heartland.DOM.configureField = function configureField(hps) {
    document.getElementById('heartland-field').name = hps.field;
  };

  // heartland.DOM.makeFrame
  //
  // Creates a single iFrame element with the appropriate defaults.
  heartland.DOM.makeFrame = function makeFrame(id) {
      var frame = document.createElement('iframe');
      frame.id = id;
      frame.style.border = '0';
      frame.scrolling = 'no';
      return frame;
  };

  // heartland.DOM.addField
  //
  // Adds a DOM `input` node to `formParent` with type `fieldType`, name
  // `fieldName`, and value `fieldValue`.
  heartland.DOM.addField = function addField(formParent, fieldType, fieldName, fieldValue) {
    var input = document.createElement('input');

    input.setAttribute('type', fieldType);
    input.setAttribute('name', fieldName);
    input.setAttribute('value', fieldValue);

    document.getElementById(formParent).appendChild(input);
  };

  // heartland.DOM.setStyle
  //
  // Sets an element's style attribute within a child iframe window.
  heartland.DOM.setStyle = function setStyle(elementid, htmlstyle) {
    var el = document.getElementById(elementid);
    if (el) {
      el.setAttribute('style', htmlstyle);
    }
  };

  // heartland.DOM.appendStyle
  //
  // Appends an element's style attribute within a child iframe window.
  heartland.DOM.appendStyle = function appendStyle(elementid, htmlstyle) {
    var el = document.getElementById(elementid);
    if (el) {
      var currstyle = el.getAttribute('style');
      var newstyle = (currstyle ? currstyle : '') + htmlstyle;
      el.setAttribute('style', newstyle);
    }
  };

  // heartland.DOM.setText
  //
  // Sets an element's inner text within a child iframe window.
  heartland.DOM.setText = function setText(elementid, text) {
    var el = document.getElementById(elementid);
    if (el) {
      el.innerHTML = text;
    }
  };

  // heartland.DOM.setPlaceholder
  //
  // Sets an element's placeholder attribute within a child iframe window.
  heartland.DOM.setPlaceholder = function setPlaceholder(elementid, text) {
    var el = document.getElementById(elementid);
    if (el) {
      el.setAttribute('placeholder', text);
    }
  };

  // heartland.DOM.resizeFrame
  //
  // Alerts a parent window to resize the iframe.
  heartland.DOM.resizeFrame = function resizeFrame(hps) {
    var html = document.getElementsByTagName('html')[0];
    var docHeight = html.offsetHeight;
    hps.Messages.post({action: 'resize', height: docHeight}, 'parent');
  };

  // heartland.DOM.setFieldData
  //
  // Receives a field value from another frame prior to the tokenization process.
  heartland.DOM.setFieldData = function setFieldData(elementid, value) {
    var el = document.getElementById(elementid);
    if (!el && document.getElementById('heartland-field')) {
      el = document.createElement('input');
      el.id = elementid;
      el.type = 'hidden';
      document.getElementById('heartland-field-wrapper').appendChild(el);
    }

    if (el) {
      el.setAttribute('value', value);
    }
  };

  // heartland.DOM.getFieldData
  //
  // Retrieves a field value for another frame prior to the tokenization process.
  heartland.DOM.getFieldData = function getFieldData(hps, elementid) {
    var el = document.getElementById(elementid);
    if (el) {
      hps.Messages.post({action: 'passData', value: el.value}, 'parent');
    }
  };

  // heartland.Events.addHandler
  //
  // Adds an `event` handler for a given `target` element.
  heartland.Events.addHandler = function addHandler(target, event, callback) {
    if (typeof target === 'string') {
      target = document.getElementById(target);
    }

    if (target.addEventListener) {
      target.addEventListener(event, callback, false);
    } else if (target.attachEvent) {
      if (event === 'submit') {
        event = 'on' + event;
      }

      target.attachEvent(event, callback);
    }
  };

  // heartland.Events.trigger
  //
  // Fires off an `event` for a given `target` element.
  heartland.Events.trigger = function trigger(name, target, data) {
    var event = target.createEvent('Event');
    event.initEvent(name, true, true);
    target.dispatchEvent(event);
  };

  // hearltand.Events.frameHandleWith
  //
  // Wraps `hps` state in a closure to provide a `heartland.Messages.receive`
  // callback handler for iFrame children.
  heartland.Events.frameHandleWith = function frameHandleWith(hps) {
    return function (m) {
      switch(m.data.action) {
        case 'tokenize': {
          if (m.data.accumulateData) {
            hps.Messages.post(
              {
                action: 'accumulateData'
              },
              'parent'
            );
            var el = document.createElement('input');
            el.id = 'publicKey';
            el.type = 'hidden';
            el.value = m.data.message;
            document
              .getElementById('heartland-field-wrapper')
              .appendChild(el);
          } else {
            tokenizeIframe(hps, m.data.message);
          }
          break;
        }
        case 'setStyle': {
          heartland.DOM.setStyle(m.data.id, m.data.style);
          heartland.DOM.resizeFrame(hps);
          break;
        }
        case 'appendStyle': {
          heartland.DOM.appendStyle(m.data.id, m.data.style);
          heartland.DOM.resizeFrame(hps);
          break;
        }
        case 'setText': {
          heartland.DOM.setText(m.data.id, m.data.text);
          heartland.DOM.resizeFrame(hps);
          break;
        }
        case 'setPlaceholder': {
          heartland.DOM.setPlaceholder(m.data.id, m.data.text);
          break;
        }
        case 'setFieldData': {
          heartland.DOM.setFieldData(m.data.id, m.data.value);
          if (document.getElementById('heartland-field') &&
              document.getElementById('cardCvv') &&
              document.getElementById('cardExpiration')) {
            tokenizeIframe(hps, document.getElementById('publicKey').value);
          }
          break;
        }
        case 'getFieldData': {
          heartland.DOM.getFieldData(hps, m.data.id);
          break;
        }
      }
    };
  };

  // tokenizeIframe
  //
  // Tokenizes card data. Used in iframe integrations to tokenize on Heartland's
  // servers.
  function tokenizeIframe(hps, publicKey) {
    var card = {};
    var tokenValue;

    card.number = (document.getElementById('heartland-field') || document.getElementById('heartland-card-number')).value;
    card.cvv = (document.getElementById('cardCvv') || document.getElementById('heartland-cvv')).value;
    card.exp = document.getElementById('cardExpiration');

    if (cardExpiration) {
      var cardExpSplit = card.exp.value.split('/');
      card.expMonth = cardExpSplit[0];
      card.expYear = cardExpSplit[1];
      delete card.exp;
    } else {
      card.expMonth = document.getElementById('heartland-expiration-month').value;
      card.expYear = document.getElementById('heartland-expiration-year').value;
    }

    hps.tokenize({
      publicKey: publicKey,
      card_number: card.number,
      card_cvc: card.cvv,
      card_exp_month: card.expMonth,
      card_exp_year: card.expYear,
      type: 'pan',
      success: function(response) {
        hps.Messages.post({action: 'onTokenSuccess', response: response}, 'parent');
      },
      error: function (response) {
        hps.Messages.post({action: 'onTokenError', response: response}, 'parent');
      }
    });
  }

  // addFormHandler
  //
  // Creates and adds an event handler function for the submission for a given
  // form (`options.form_id`).
  function addFormHandler(options) {
    var payment_form = document.getElementById(options.form_id);

    var code = function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else if (window.event) /* for ie */ {
        window.event.returnValue = false;
      }

      var fields = getFields(options.form_id);
      var cardType = heartland.Util.getCardType(fields.card_number);

      options.card_number = fields.card_number;
      options.card_exp_month = fields.card_expiration_month;
      options.card_exp_year = fields.card_expiration_year;
      options.card_cvc = fields.card_cvc;

      heartland.Ajax.call('pan', options);
    };

    heartland.Events.addHandler(payment_form, 'submit', code);
    heartland.DOM.addField(options.form_id, 'hidden', 'publicKey', options.publicKey);
  }

  // heartland.Util.getCardType
  //
  // Parses a credit card number to obtain the card type/brand.
  heartland.Util.getCardType = function getCardType(number) {
    var cardType = '';
    var re = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };

    if (re.visa.test(number)) {
      cardType = 'visa';
    } else if (re.mastercard.test(number)) {
      cardType = 'mastercard';
    } else if (re.amex.test(number)) {
      cardType = 'amex';
    } else if (re.diners.test(number)) {
      cardType = 'diners';
    } else if (re.discover.test(number)) {
      cardType = 'discover';
    } else if (re.jcb.test(number)) {
      cardType = 'jcb';
    }

    return cardType;
  };

  // heartland.Util.applyOptions
  //
  // Creates a single object by merging a `source` (default) and `properties`
  // obtained elsewhere, e.g. a function argument in `HPS`. Any properties in
  // `properties` will overwrite matching properties in `source`.
  heartland.Util.applyOptions = function applyOptions(source, properties) {
    var property;

    if (!source) {
      source = {};
    }

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }

    return source;
  };

  // heartland.Util.throwError
  //
  // Allows a merchant-defined error handler to be used in cases where the
  // tokenization process fails. If not provided, we throw the message as a
  // JS runtime error.
  heartland.Util.throwError = function throwError(options, errorMessage) {
    if (typeof(options.error) === 'function') {
      options.error(errorMessage);
    } else {
      throw errorMessage;
    }
  };

  // heartland.Util.getItemByPropertyValue
  //
  // Enumerates over a `collection` to retreive an item whose `property` is
  // a given `value`.
  heartland.Util.getItemByPropertyValue = function getItemByPropertyValue(collection, property, value) {
    var length = collection.length;
    var i = 0;

    for (i; i < length; i++) {
      if (collection[i][property] === value) {
        return collection[i];
      }
    }
  };

  // heartland.Ajax.jsonp
  //
  // Creates a new DOM node containing a created JSONP callback handler for an
  // impending Ajax JSONP request. Removes need for `XMLHttpRequest`.
  heartland.Ajax.jsonp = function jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  };

  // heartland.Ajax.call
  //
  // Sets up a request to be passed to `heartland.Ajax.jsonp`. On successful tokenization,
  // `options.success` will be called with the tokenization data as the only
  // argument passed.
  heartland.Ajax.call = function call(type, options) {
    var number = options.card_number.trim();
    var lastfour = number.slice(-4);
    var cardType = heartland.Util.getCardType(number);
    var params = heartland.Util.getParams(type, options);

    heartland.Ajax.jsonp(options.gateway_url + params, function(data) {
      if (data.error) {
        heartland.Util.throwError(options, data);
      } else {
        data.last_four = lastfour;
        data.card_type = cardType;
        data.exp_month = options.card_exp_month;
        data.exp_year = options.card_exp_year;

        if (options.form_id && options.form_id.length > 0) {
          heartland.DOM.addField(options.form_id, 'hidden', 'token_value', data.token_value);
          heartland.DOM.addField(options.form_id, 'hidden', 'last_four', lastfour);
          heartland.DOM.addField(options.form_id, 'hidden', 'card_exp_year', options.card_exp_year);
          heartland.DOM.addField(options.form_id, 'hidden', 'card_exp_month', options.card_exp_month);
          heartland.DOM.addField(options.form_id, 'hidden', 'card_type', cardType);
        }

        options.success(data);
      }
    });
  };

  // heartland.Util.getParams
  //
  // Builds param list for a particular `type` from expected properties in
  // `data`.
  heartland.Util.getParams = function getParams(type, data) {
    var params = [];
    switch (type) {
      case 'pan':
        params.push(
          'token_type=supt',
          'object=token',
          '_method=post',
          'api_key=' + data.publicKey.trim(),
          'card%5Bnumber%5D=' + data.card_number.trim(),
          'card%5Bexp_month%5D=' + data.card_exp_month.trim(),
          'card%5Bexp_year%5D=' + data.card_exp_year.trim(),
          'card%5Bcvc%5D=' + data.card_cvc.trim()
        );
        break;
      case 'swipe':
        params.push(
          'token_type=supt',
          'object=token',
          '_method=post',
          'api_key=' + data.publicKey.trim(),
          'card%5Btrack_method%5D=swipe',
          'card%5Btrack%5D=' + encodeURIComponent(data.track.trim())
        );
        break;
      case 'encrypted':
        params.push(
          'token_type=supt',
          'object=token',
          '_method=post',
          'api_key=' + data.publicKey.trim(),
          'encryptedcard%5Btrack_method%5D=swipe',
          'encryptedcard%5Btrack%5D=' + encodeURIComponent(data.track.trim()),
          'encryptedcard%5Btrack_number%5D=' +encodeURIComponent( data.track_number.trim()),
          'encryptedcard%5Bktb%5D=' + encodeURIComponent(data.ktb.trim()),
          'encryptedcard%5Bpin_block%5D=' + encodeURIComponent(data.pin_block.trim())
        );
        break;
      default:
        heartland.Util.throwError(data, 'unknown params type');
        break;
    }
    return '?' + params.join('&');
  };

  // heartland.Util.getUrlByEnv
  //
  // Selects the appropriate toeknization service URL for the
  // active `publicKey`.
  heartland.Util.getUrlByEnv = function getUrlByEnv(options) {
    options.env = options.publicKey.split('_')[1];

    if (options.env === 'cert') {
      options.gateway_url = urls.CERT;
    } else {
      options.gateway_url = urls.PROD;
    }

    return options;
  };

  // getFields
  //
  // Extracts card information from the fields with names `card_number`,
  // `card_expiration_month`, `card_expiration_year`, and `card_cvc` and
  // expects them to be present as children of `formParent`.
  function getFields(formParent) {
    var form = document.getElementById(formParent);
    var fields = {};
    var i, element;
    var length = form.childElementCount;

    for (i = 0; i < length; i++) {
      element = form.children[i];
      if (element.id === 'card_number') {
        fields.card_number = element.value;
      } else if (element.id === 'card_expiration_month') {
        fields.card_expiration_month = element.value;
      } else if (element.id === 'card_expiration_year') {
        fields.card_expiration_year = element.value;
      } else if (element.id === 'card_cvc') {
        fields.card_cvc = element.value;
      }
    }

    return fields;
  }

  // heartland.Styles.Defaults
  //
  // Collection of helper functions for applying default styles to a child
  // window's fields. Serves as an example of these methods' use in merchant
  // modifications.
  heartland.Styles.Defaults = {
    body: function (hps) {
      hps.setStyle('heartland-body',
        'margin: 0;' +
        'font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;' +
        'color: #666;'
      );
    },
    labelsAndLegend: function (hps) {
      var ids = [
        'heartland-card-number-label',
        'heartland-expiration-date-legend',
        'heartland-expiration-month-label',
        'heartland-expiration-year-label',
        'heartland-cvv-label'
      ];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.setStyle(ids[i],
          'font-size: 13px;' +
          'text-transform: uppercase;' +
          'font-weight: bold;' +
          'display: block;' +
          'width: 100%;' +
          'clear: both;'
        );
      }
    },
    inputsAndSelects: function (hps) {
      var ids = [
        'heartland-card-number',
        'heartland-expiration-month',
        'heartland-expiration-year',
        'heartland-cvv'
      ];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.setStyle(ids[i],
          'width: 309px;' +
          'padding: 5px;' +
          'font-size: 14px;' +
          'margin: 3px 0px 15px 0px;' +
          'border: 1px #ccc solid;' +
          /* IE10 Consumer Preview */
          'background-image: -ms-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* Mozilla Firefox */
          'background-image: -moz-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* Opera */
          'background-image: -o-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* Webkit (Safari/Chrome 10) */
          'background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0, #F7F7F7), color-stop(1, #EFEFEF));' +
          /* Webkit (Chrome 11+) */
          'background-image: -webkit-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* W3C Markup, IE10 Release Preview */
          'background-image: linear-gradient(to top, #F7F7F7 0%, #EFEFEF 100%);'
        );
      }
    },
    fieldset: function (hps) {
      hps.setStyle('heartland-expiration-date-container',
        'border: 0;' +
        'margin: 0 25px 0px 1px;' +
        'padding: 0;' +
        'width: 173px;' +
        'display: inline-block;' +
        'float:  left;'
      );
    },
    selects: function (hps) {
      var ids = ['heartland-expiration-month', 'heartland-expiration-year'];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.appendStyle(ids[i],
          'border: 0;' +
          'outline: 1px solid #ccc;' +
          'height: 28px;' +
          'width: 80px;' +
          '-webkit-appearance: none;' +
          '-moz-appearance: none;' +
          '-webkit-border-radius: 0px;' +
          'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzA5MTZFN0RFMDY2MTFFNEIyODZFMURFRTA3REUxMjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzA5MTZFN0VFMDY2MTFFNEIyODZFMURFRTA3REUxMjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMDkxNkU3QkUwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMDkxNkU3Q0UwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvMrdUAAAABiSURBVHjaYkxLS3vNwMAgwoAfvGUCEjkMhEE285kzZ65u2bLlJ5DjgkNRxUwgYPz//z+Yl56ePhNIpaEpAqnJADGYkASzgHgnEn8HyEoYB24i1FReILUPynUEmvYFJgcQYACYah+uDhpKGAAAAABJRU5ErkJggg==);' +
          'background-position: 65px 12px;' +
          'background-repeat: no-repeat;' +
          'background-color:  #F7F7F7;' +
          'float: left;' +
          'margin-right: 6px'
        );
      }
    },
    selectLabels: function (hps) {
      var ids = ['heartland-expiration-month-label', 'heartland-expiration-year-label'];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.setStyle(ids[i],
          'position:absolute;' +
          'width:1px;' +
          'height:1px;' +
          'padding:0;' +
          'margin:-1px;' +
          'overflow:hidden;' +
          'clip:rect(0,0,0,0);' +
          'border:0;'
        );
      }
    },
    cvvContainer: function (hps) {
      hps.setStyle('heartland-cvv-container',
        'width: 110px;' +
        'display: inline-block;' +
        'float: left;'
      );
    },
    cvv: function (hps) {
      hps.appendStyle('heartland-cvv', 'width: 110px;');
    }
  };

  // heartland.Messages (constructor)
  //
  // Initializes a new object for wrapping `window.postMessage` and a fallback
  // method for legacy browsers.
  heartland.Messages = function Messages(hps){
    this.hps = hps;
    this.interval_id = null;
    this.lastHash = null;
    this.pushIntervalStarted = false;
  };

  // heartland.Messages.pushMessages
  //
  // For legacy browsers, a mailbox (buffer) must be used to ensure all messages
  // are sent between parent and child windows. When ready, this function builds
  // the final message, encodes it, sends it, and resets the mailbox to `[]`.
  heartland.Messages.prototype.pushMessages = function pushMessages(hps) {
    return function () {
      var message = [];
      var i = 0, length = 0;
      var target_url = null;
      var current = null;
      var targetNode = null;

      length = hps.mailbox.length;
      if (!length) {
        return;
      }

      for (i = 0; i < length; i++) {
        current = hps.mailbox.shift();
        if (!target_url) {
          target_url = current.targetUrl;
          targetNode = current.targetNode;
        }
        message.push(current.message);
      }

      if (message !== []) {
        message = JSON.stringify(message);
        targetNode.location = target_url.replace(/#.*$/, '') + '#' +
          (+new Date()) + (hps.cache_bust++) + '&' +
          encodeURIComponent(message);
      }

      message.length = 0;
      hps.mailbox.length = 0;
    };
  };

  // heartland.Messages.post
  //
  // When present, wraps the built-in `window.postMessage`. When not present,
  // pushes the message onto the mailbox for eventual sending, and on first use,
  // starts the interval for `Messages.pushMessages`.
  heartland.Messages.prototype.post = function post(message, target) {
    var frame;
    var targetNode;
    var targetUrl;

    if (!this.hps.frames) {
      return;
    }

    frame = this.hps[target] || this.hps.frames[target];

    if (!frame) {
      return;
    }

    targetNode = frame.targetNode || frame.frame || frame;
    targetUrl = frame.url;

    if (window.postMessage) {
      targetNode.postMessage(
        message,
        targetUrl
      );
    } else {
      this.hps.mailbox.push({
        message: message,
        targetUrl: targetUrl,
        targetNode: targetNode
      });
      if (!this.pushIntervalStarted) {
        setInterval(this.pushMessages(this.hps), 100);
      }
    }
  };

  // heartland.Messages.receive
  //
  // When present, wraps the built-in `window.postMesage`'s `message` or
  // `onmessage` window events. When not present, uses a single interval to
  // check for changes to `window.location.hash` when the other window sends a
  // message and will decode the JSON and URI encoded hash.
  heartland.Messages.prototype.receive = function receive(callback, source_origin) {
    if (window.postMessage) {
      if (window.addEventListener) {
        window[callback ? 'addEventListener' : 'removeEventListener']('message', callback, !1);
      } else {
        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', callback);
      }
    } else {
      if (this.interval_id) {
        clearInterval(this.interval_id);
      }
      this.interval_id = null;

      if (callback) {
        this.interval_id = setInterval(function(){
          var hash = document.location.hash,
          re = /^#?\d+&/;
          if (hash !== this.lastHash && re.test(hash)) {
            var m = {};
            var i;
            m.data = JSON.parse(decodeURIComponent(hash.replace(re, '')));
            this.lastHash = hash;
            if (Object.prototype.toString.call(m.data) !== '[object Array]') {
              callback(m);
              return;
            }

            for (i in m.data) {
              callback({data: m.data[i]});
            }
          }
        }, 100);
      }
    }
    heartland.Events.trigger('receiveMessageHandlerAdded', document);
  };
}(window, document));
