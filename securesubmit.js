//JSON2
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,a=e[t];switch(a&&"object"==typeof a&&"function"==typeof a.toJSON&&(a=a.toJSON(t)),"function"==typeof rep&&(a=rep.call(e,t,a)),typeof a){case"string":return quote(a);case"number":return isFinite(a)?a+"":"null";case"boolean":case"null":return a+"";case"object":if(!a)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(a)){for(f=a.length,r=0;f>r;r+=1)u[r]=str(r,a)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));else for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","    ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

(function () {
	// Messages (constructor)
	//
	// Initializes a new object for wrapping `window.postMessage` and a fallback
	// method for legacy browsers.
	window.Messages = function (){
    this.interval_id = null;
    this.last_hash = null;
    this.window = window;
    this.pushIntervalStarted = false;
	};

	// Messages.pushMessages
	//
	// For legacy browsers, a mailbox (buffer) must be used to ensure all messages
	// are sent between parent and child windows. When ready, this function builds
	// the final message, encodes it, sends it, and resets the mailbox to `[]`.
	Messages.prototype.pushMessages = function () {
    var message = [];
    var i = 0, length = 0;
    var target_url = null;
		var current = null;
		var targetNode = null;

    length = window.HPS.mailbox.length;
    if (!length) {
      return;
    }

    for (i = 0; i < length; i++) {
      current = window.HPS.mailbox.shift();
      if (!target_url) {
        target_url = current.targetUrl;
        targetNode = current.targetNode;
      }
      message.push(current.message);
    }

    if (message !== []) {
      message = JSON.stringify(message);
      targetNode.location = target_url.replace(/#.*$/, '') + '#' +
				(+new Date()) + (window.HPS.cache_bust++) + '&' +
				encodeURIComponent(message);
    }

    message.length = 0;
    window.HPS.mailbox.length = 0;
	};

	// Messages.postMessage
	//
	// When present, wraps the built-in `window.postMessage`. When not present,
	// pushes the message onto the mailbox for eventual sending, and on first use,
	// starts the interval for `Messages.pushMessages`.
	Messages.prototype.postMessage = function(message, target_url, target) {
    var targetNode;
    if (!target_url) {
    	return;
    }

    targetNode = this.window.HPS[target];
console.log(target);
console.log(targetNode);
    if (this.window.postMessage) {
      targetNode.postMessage(message, target_url.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));
    } else if (target_url) {
      this.window.HPS.mailbox.push({
        message: message,
        targetUrl: target_url,
        targetNode: targetNode
      });
      if (!this.pushIntervalStarted) {
        setInterval(this.pushMessages, 100);
      }
    }
	};

	// Messages.postMessage
	//
	// When present, wraps the built-in `window.postMesage`'s `message` or
	// `onmessage` window events. When not present, uses a single interval to
	// check for changes to `window.location.hash` when the other window sends a
	// message and will decode the JSON and URI encoded hash.
	Messages.prototype.receiveMessage = function(callback, source_origin) {
    if (this.window.postMessage) {
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
          if (hash !== this.last_hash && re.test(hash)) {
            var m = {};
            var i;
            m.data = JSON.parse(decodeURIComponent(hash.replace(re, '')));
            this.last_hash = hash;
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
    triggerEvent('receiveMessageHandlerAdded', document);
	};

	function triggerEvent(name, target, data) {
		var event = target.createEvent('Event');
		event.initEvent(name, true, true);
		target.dispatchEvent(event);
	}
}());

(function() {
	'use strict';

	var urls = {
		CERT: 'https://posgateway.cert.secureexchange.net/Hps.Exchange.PosGateway.Hpf.v1/api/token',
		PROD: 'https://api.heartlandportico.com/SecureSubmit.v1/api/token',
    iframeCERT: "https://hps.github.io/token/2.0/",
    iframePROD: "https://api2.heartlandportico.com/SecureSubmit.v1/token/2.0/"
	};

	var defaults = {
		'api_key': '',
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
		'type': '',
		'useDefaultStyles': true
	};

	/// Public API

  // HPS (constructor)
	//
	// Initializes options and adds the default form handler if a `form_id` is
	// passed as an option. This expects the default fields (see `getFields`) to
	// be present as children of `form_id`.
	window.HPS = function() {
		if (arguments[0] && typeof arguments[0] === 'object') {
			this.options = applyOptions(defaults, arguments[0]);
		}

		this.options.env = this.options.api_key.split('_')[1];

		if (this.options.env === 'cert') {
			this.options.gateway_url = urls.CERT;
		} else {
			this.options.gateway_url = urls.PROD;
		}

		if (this.options.form_id.length > 0) {
			addFormHandler(this.options);
		}

		if (this.options.type === 'iframe') {
			this.parent = null;
			this.parent_url = '';
			this.child = null;
			this.iframe_url = '';

			this.Messages = new window.Messages();
			this.mailbox = [];
			this.cache_bust = 1;
			configureIframe(this);
		}
	};

	// HPS.tokenize
	//
	// Tokenizes card data. Used in manual integrations where the merchant's
	// credit card fields cannot/do not match the names expected in the default
	// form handler (see `getFields`).
	HPS.prototype.tokenize = function() {
		callAjax('pan', this.options);
	};

	// HPS.tokenize_swipe
	//
	// Tokenizes track data. Used in manual integrations where the merchant
	// wishes to process CP with a card reader.
	HPS.prototype.tokenize_swipe = function () {
		callAjax('swipe', this.options);
  };

	// HPS.tokenize_encrypted_card
	//
	// Tokenizes encrypted track data. Used in manual integrations where the
	// merchant wishes to process CP with an E3 reader, e.g. the E3 wedge reader.
  HPS.prototype.tokenize_encrypted_card = function () {
		callAjax('encrypted', this.options);
  };

	// HPS.configureInternalIframe
	//
	// Sets up a child iframe window to prepare it for communication with the
	// parent and for tokenization.
  HPS.prototype.configureInternalIframe = function (options) {
    this.parent = window.parent;
    this.Messages = new window.Messages();
    this.parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''));

    addEventHandler(window, 'load', function () {
      resizeFrame(this);
    });

    addEventHandler(document, 'receiveMessageHandlerAdded', function () {
      this.Messages.postMessage({action: "receiveMessageHandlerAdded"}, this.parent_url, 'parent');
    });

    this.Messages.receiveMessage(function (m) {
      switch(m.data.action) {
        case 'tokenize': {
          tokenizeIframe(this, m.data.message);
          break;
        }
        case 'setStyle': {
          setStyle(m.data.id, m.data.style);
          resizeFrame(this);
          break;
        }
        case 'appendStyle': {
          appendStyle(m.data.id, m.data.style);
          resizeFrame(this);
          break;
        }
        case 'setText': {
          setText(m.data.id, m.data.text);
          resizeFrame(this);
          break;
        }
        case 'setPlaceholder': {
          setPlaceholder(m.data.id, m.data.text);
          break;
        }
      }
    }, '*');
  };

	// HPS.resizeIFrame
	//
	// Called automatically when the child iframe window alerts the parent to
	// resize.
	HPS.prototype.resizeIFrame = function (frame, height) {
    frame.style.height = (parseInt(height, 10)) + 'px';
  };

	// HPS.setText
	//
	// Public API for setting an element's inner text.
  HPS.prototype.setText = function (elementid, elementtext) {
    this.Messages.postMessage({action: "setText", id: elementid, text: elementtext}, this.iframe_url, 'child');
  };

	// HPS.setStyle
	//
	// Public API for setting an element's style.
  HPS.prototype.setStyle = function (elementid, elementstyle) {
    this.Messages.postMessage({action: "setStyle", id: elementid, style: elementstyle}, this.iframe_url, 'child');
  };

	// HPS.appendStyle
	//
	// Public API for appending to an element's style.
  HPS.prototype.appendStyle = function (elementid, elementstyle) {
    this.Messages.postMessage({action: "appendStyle", id: elementid, style: elementstyle}, this.iframe_url, 'child');
  };

	/// Private API

	// configureIframe
  function configureIframe(HPS) {
		var frame;
		var options = HPS.options;
		var target = document.getElementById(options.iframeTarget);
		HPS.Messages = HPS.Messages || new window.Messages();

    if (options.env === "cert") {
      HPS.iframe_url = urls.iframeCERT;
    } else {
      HPS.iframe_url = urls.iframePROD;
    }

    if (options.targetType === 'myframe') {
      frame = target;
      HPS.iframe_url = frame.src;
    } else {
      frame = document.createElement('iframe');
      frame.id = 'securesubmit-iframe';
      frame.style.border = '0';
      frame.scrolling = 'no';
      target.appendChild(frame);
    }

    HPS.iframe_url = HPS.iframe_url + '#' + encodeURIComponent(document.location.href.split('#')[0]);
    frame.src = HPS.iframe_url;

    HPS.frame = frame;
    if (window.postMessage) {
      HPS.child = frame.contentWindow;
    } else {
      HPS.child = frame;
    }

    if (options.useDefaultStyles === false) {
      useDefaultStyles = false;
    }

    addEventHandler(options.buttonTarget, 'click', function () {
      HPS.Messages.postMessage({action: "tokenize", message: options.public_key}, HPS.iframe_url, 'child');
    });

    HPS.Messages.receiveMessage(function(m){
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
          HPS.resizeIFrame(frame, m.data.height);
          break;
        }
        case 'receiveMessageHandlerAdded': {
          if (options.useDefaultStyles) {
            defaultStyles.body(HPS);
            defaultStyles.labelsAndLegend(HPS);
            defaultStyles.inputsAndSelects(HPS);
            defaultStyles.fieldset(HPS);
            defaultStyles.selects(HPS);
            defaultStyles.selectLabels(HPS);
            defaultStyles.cvvContainer(HPS);
            defaultStyles.cvv(HPS);
          }
          triggerEvent('securesubmitIframeReady', document);
          break;
        }
      }
    }, '*');
  }

	function addEventHandler(target, event, callback) {

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
	}

	function triggerEvent(name, target, data) {
		var event = target.createEvent('Event');
		event.initEvent(name, true, true);
		target.dispatchEvent(event);
	}

	// tokenizeIframe
	//
	// Tokenizes card data. Used in iframe integrations to tokenize on Heartland's
	// servers.
  function tokenizeIframe(HPS) {
    var tokenValue;

    HPS.tokenize({
      data: {
        public_key: public_key,
        number: document.getElementById('heartland-card-number').value,
        cvc: document.getElementById('heartland-cvv').value,
        exp_month: document.getElementById('heartland-expiration-month').value,
        exp_year: document.getElementById('heartland-expiration-year').value
      },
      success: function(response) {
        HPS.Messages.postMessage({action: "onTokenSuccess", response: response}, HPS.parent_url, 'parent');
      },
      error: function (response) {
        HPS.Messages.postMessage({action: "onTokenError", response: response}, HPS.parent_url, 'parent');
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
			var cardType = getCardType(fields.card_number);

			options.card_number = fields.card_number;
			options.card_exp_month = fields.card_expiration_month;
			options.card_exp_year = fields.card_expiration_year;
			options.card_cvc = fields.card_cvc;

			callAjax(options, cardType, fields.card_number.slice(-4));
		};

		addEventHandler(payment_form, 'submit', code);
		addField(options.form_id, 'hidden', 'api_key', options.api_key);
	}

	// getCardType
	//
	// Parses a credit card number to obtain the card type/brand.
	function getCardType(number) {
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
	}

	// applyOptions
	//
	// Creates a single object by merging a `source` (default) and `properties`
	// obtained elsewhere, e.g. a function argument in `HPS`. Any properties in
	// `properties` will overwrite matching properties in `source`.
	function applyOptions(source, properties) {
		var property;

		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}

		return source;
	}

	// throwError
	//
	// Allows a merchant-defined error handler to be used in cases where the
	// tokenization process fails. If not provided, we throw the message as a
	// JS runtime error.
	function throwError(options, errorMessage) {
		if (typeof(options.error) === 'function') {
			options.error(errorMessage);
		} else {
			throw errorMessage;
		}
	}

	// jsonp
	//
	// Creates a new DOM node containing a created JSONP callback handler for an
	// impending Ajax JSONP request. Removes need for `XMLHttpRequest`.
	function jsonp(url, callback) {
		var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
		window[callbackName] = function(data) {
			delete window[callbackName];
			document.body.removeChild(script);
			callback(data);
		};

		var script = document.createElement('script');
		script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
		document.body.appendChild(script);
	}

	// callAjax
	//
	// Sets up a request to be passed to `jsonp`. On successful tokenization,
	// `options.success` will be called with the tokenization data as the only
	// argument passed.
	function callAjax(type, options) {
		var number = options.card_number.trim();
		var lastfour = number.slice(-4);
		var cardType = getCardType(number);
		var params = getParams(type, options);

		jsonp(options.gateway_url + params, function(data) {
			console.log(data);
			if (data.error) {
				throwError(options, data);
			} else {
				data.last_four = lastfour;
				data.card_type = cardtype;
				data.exp_month = options.card_exp_month;
				data.exp_year = options.card_exp_year;

				if (options.form_id.length > 0) {
					addField(options.form_id, 'hidden', 'token_value', data.token_value);
					addField(options.form_id, 'hidden', 'last_four', lastfour);
					addField(options.form_id, 'hidden', 'card_exp_year', options.card_exp_year);
					addField(options.form_id, 'hidden', 'card_exp_month', options.card_exp_month);
					addField(options.form_id, 'hidden', 'card_type', cardtype);
				}

				options.success(data);
			}
		});
	}

	// getParams
	//
	// Builds param list for a particular `type` from expected properties in
	// `data`.
	function getParams(type, data) {
		var params = '';
		switch (type) {
			case 'pan':
				params += '?token_type=supt&_method=post&api_key=' + data.api_key.trim();
				params += '&card%5Bnumber%5D=' + data.card_number.trim();
				params += '&card%5Bexp_month%5D=' + data.card_exp_month.trim();
				params += '&card%5Bexp_year%5D=' + data.card_exp_year.trim();
				params += '&card%5Bcvc%5D=' + data.card_cvc.trim();
				break;
			case 'swipe':
				params += '?token_type=supt&_method=post&api_key=' + data.api_key.trim();
				params += '&card%5track_method%5D=swipe';
				params += '&card%5track%5D=' + data.track.trim();
				break;
			case 'encrypted':
				params += '?token_type=supt&_method=post&api_key=' + data.api_key.trim();
				params += '&encrypted%5track_method%5D=swipe';
				params += '&encrypted%5track%5D=' + data.track.trim();
				params += '&encrypted%5track_number%5D=' + data.track_number.trim();
				params += '&encrypted%5ktb%5D=' + data.ktb.trim();
				params += '&encrypted%5pin_block%5D=' + data.pin_block.trim();
				break;
			default:
				throwError(options, 'unknown params type');
				break;
		}
		return params;
	}

	// addField
	//
	// Adds a DOM `input` node to `formParent` with type `fieldType`, name
	// `fieldName`, and value `fieldValue`.
	function addField(formParent, fieldType, fieldName, fieldValue) {
		var input = document.createElement('input');

		input.setAttribute('type', fieldType);
		input.setAttribute('name', fieldName);
		input.setAttribute('value', fieldValue);

		document.getElementById(formParent).appendChild(input);
	}

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

	// setStyle
	//
	// Sets an element's style attribute within a child iframe window.
	function setStyle(elementid, htmlstyle) {
    document.getElementById(elementid).setAttribute('style', htmlstyle);
  }

	// appendStyle
	//
	// Appends an element's style attribute within a child iframe window.
  function appendStyle(elementid, htmlstyle) {
    var currstyle = $('#' + elementid).attr('style');
    var newstyle = (currstyle ? currstyle : '') + htmlstyle;
    document.getElementById(elementid).setAttribute('style', newstyle);
  }

	// setText
	//
	// Sets an element's inner text within a child iframe window.
  function setText(elementid, text) {
    document.getElementById(elementid).innerHTML = text;
  }

	// setPlaceholder
	//
	// Sets an element's placeholder attribute within a child iframe window.
  function setPlaceholder(elementid, text) {
    document.getElementById(elementid).placeholder = text;
  }

	// resizeFrame
	//
	// Alerts a parent window to resize the iframe.
  function resizeFrame(HPS) {
    var docHeight = jQuery('html').height();
    HPS.Messages.postMessage({action: "resize", height: docHeight}, HPS.parent_url, 'parent');
  }

	// defaultStyles
	//
	// Collection of helper functions for applying default styles to a child
	// window's fields. Serves as an example of these methods' use in merchant
	// modifications.
  var defaultStyles = {
    body: function (HPS) {
      HPS.setStyle('heartland-body',
        'margin: 0;' +
        "font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;" +
        'color: #666;'
      );
    },
    labelsAndLegend: function (HPS) {
      var ids = [
        'heartland-card-number-label',
        'heartland-expiration-date-legend',
        'heartland-expiration-month-label',
        'heartland-expiration-year-label',
        'heartland-cvv-label'
      ];
      var i = 0, length = ids.length;
			for (i; i < length; i++) {
        HPS.setStyle(ids[i],
          'font-size: 13px;' +
          'text-transform: uppercase;' +
          'font-weight: bold;' +
          'display: block;' +
          'width: 100%;' +
          'clear: both;'
        );
      }
    },
    inputsAndSelects: function (HPS) {
      var ids = [
        'heartland-card-number',
        'heartland-expiration-month',
        'heartland-expiration-year',
        'heartland-cvv'
      ];
      var i = 0, length = ids.length;
			for (i; i < length; i++) {
        HPS.setStyle(ids[i],
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
    fieldset: function (HPS) {
      HPS.setStyle('heartland-expiration-date-container',
        'border: 0;' +
        'margin: 0 25px 0px 1px;' +
        'padding: 0;' +
        'width: 173px;' +
        'display: inline-block;' +
        'float:  left;'
      );
    },
    selects: function (HPS) {
      var ids = ['heartland-expiration-month', 'heartland-expiration-year'];
      var i = 0, length = ids.length;
			for (i; i < length; i++) {
        HPS.appendStyle(ids[i],
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
    selectLabels: function (HPS) {
      var ids = ['heartland-expiration-month-label', 'heartland-expiration-year-label'];
      var i = 0, length = ids.length;
			for (i; i < length; i++) {
        HPS.setStyle(ids[i],
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
    cvvContainer: function (HPS) {
      HPS.setStyle('heartland-cvv-container',
        'width: 110px;' +
        'display: inline-block;' +
        'float: left;'
      );
    },
    cvv: function (HPS) {
      HPS.appendStyle('heartland-cvv', 'width: 110px;');
    }
  };
}());
