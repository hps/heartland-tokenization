/// <reference path="../types/Options" />
var Heartland;
(function (Heartland) {
    Heartland.defaults = {
        _method: 'post',
        buttonTarget: '',
        cardCvv: '',
        cardExpMonth: '',
        cardExpYear: '',
        cardNumber: '',
        cardType: '',
        env: 'prod',
        error: null,
        fields: {},
        formId: '',
        gatewayUrl: '',
        iframeTarget: '',
        ktb: '',
        object: 'token',
        onTokenError: null,
        onTokenSuccess: null,
        pinBlock: '',
        publicKey: '',
        success: null,
        targetType: '',
        tokenType: 'supt',
        track: '',
        trackNumber: '',
        type: 'pan',
        useDefaultStyles: true
    };
})(Heartland || (Heartland = {}));
/* -----------------------------------------------------------------------------
This file is based on or incorporates material from the projects listed below
(collectively, "Third Party Code"). Microsoft is not the original author of the
Third Party Code. The original copyright notice and the license, under which
Microsoft received such Third Party Code, are set forth below. Such licenses
and notices are provided for informational purposes only. Microsoft, not the
third party, licenses the Third Party Code to you under the terms of the
Apache License, Version 2.0. See License.txt in the project root for complete
license information. Microsoft reserves all rights not expressly granted under
the Apache 2.0 License, whether by implication, estoppel or otherwise.
----------------------------------------------------------------------------- */
/*
    json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/
/*jslint evil: true, regexp: true */
/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/
// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
var JSON2 = {};
(function () {
    'use strict';
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
        };
        var strProto = String.prototype;
        var numProto = Number.prototype;
        numProto.JSON = strProto.JSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }, rep;
    function quote(string) {
        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        // Produce a string from holder[key].
        var i, // The loop counter.
        k = null, // The member key.
        v, // The member value.
        length, mind = gap, partial, value = holder[key];
        // If the value has a toJSON method, call it to obtain a replacement value.
        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        // What happens next depends on the value's type.
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                // JSON numbers must be finite. Encode non-finite numbers as null.
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.
                return String(value);
            // If the type is 'object', we might be dealing with an object or an array or
            // null.
            case 'object':
                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.
                if (!value) {
                    return 'null';
                }
                // Make an array to hold the partial: string[] results of stringifying this object value.
                gap += indent;
                partial = [];
                // Is the value an array?
                if (Object.prototype.toString.apply(value, []) === '[object Array]') {
                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i.toString(), value) || 'null';
                    }
                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.
                    v = partial.length === 0
                        ? '[]'
                        : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                // If the replacer is an array, use it to select the members to be stringified.
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                else {
                    // Otherwise, iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.
                v = partial.length === 0
                    ? '{}'
                    : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    // If the JSON object does not yet have a stringify method, give it one.
    if (typeof JSON2.stringify !== 'function') {
        JSON2.stringify = function (value, replacer, space) {
            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.
            var i;
            gap = '';
            indent = '';
            // If the space parameter is a number, make an indent string containing that
            // many spaces.
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            }
            else if (typeof space === 'string') {
                indent = space;
            }
            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.
            return str('', { '': value });
        };
    }
    // If the JSON object does not yet have a parse method, give it one.
    if (typeof JSON2.parse !== 'function') {
        JSON2.parse = function (text, reviver) {
            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.
            var j;
            function walk(holder, key) {
                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.
                var k = null, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            }
                            else {
                                value[k] = undefined;
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.
            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.
                j = eval('(' + text + ')');
                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.
                return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
            }
            // If the text is not JSON parseable, then a SyntaxError is thrown.
            throw new SyntaxError('JSON.parse');
        };
    }
}());
/// <reference path="HPS.ts" />
var Heartland;
(function (Heartland) {
    /**
     * @namespace Heartland.DOM
     */
    var DOM;
    (function (DOM) {
        /**
         * Heartland.DOM.configureField
         *
         * Configures an input field in a single field iFrame.
         *
         * @param {Heartland.HPS} hps
         */
        function configureField(hps) {
            document.getElementById('heartland-field').setAttribute('name', hps.field);
        }
        DOM.configureField = configureField;
        /**
         * Heartland.DOM.makeFrame
         *
         * Creates a single iFrame element with the appropriate defaults.
         *
         * @param {string} name
         * @returns {HTMLIframeElement}
         */
        function makeFrame(name) {
            var frame = document.createElement('iframe');
            frame.id = 'heartland-frame-' + name;
            frame.name = name;
            frame.style.border = '0';
            frame.scrolling = 'no';
            return frame;
        }
        DOM.makeFrame = makeFrame;
        /**
         * Heartland.DOM.addField
         *
         * Adds a DOM `input` node to `formParent` with type `fieldType`, name
         * `fieldName`, and value `fieldValue`.
         *
         * @param {string} formParent
         * @param {string} fieldType
         * @param {string} fieldName
         * @param {string} fieldValue
         */
        function addField(formParent, fieldType, fieldName, fieldValue) {
            var input = document.createElement('input');
            input.setAttribute('type', fieldType);
            input.setAttribute('name', fieldName);
            input.setAttribute('value', fieldValue);
            document.getElementById(formParent).appendChild(input);
        }
        DOM.addField = addField;
        /**
         * Heartland.DOM.setStyle
         *
         * Sets an element's style attribute within a child iframe window.
         *
         * @param {string} elementid
         * @param {string} htmlstyle
         */
        function setStyle(elementid, htmlstyle) {
            var el = document.getElementById(elementid);
            if (el) {
                el.setAttribute('style', encodeEntities(htmlstyle));
            }
        }
        DOM.setStyle = setStyle;
        /**
         * Heartland.DOM.appendStyle
         *
         * Appends an element's style attribute within a child iframe window.
         *
         * @param {string} elementid
         * @param {String} htmlstyle
         */
        function appendStyle(elementid, htmlstyle) {
            var el = document.getElementById(elementid);
            if (el) {
                var currstyle = el.getAttribute('style');
                var newstyle = (currstyle ? currstyle : '') + htmlstyle;
                el.setAttribute('style', encodeEntities(newstyle));
            }
        }
        DOM.appendStyle = appendStyle;
        /**
         * Heartland.DOM.setText
         *
         * Sets an element's inner text within a child iframe window.
         *
         * @param {string} elementid
         * @param {string} text
         */
        function setText(elementid, text) {
            var el = document.getElementById(elementid);
            if (el) {
                el.textContent = encodeEntities(text);
            }
        }
        DOM.setText = setText;
        /**
         * Heartland.DOM.setPlaceholder
         *
         * Sets an element's placeholder attribute within a child iframe window.
         *
         * @param {string} elementid
         * @param {string} text
         */
        function setPlaceholder(elementid, text) {
            var el = document.getElementById(elementid);
            if (el) {
                if (text === '•••• •••• •••• ••••' || text === '••••' || text === '•••') {
                    el.setAttribute('placeholder', text);
                }
                else {
                    el.setAttribute('placeholder', encodeEntities(text));
                }
            }
        }
        DOM.setPlaceholder = setPlaceholder;
        /**
         * Heartland.DOM.resizeFrame
         *
         * Alerts a parent window to resize the iframe.
         *
         * @param {Heartland.HPS} hps
         */
        function resizeFrame(hps) {
            var html = document.getElementsByTagName('html')[0];
            var docHeight = html.offsetHeight + 1; // off by one error
            hps.Messages.post({ action: 'resize', height: docHeight }, 'parent');
        }
        DOM.resizeFrame = resizeFrame;
        /**
         * Heartland.DOM.setFieldData
         *
         * Receives a field value from another frame prior to the tokenization process.
         *
         * @param {string} elementid
         * @param {string} value
         */
        function setFieldData(elementid, value) {
            var el = document.getElementById(elementid);
            if (!el && document.getElementById('heartland-field')) {
                el = document.createElement('input');
                el.setAttribute('id', encodeEntities(elementid));
                el.setAttribute('type', 'hidden');
                document.getElementById('heartland-field-wrapper').appendChild(el);
            }
            if (el) {
                el.setAttribute('value', encodeEntities(value));
            }
        }
        DOM.setFieldData = setFieldData;
        /**
         * Heartland.DOM.getFieldData
         *
         * Retrieves a field value for another frame prior to the tokenization process.
         *
         * @param {Heartland.HPS} hps
         * @param {string} elementid
         */
        function getFieldData(hps, elementid) {
            var el = document.getElementById(elementid);
            if (el) {
                hps.Messages.post({ action: 'passData', value: el.value }, 'parent');
            }
        }
        DOM.getFieldData = getFieldData;
        /**
         * Escapes all potentially dangerous characters, so that the
         * resulting string can be safely inserted into attribute or
         * element text.
         *
         * @param value
         * @returns {string} escaped text
         */
        function encodeEntities(value) {
            return value.
                replace(/&/g, '&amp;').
                replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (v) {
                var hi = v.charCodeAt(0);
                var low = v.charCodeAt(1);
                return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
            }).
                replace(/([^\#-~| |!])/g, function (v) {
                return '&#' + v.charCodeAt(0) + ';';
            }).
                replace(/</g, '&lt;').
                replace(/>/g, '&gt;');
        }
        /**
         * Heartland.DOM.addStylesheet
         *
         * Creates a `style` node in the DOM with the given `css`.
         *
         * @param {Heartland.HPS} hps
         * @param {string} elementid
         */
        function addStylesheet(css) {
            var el = document.createElement('style');
            var elements = document.getElementsByTagName('head');
            el.type = 'text/css';
            el.appendChild(document.createTextNode(css));
            if (elements && elements[0]) {
                elements[0].appendChild(el);
            }
        }
        DOM.addStylesheet = addStylesheet;
        /**
         * Heartland.DOM.json2css
         *
         * Converts a JSON node to text representing CSS.
         *
         * @param {string} json
         * @returns {string}
         */
        function json2css(json) {
            var css = '';
            var attributes;
            var children;
            var i, j;
            var key, value;
            if (attributes = jsonAttributes(json)) {
                var attributesLength = attributes.length;
                for (i = 0; i < attributesLength; i++) {
                    key = attributes[i];
                    value = json[key];
                    if (isArray(value)) {
                        var arrLength = value.length;
                        for (j = 0; j < arrLength; j++) {
                            css += key + ':' + value[j] + ';';
                        }
                    }
                    else {
                        css += key + ':' + value + ';';
                    }
                }
            }
            if (children = jsonChildren(json)) {
                var childrenLength = children.length;
                for (i = 0; i < childrenLength; i++) {
                    key = children[i];
                    value = json[key];
                    css += key + '{' + json2css(value) + '}';
                }
            }
            return css;
        }
        DOM.json2css = json2css;
        /**
         * Heartland.DOM.setFocus
         *
         * Sets the focus on an iframe's field.
         *
         * @param {Heartland.HPS} hps
         * @param {string} elementid
         */
        function setFocus() {
            var el = document.getElementById('heartland-field');
            if (el) {
                el.focus();
            }
        }
        DOM.setFocus = setFocus;
        /***********
         * Helpers *
         ***********/
        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        function jsonAttributes(json) {
            var set = [];
            var i;
            for (i in json) {
                if (json.hasOwnProperty(i)
                    && (typeof json[i] === 'string' || isArray(json[i]))) {
                    set.push(i);
                }
            }
            return set;
        }
        function jsonChildren(json) {
            var set = [];
            var i;
            for (i in json) {
                if (json.hasOwnProperty(i)
                    && (Object.prototype.toString.call(json[i]) === '[object Object]')) {
                    set.push(i);
                }
            }
            return set;
        }
    })(DOM = Heartland.DOM || (Heartland.DOM = {}));
})(Heartland || (Heartland = {}));
/// <reference path="../types/CardType.ts" />
var Heartland;
(function (Heartland) {
    var Card;
    (function (Card) {
        Card.types = [
            {
                code: 'visa',
                format: /(\d{1,4})/g,
                length: 16,
                regex: /^4/
            },
            {
                code: 'mastercard',
                format: /(\d{1,4})/g,
                length: 16,
                regex: /^(5[1-5]|2[2-7])/
            },
            {
                code: 'amex',
                format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                length: 15,
                regex: /^3[47]/
            },
            {
                code: 'diners',
                format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
                length: 14,
                regex: /^3[0689]/
            },
            {
                code: 'discover',
                format: /(\d{1,4})/g,
                length: 16,
                regex: /^6([045]|22)/
            },
            {
                code: 'jcb',
                format: /(\d{1,4})/g,
                length: 16,
                regex: /^35/
            }
        ];
    })(Card = Heartland.Card || (Heartland.Card = {}));
})(Heartland || (Heartland = {}));
var Heartland;
(function (Heartland) {
    Heartland.urls = {
        CERT: 'https://cert.api2.heartlandportico.com/Hps.Exchange.PosGateway.Hpf.v1/api/token',
        PROD: 'https://api2.heartlandportico.com/SecureSubmit.v1/api/token',
        iframeCERT: 'https://hps.github.io/token/2.1/',
        iframePROD: 'https://api2.heartlandportico.com/SecureSubmit.v1/token/2.1/'
    };
})(Heartland || (Heartland = {}));
/// <reference path="../types/CardType.ts" />
/// <reference path="../types/Formatter.ts" />
/// <reference path="../Card.ts" />
var Heartland;
(function (Heartland) {
    var Formatter;
    (function (Formatter) {
        var CardNumber = (function () {
            function CardNumber() {
            }
            CardNumber.prototype.format = function (number) {
                var type;
                var matches;
                number = number.replace(/\D/g, '');
                type = Heartland.Card.typeByNumber(number);
                if (!type) {
                    return number;
                }
                matches = number.match(type.format);
                if (!matches) {
                    return number;
                }
                if (!type.format.global) {
                    matches.shift();
                }
                return matches.join(' ');
            };
            return CardNumber;
        })();
        Formatter.CardNumber = CardNumber;
    })(Formatter = Heartland.Formatter || (Heartland.Formatter = {}));
})(Heartland || (Heartland = {}));
/// <reference path="../types/Formatter.ts" />
var Heartland;
(function (Heartland) {
    var Formatter;
    (function (Formatter) {
        var Expiration = (function () {
            function Expiration() {
            }
            Expiration.prototype.format = function (exp) {
                var pat = /^\D*(\d{1,2})(\D+)?(\d{1,4})?/;
                var groups = exp.match(pat);
                var month;
                var del;
                var year;
                if (!groups) {
                    return '';
                }
                month = groups[1] || '';
                del = groups[2] || '';
                year = groups[3] || '';
                if (year.length > 0) {
                    del = ' / ';
                }
                else if (month.length === 2 || del.length > 0) {
                    del = ' / ';
                }
                else if (month.length === 1 && (month !== '0' && month !== '1')) {
                    del = ' / ';
                }
                if (month.length === 1 && del !== '') {
                    month = '0' + month;
                }
                // if (year.length === 2) {
                //   year = (new Date).getFullYear().toString().slice(0, 2) + year;
                // }
                return month + del + year;
            };
            return Expiration;
        })();
        Formatter.Expiration = Expiration;
    })(Formatter = Heartland.Formatter || (Heartland.Formatter = {}));
})(Heartland || (Heartland = {}));
/// <reference path="../types/CardType.ts" />
/// <reference path="../types/Validator.ts" />
/// <reference path="../Card.ts" />
var Heartland;
(function (Heartland) {
    var Validator;
    (function (Validator) {
        var CardNumber = (function () {
            function CardNumber() {
            }
            CardNumber.prototype.validate = function (number) {
                var type;
                if (!number) {
                    return false;
                }
                number = number.replace(/[-\s]/g, '');
                type = Heartland.Card.typeByNumber(number);
                if (!type) {
                    return false;
                }
                return Heartland.Card.luhnCheck(number)
                    && number.length === type.length;
            };
            return CardNumber;
        })();
        Validator.CardNumber = CardNumber;
    })(Validator = Heartland.Validator || (Heartland.Validator = {}));
})(Heartland || (Heartland = {}));
/// <reference path="../types/Validator.ts" />
var Heartland;
(function (Heartland) {
    var Validator;
    (function (Validator) {
        var Cvv = (function () {
            function Cvv() {
            }
            Cvv.prototype.validate = function (cvv) {
                if (!cvv) {
                    return false;
                }
                cvv = cvv.replace(/^\s+|\s+$/g, '');
                if (!/^\d+$/.test(cvv)) {
                    return false;
                }
                return 3 <= cvv.length && cvv.length <= 4;
            };
            return Cvv;
        })();
        Validator.Cvv = Cvv;
    })(Validator = Heartland.Validator || (Heartland.Validator = {}));
})(Heartland || (Heartland = {}));
/// <reference path="../types/Validator.ts" />
var Heartland;
(function (Heartland) {
    var Validator;
    (function (Validator) {
        var Expiration = (function () {
            function Expiration() {
            }
            Expiration.prototype.validate = function (exp) {
                var month;
                var year;
                var split;
                var m, y;
                if (!exp) {
                    return false;
                }
                split = exp.split('/');
                m = split[0], y = split[1];
                if (!m || !y) {
                    return false;
                }
                m = m.replace(/^\s+|\s+$/g, '');
                y = y.replace(/^\s+|\s+$/g, '');
                if (!/^\d+$/.test(m)) {
                    return false;
                }
                if (!/^\d+$/.test(y)) {
                    return false;
                }
                month = parseInt(m, 10);
                year = parseInt(y, 10);
                if (!(1 <= month && month <= 12)) {
                    return false;
                }
                // creates date as 1 day past end of
                // expiration month since JS months
                // are 0 indexed
                return (new Date(year, month, 1)) > (new Date);
            };
            return Expiration;
        })();
        Validator.Expiration = Expiration;
    })(Validator = Heartland.Validator || (Heartland.Validator = {}));
})(Heartland || (Heartland = {}));
/// <reference path="types/CardType.ts" />
/// <reference path="vars/cardTypes.ts" />
/// <reference path="Formatter/CardNumber.ts" />
/// <reference path="Formatter/Expiration.ts" />
/// <reference path="Validator/CardNumber.ts" />
/// <reference path="Validator/Cvv.ts" />
/// <reference path="Validator/Expiration.ts" />
var Heartland;
(function (Heartland) {
    /**
     * @namespace Heartland.Card
     */
    var Card;
    (function (Card) {
        /**
         * Heartland.Card.typeByNumber
         *
         * Helper function to grab the CardType for a given card number.
         *
         * @param {string} number - The card number
         * @returns {Heartland.CardType}
         */
        function typeByNumber(number) {
            var cardType;
            var i;
            if (!number) {
                return null;
            }
            for (i in Card.types) {
                cardType = Card.types[i];
                if (cardType.regex.test(number)) {
                    break;
                }
            }
            return cardType;
        }
        Card.typeByNumber = typeByNumber;
        /**
         * Heartland.Card.luhnCheck
         *
         * Runs a mod 10 check on a given card number.
         *
         * @param {string} number - The card number
         * @returns {boolean}
         */
        function luhnCheck(number) {
            var odd = true;
            var sum = 0;
            var digits;
            var i = 0;
            var length = 0;
            var digit;
            if (!number) {
                return false;
            }
            digits = number.split('').reverse();
            length = digits.length;
            for (i; i < length; i++) {
                digit = parseInt(digits[i], 10);
                if (odd = !odd) {
                    digit *= 2;
                }
                if (digit > 9) {
                    digit -= 9;
                }
                sum += digit;
            }
            return sum % 10 === 0;
        }
        Card.luhnCheck = luhnCheck;
        /**
         * Heartland.Card.addType
         *
         * Adds a class to the target element with the card type
         * inferred from the target's current value.
         *
         * @param {Event} e
         */
        function addType(e) {
            var target = e.currentTarget;
            var type = typeByNumber(target.value);
            var length = target.classList.length;
            var i = 0;
            var c = '';
            for (i; i < length; i++) {
                c = target.classList.item(i);
                if (c && c.indexOf('card-type-') === 0) {
                    target.classList.remove(c);
                }
            }
            if (type) {
                target.classList.add('card-type-' + type.code);
            }
        }
        Card.addType = addType;
        /**
         * Heartland.Card.formatNumber
         *
         * Formats a target element's value based on the
         * inferred card type's formatting regex.
         *
         * @param {Event} e
         */
        function formatNumber(e) {
            var target = e.currentTarget;
            var value = target.value;
            value = (new Heartland.Formatter.CardNumber).format(value);
            target.value = value;
        }
        Card.formatNumber = formatNumber;
        /**
         * Heartland.Card.formatExpiration
         *
         * Formats a target element's value.
         *
         * @param {Event} e
         */
        function formatExpiration(e) {
            var target = e.currentTarget;
            var value = target.value;
            value = (new Heartland.Formatter.Expiration).format(value);
            target.value = value;
        }
        Card.formatExpiration = formatExpiration;
        /**
         * Heartland.Card.restrictLength
         *
         * Restricts input in a target element to a
         * certain length data.
         *
         * @param {number} length
         *
         * @returns {(e: KeyboardEvent) => ()}
         */
        function restrictLength(length) {
            return function (e) {
                var target = e.currentTarget;
                var value = target.value;
                // allow: backspace, delete, tab, escape and enter
                if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
                    // allow: Ctrl+A
                    (e.keyCode === 65 && e.ctrlKey === true) ||
                    // allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                if (value.length >= length) {
                    e.preventDefault();
                }
            };
        }
        Card.restrictLength = restrictLength;
        /**
         * Heartland.Card.restrictNumeric
         *
         * Restricts input in a target element to only
         * numeric data.
         *
         * @param {KeyboardEvent} e
         */
        function restrictNumeric(e) {
            // allow: backspace, delete, tab, escape and enter
            if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
                // allow: Ctrl+A
                (e.keyCode === 65 && e.ctrlKey === true) ||
                // allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
        Card.restrictNumeric = restrictNumeric;
        /**
         * Heartland.Card.validateNumber
         *
         * Validates a target element's value based on the
         * inferred card type's validation regex. Adds a
         * class to the target element to note `valid` or
         * `invalid`.
         *
         * @param {Event} e
         */
        function validateNumber(e) {
            var target = e.currentTarget;
            var value = target.value;
            if ((new Heartland.Validator.CardNumber).validate(value)) {
                target.classList.remove('invalid');
                target.classList.add('valid');
            }
            else {
                target.classList.add('invalid');
                target.classList.remove('valid');
            }
        }
        Card.validateNumber = validateNumber;
        /**
         * Heartland.Card.validateCvv
         *
         * Validates a target element's value based on the
         * possible CVV lengths. Adds a class to the target
         * element to note `valid` or `invalid`.
         *
         * @param {Event} e
         */
        function validateCvv(e) {
            var target = e.currentTarget;
            var value = target.value;
            if ((new Heartland.Validator.Cvv).validate(value)) {
                target.classList.remove('invalid');
                target.classList.add('valid');
            }
            else {
                target.classList.add('invalid');
                target.classList.remove('valid');
            }
        }
        Card.validateCvv = validateCvv;
        /**
         * Heartland.Card.validateExpiration
         *
         * Validates a target element's value based on the
         * current date. Adds a class to the target element
         * to note `valid` or `invalid`.
         *
         * @param {Event} e
         */
        function validateExpiration(e) {
            var target = e.currentTarget;
            var value = target.value;
            if ((new Heartland.Validator.Expiration).validate(value)) {
                target.classList.remove('invalid');
                target.classList.add('valid');
            }
            else {
                target.classList.add('invalid');
                target.classList.remove('valid');
            }
        }
        Card.validateExpiration = validateExpiration;
        /**
         * Heartland.Card.attachNumberEvents
         *
         * @param {string} selector
         */
        function attachNumberEvents(selector) {
            Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictNumeric);
            Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictLength(19));
            Heartland.Events.addHandler(document.querySelector(selector), 'input', formatNumber);
            Heartland.Events.addHandler(document.querySelector(selector), 'input', validateNumber);
            Heartland.Events.addHandler(document.querySelector(selector), 'input', addType);
        }
        Card.attachNumberEvents = attachNumberEvents;
        /**
         * Heartland.Card.attachExpirationEvents
         *
         * @param {string} selector
         */
        function attachExpirationEvents(selector) {
            Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictNumeric);
            Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictLength(9));
            Heartland.Events.addHandler(document.querySelector(selector), 'input', formatExpiration);
            Heartland.Events.addHandler(document.querySelector(selector), 'input', validateExpiration);
        }
        Card.attachExpirationEvents = attachExpirationEvents;
        /**
         * Heartland.Card.attachCvvEvents
         *
         * @param {string} selector
         */
        function attachCvvEvents(selector) {
            Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictNumeric);
            Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictLength(4));
            Heartland.Events.addHandler(document.querySelector(selector), 'input', validateCvv);
        }
        Card.attachCvvEvents = attachCvvEvents;
    })(Card = Heartland.Card || (Heartland.Card = {}));
})(Heartland || (Heartland = {}));
/// <reference path="types/CardData.ts" />
/// <reference path="DOM.ts" />
/// <reference path="HPS.ts" />
var Heartland;
(function (Heartland) {
    /**
     * @namespace Heartland.Events
     */
    var Events;
    (function (Events) {
        var Ev = (function () {
            function Ev() {
            }
            Ev.listen = function (eventName, callback) {
                if (document.addEventListener) {
                    document.addEventListener(eventName, callback, false);
                }
                else {
                    document.documentElement.attachEvent('onpropertychange', function (e) {
                        if (e.propertyName === eventName) {
                            callback(e);
                        }
                    });
                }
            };
            Ev.trigger = function (eventName) {
                if (document.createEvent) {
                    var event = document.createEvent('Event');
                    event.initEvent(eventName, true, true);
                    document.dispatchEvent(event);
                }
                else {
                    document.documentElement[eventName]++;
                }
            };
            return Ev;
        })();
        /**
         * Heartland.Events.addHandler
         *
         * Adds an `event` handler for a given `target` element.
         *
         * @param {string | EventTarget} target
         * @param {string} event
         * @param {EventListener} callback
         */
        function addHandler(target, event, callback) {
            var node;
            if (typeof target === 'string') {
                node = document.getElementById(target);
            }
            else {
                node = target;
            }
            if (document.addEventListener) {
                node.addEventListener(event, callback, false);
            }
            else {
                Ev.listen(event, callback);
            }
        }
        Events.addHandler = addHandler;
        /**
         * Heartland.Events.trigger
         *
         * Fires off an `event` for a given `target` element.
         *
         * @param {string} name
         * @param {any} target
         * @param {any} data [optional]
         */
        function trigger(name, target, data, bubble) {
            if (bubble === void 0) { bubble = false; }
            var event;
            if (document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(name, true, true);
                target.dispatchEvent(event);
            }
            else {
                Ev.trigger(name);
            }
        }
        Events.trigger = trigger;
        /**
         * Heartland.Events.frameHandleWith
         *
         * Wraps `hps` state in a closure to provide a `Heartland.Messages.receive`
         * callback handler for iFrame children.
         *
         * @param {Heartland.HPS} hps
         */
        function frameHandleWith(hps) {
            return function (m) {
                var data = JSON.parse(m.data);
                switch (data.action) {
                    case 'tokenize':
                        if (data.accumulateData) {
                            hps.Messages.post({
                                action: 'accumulateData'
                            }, 'parent');
                            var el = document.createElement('input');
                            el.id = 'publicKey';
                            el.type = 'hidden';
                            el.value = data.message;
                            document
                                .getElementById('heartland-field-wrapper')
                                .appendChild(el);
                        }
                        else {
                            tokenizeIframe(hps, data.message);
                        }
                        break;
                    case 'setStyle':
                        Heartland.DOM.setStyle(data.id, data.style);
                        Heartland.DOM.resizeFrame(hps);
                        break;
                    case 'appendStyle':
                        Heartland.DOM.appendStyle(data.id, data.style);
                        Heartland.DOM.resizeFrame(hps);
                        break;
                    case 'setText':
                        Heartland.DOM.setText(data.id, data.text);
                        Heartland.DOM.resizeFrame(hps);
                        break;
                    case 'setPlaceholder':
                        Heartland.DOM.setPlaceholder(data.id, data.text);
                        break;
                    case 'setFieldData':
                        Heartland.DOM.setFieldData(data.id, data.value);
                        if (document.getElementById('heartland-field') &&
                            document.getElementById('cardCvv') &&
                            document.getElementById('cardExpiration')) {
                            tokenizeIframe(hps, document.getElementById('publicKey').getAttribute('value'));
                        }
                        break;
                    case 'getFieldData':
                        Heartland.DOM.getFieldData(hps, data.id);
                        break;
                    case 'addStylesheet':
                        Heartland.DOM.addStylesheet(data.data);
                        Heartland.DOM.resizeFrame(hps);
                        break;
                    case 'setFocus':
                        Heartland.DOM.setFocus();
                        break;
                }
            };
        }
        Events.frameHandleWith = frameHandleWith;
        /**
         * tokenizeIframe
         *
         * Tokenizes card data. Used in iframe integrations to tokenize on Heartland's
         * servers.
         *
         * @param {Heartland.HPS} hps
         * @param {string} publicKey
         */
        function tokenizeIframe(hps, publicKey) {
            var card = {};
            var tokenResponse = function (action) {
                return function (response) {
                    hps.Messages.post({ action: action, response: response }, 'parent');
                };
            };
            card.number = (document.getElementById('heartland-field')
                || document.getElementById('heartland-card-number')).value;
            card.cvv = (document.getElementById('cardCvv')
                || document.getElementById('heartland-cvv')).value;
            card.exp = document.getElementById('cardExpiration');
            if (card.exp) {
                var cardExpSplit = card.exp.value.split('/');
                card.expMonth = cardExpSplit[0];
                card.expYear = cardExpSplit[1];
                card.exp = undefined;
            }
            else {
                card.expMonth = document.getElementById('heartland-expiration-month').value;
                card.expYear = document.getElementById('heartland-expiration-year').value;
            }
            hps.tokenize({
                cardCvv: card.cvv,
                cardExpMonth: card.expMonth,
                cardExpYear: card.expYear,
                cardNumber: card.number,
                error: tokenResponse('onTokenError'),
                publicKey: publicKey,
                success: tokenResponse('onTokenSuccess'),
                type: 'pan'
            });
        }
    })(Events = Heartland.Events || (Heartland.Events = {}));
})(Heartland || (Heartland = {}));
/// <reference path="types/CardData.ts" />
/// <reference path="types/Options.ts" />
/// <reference path="vars/cardTypes.ts" />
/// <reference path="vars/urls.ts" />
/// <reference path="Card.ts" />
/// <reference path="Events.ts" />
var Heartland;
(function (Heartland) {
    /**
     * @namespace Heartland.Util
     */
    var Util;
    (function (Util) {
        /**
         * Heartland.Util.getCardType
         *
         * Parses a credit card number to obtain the card type/brand.
         *
         * @param {string} number
         */
        function getCardType(number) {
            var cardType = Heartland.Card.typeByNumber(number);
            var type = '';
            if (cardType) {
                type = cardType.code;
            }
            return type;
        }
        Util.getCardType = getCardType;
        /**
         * Heartland.Util.applyOptions
         *
         * Creates a single object by merging a `source` (default) and `properties`
         * obtained elsewhere, e.g. a function argument in `HPS`. Any properties in
         * `properties` will overwrite matching properties in `source`.
         *
         * @param {Heartland.Options} source
         * @param {Heartland.Options} properties
         * @returns {Heartland.Options}
         */
        function applyOptions(source, properties) {
            var property;
            var destination = {};
            if (!source) {
                source = {};
            }
            for (property in source) {
                if (source.hasOwnProperty(property)) {
                    destination[property] = source[property];
                }
            }
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    destination[property] = properties[property];
                }
            }
            return destination;
        }
        Util.applyOptions = applyOptions;
        /**
         * Heartland.Util.throwError
         *
         * Allows a merchant-defined error handler to be used in cases where the
         * tokenization process fails. If not provided, we throw the message as a
         * JS runtime error.
         *
         * @param {Heartland.Options} options
         * @param {string | Heartland.TokenizationResponse} errorMessage
         */
        function throwError(options, errorMessage) {
            if (typeof (options.error) === 'function') {
                options.error(errorMessage);
            }
            else {
                throw errorMessage;
            }
        }
        Util.throwError = throwError;
        /**
         * Heartland.Util.getItemByPropertyValue
         *
         * Enumerates over a `collection` to retreive an item whose `property` is
         * a given `value`.
         *
         * @param {any} collection
         * @param {string} property
         * @param {any} value
         * @returns {any}
         */
        function getItemByPropertyValue(collection, property, value) {
            var length = collection.length;
            var i = 0;
            for (i; i < length; i++) {
                if (collection[i][property] === value) {
                    return collection[i];
                }
            }
        }
        Util.getItemByPropertyValue = getItemByPropertyValue;
        /**
         * Heartland.Util.getParams
         *
         * Builds param list for a particular `type` from expected properties in
         * `data`.
         *
         * @param {string} type - The tokenization type
         * @param {Heartland.Options} data
         * @returns {string}
         */
        function getParams(type, data) {
            var params = [];
            switch (type) {
                case 'pan':
                    params.push('token_type=supt', 'object=token', '_method=post', 'api_key=' + data.publicKey.replace(/^\s+|\s+$/g, ''), 'card%5Bnumber%5D=' + data.cardNumber.replace(/\s/g, ''), 'card%5Bexp_month%5D=' + data.cardExpMonth.replace(/^\s+|\s+$/g, ''), 'card%5Bexp_year%5D=' + data.cardExpYear.replace(/^\s+|\s+$/g, ''), 'card%5Bcvc%5D=' + data.cardCvv.replace(/^\s+|\s+$/g, ''));
                    break;
                case 'swipe':
                    params.push('token_type=supt', 'object=token', '_method=post', 'api_key=' + data.publicKey.replace(/^\s+|\s+$/g, ''), 'card%5Btrack_method%5D=swipe', 'card%5Btrack%5D=' + encodeURIComponent(data.track.replace(/^\s+|\s+$/g, '')));
                    break;
                case 'encrypted':
                    params.push('token_type=supt', 'object=token', '_method=post', 'api_key=' + data.publicKey.replace(/^\s+|\s+$/g, ''), 'encryptedcard%5Btrack_method%5D=swipe', 'encryptedcard%5Btrack%5D=' + encodeURIComponent(data.track.replace(/^\s+|\s+$/g, '')), 'encryptedcard%5Btrack_number%5D=' + encodeURIComponent(data.trackNumber.replace(/^\s+|\s+$/g, '')), 'encryptedcard%5Bktb%5D=' + encodeURIComponent(data.ktb.replace(/^\s+|\s+$/g, '')), 'encryptedcard%5Bpin_block%5D=' + encodeURIComponent(data.pinBlock.replace(/^\s+|\s+$/g, '')));
                    break;
                default:
                    Heartland.Util.throwError(data, 'unknown params type');
                    break;
            }
            return '?' + params.join('&');
        }
        Util.getParams = getParams;
        /**
         * Heartland.Util.getUrlByEnv
         *
         * Selects the appropriate tokenization service URL for the
         * active `publicKey`.
         *
         * @param {Heartland.Options} options
         * @returns {string}
         */
        function getUrlByEnv(options) {
            options.env = options.publicKey.split('_')[1];
            if (options.env === 'cert') {
                options.gatewayUrl = Heartland.urls.CERT;
            }
            else {
                options.gatewayUrl = Heartland.urls.PROD;
            }
            return options;
        }
        Util.getUrlByEnv = getUrlByEnv;
        /**
         * Heartland.Util.addFormHandler
         *
         * Creates and adds an event handler function for the submission for a given
         * form (`options.form_id`).
         *
         * @param {Heartland.Options} options
         * @listens submit
         */
        function addFormHandler(options) {
            var payment_form = document.getElementById(options.formId);
            var code = function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else if (window.event) {
                    window.event.returnValue = false;
                }
                var fields = Heartland.Util.getFields(options.formId);
                var cardType = Heartland.Util.getCardType(fields.number);
                options.cardNumber = fields.number;
                options.cardExpMonth = fields.expMonth;
                options.cardExpYear = fields.expYear;
                options.cardCvv = fields.cvv;
                options.cardType = cardType;
                Heartland.Ajax.call('pan', options);
            };
            Heartland.Events.addHandler(payment_form, 'submit', code);
            Heartland.DOM.addField(options.formId, 'hidden', 'publicKey', options.publicKey);
        }
        Util.addFormHandler = addFormHandler;
        /**
         * Heartland.Util.getFields
         *
         * Extracts card information from the fields with names `card_number`,
         * `card_expiration_month`, `card_expiration_year`, and `card_cvc` and
         * expects them to be present as children of `formParent`.
         *
         * @param {string} formParent
         * @returns {Heartland.CardData}
         */
        function getFields(formParent) {
            var form = document.getElementById(formParent);
            var fields = {};
            var i, element;
            var length = form.childElementCount;
            for (i = 0; i < length; i++) {
                element = form.children[i];
                if (element.id === 'card_number') {
                    fields.number = element.value;
                }
                else if (element.id === 'card_expiration_month') {
                    fields.expMonth = element.value;
                }
                else if (element.id === 'card_expiration_year') {
                    fields.expYear = element.value;
                }
                else if (element.id === 'card_cvc') {
                    fields.cvv = element.value;
                }
            }
            return fields;
        }
        Util.getFields = getFields;
    })(Util = Heartland.Util || (Heartland.Util = {}));
})(Heartland || (Heartland = {}));
/// <reference path="types/TokenizationResponse.ts" />
/// <reference path="DOM.ts" />
/// <reference path="Util.ts" />
var Heartland;
(function (Heartland) {
    /**
     * @namespace Heartland.Ajax
     */
    var Ajax;
    (function (Ajax) {
        /**
         * Heartland.Ajax.call
         *
         * Sets up a request to be passed to `Heartland.Ajax.jsonp`. On successful tokenization,
         * `options.success` will be called with the tokenization data as the only
         * argument passed.
         *
         * @param {string} type
         * @param {Heartland.Options} options
         */
        function call(type, options) {
            var number = options.cardNumber.replace(/^\s+|\s+$/g, '');
            var lastfour = number.slice(-4);
            var cardType = Heartland.Util.getCardType(number);
            var params = Heartland.Util.getParams(type, options);
            jsonp(options.gatewayUrl + params, function (data) {
                if (data.error) {
                    Heartland.Util.throwError(options, data);
                }
                else {
                    data.last_four = lastfour;
                    data.card_type = cardType;
                    data.exp_month = options.cardExpMonth;
                    data.exp_year = options.cardExpYear;
                    if (options.formId && options.formId.length > 0) {
                        Heartland.DOM.addField(options.formId, 'hidden', 'token_value', data.token_value);
                        Heartland.DOM.addField(options.formId, 'hidden', 'last_four', lastfour);
                        Heartland.DOM.addField(options.formId, 'hidden', 'card_exp_year', options.cardExpYear);
                        Heartland.DOM.addField(options.formId, 'hidden', 'card_exp_month', options.cardExpMonth);
                        Heartland.DOM.addField(options.formId, 'hidden', 'card_type', cardType);
                    }
                    options.success(data);
                }
            });
        }
        Ajax.call = call;
        /**
         * Heartland.Ajax.jsonp
         *
         * Creates a new DOM node containing a created JSONP callback handler for an
         * impending Ajax JSONP request. Removes need for `XMLHttpRequest`.
         *
         * @param {string} url
         * @param {function} callback
         */
        function jsonp(url, callback) {
            var script = document.createElement('script');
            var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            window[callbackName] = function (data) {
                window[callbackName] = undefined;
                document.body.removeChild(script);
                callback(data);
            };
            script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
            document.body.appendChild(script);
        }
    })(Ajax = Heartland.Ajax || (Heartland.Ajax = {}));
})(Heartland || (Heartland = {}));
var Heartland;
(function (Heartland) {
    Heartland.fields = [
        'cardNumber',
        'cardCvv',
        'cardExpiration'
    ];
})(Heartland || (Heartland = {}));
/// <reference path="Events.ts" />
/// <reference path="HPS.ts" />
var Heartland;
(function (Heartland) {
    /**
     * Heartland.Messages
     *
     * Initializes a new object for wrapping `window.postMessage` and a fallback
     * method for legacy browsers.
     */
    var Messages = (function () {
        /**
         * Heartland.Messages (constructor)
         *
         * @constructor
         * @param {Heartland.HPS} hps
         * @returns {Heartland.Messages}
         */
        function Messages(hps) {
            this.hps = hps;
            this.intervalId = null;
            this.lastHash = '';
            this.pushIntervalStarted = false;
        }
        /**
         * Heartland.Messages.pushMessages
         *
         * For legacy browsers, a mailbox (buffer) must be used to ensure all messages
         * are sent between parent and child windows. When ready, this function builds
         * the final message, encodes it, sends it, and resets the mailbox to `[]`.
         *
         * @param {Heartland.HPS} hps
         * @returns {function}
         */
        Messages.prototype.pushMessages = function (hps) {
            return function () {
                var data = [];
                var messageArr = [];
                var message = '';
                var i = 0, length = 0;
                var targetUrl = '', url = '';
                var current;
                var targetNode;
                var re = /^#?\d+&/;
                length = hps.mailbox.length;
                if (!length) {
                    return;
                }
                for (i = 0; i < length; i++) {
                    current = hps.mailbox.shift();
                    if (!targetUrl) {
                        targetUrl = current.targetUrl;
                        targetNode = current.targetNode;
                    }
                    messageArr.push(current.message);
                }
                current = null;
                if (re.test(window.location.hash)) {
                    current = JSON.parse(decodeURIComponent(window.location.hash.replace(re, '')));
                    data.concat(current);
                }
                if (messageArr !== []) {
                    hps.cacheBust = hps.cacheBust || 1;
                    data.push({ data: messageArr, source: { name: hps.field || 'parent' } });
                    message = JSON.stringify(data);
                    url = targetUrl.replace(/#.*$/, '') + '#' +
                        (+new Date()) + (hps.cacheBust++) + '&' +
                        encodeURIComponent(message);
                    if (targetNode.location) {
                        targetNode.location.href = url;
                    }
                    else {
                        targetNode.src = url;
                    }
                }
                messageArr.length = 0;
                hps.mailbox.length = 0;
            };
        };
        /**
         * Heartland.Messages.post
         *
         * When present, wraps the built-in `window.postMessage`. When not present,
         * pushes the message onto the mailbox for eventual sending, and on first use,
         * starts the interval for `Messages.pushMessages`.
         *
         * @param {Object | string} message
         * @param {string} target
         */
        Messages.prototype.post = function (message, target) {
            var frame;
            var targetNode;
            var targetUrl;
            message.source = message.source || {};
            message.source.name = window.name;
            if (!this.hps.frames) {
                return;
            }
            frame = this.hps.frames[target] || this.hps[target];
            if (!frame) {
                return;
            }
            targetUrl = this.hps.frames[target].url;
            try {
                if (typeof frame.targetNode !== 'undefined') {
                    targetNode = frame.targetNode;
                }
                else if (typeof frame.frame !== 'undefined') {
                    targetNode = frame.frame;
                }
            }
            catch (e) {
                targetNode = frame;
            }
            if (window.postMessage) {
                targetNode.postMessage(JSON.stringify(message), targetUrl);
            }
            else {
                this.hps.mailbox = this.hps.mailbox || [];
                this.hps.mailbox.push({
                    message: message,
                    targetNode: targetNode,
                    targetUrl: targetUrl
                });
                if (!this.pushIntervalStarted) {
                    setInterval(this.pushMessages(this.hps), 10);
                }
            }
        };
        /**
         * Heartland.Messages.receive
         *
         * When present, wraps the built-in `window.postMesage`'s `message` or
         * `onmessage` window events. When not present, uses a single interval to
         * check for changes to `window.location.hash` when the other window sends a
         * message and will decode the JSON and URI encoded hash.
         *
         * @param {Function} callback
         * @param {string} sourceOrigin
         */
        Messages.prototype.receive = function (callback, sourceOrigin) {
            if (window.postMessage) {
                this.callback = function (m) {
                    // m.data = JSON.parse(m.data);
                    callback(m);
                };
                if (window.addEventListener) {
                    window.addEventListener('message', this.callback, !1);
                }
                else {
                    window.attachEvent('onmessage', this.callback);
                }
            }
            else {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                }
                this.intervalId = null;
                if (callback) {
                    this.intervalId = setInterval(function () {
                        var hash = document.location.hash, re = /^#?\d+&/;
                        if (hash !== this.lastHash && re.test(hash)) {
                            var data = JSON.parse(decodeURIComponent(hash.replace(re, '')));
                            var i, j;
                            var m;
                            this.lastHash = hash;
                            for (i in data) {
                                m = data[i];
                                if (Object.prototype.toString.call(m.data) !== '[object Array]') {
                                    callback(m);
                                    continue;
                                }
                                for (j in m.data) {
                                    callback({ data: m.data[j], source: m.source });
                                }
                            }
                        }
                    }, 100);
                }
            }
            Heartland.Events.trigger('receiveMessageHandlerAdded', document);
        };
        /**
         * Heartland.Messages.removeReceiver
         *
         * Removes active `message` event handler function.
         */
        Messages.prototype.removeReceiver = function () {
            if (window.addEventListener) {
                window.removeEventListener('message', this.callback, !1);
            }
            else {
                window.detachEvent('onmessage', this.callback);
            }
        };
        return Messages;
    })();
    Heartland.Messages = Messages;
})(Heartland || (Heartland = {}));
var Heartland;
(function (Heartland) {
    /**
     * @namespace Heartland.Styles
     */
    var Styles;
    (function (Styles) {
        /**
         * Heartland.Styles.Defaults
         *
         * Collection of helper functions for applying default styles to a child
         * window's fields. Serves as an example of these methods' use in merchant
         * modifications. Each function expects a `Heartland.HPS` object to be passed
         * as an argument.
         */
        Styles.Defaults = {
            body: function (hps) {
                hps.setStyle('heartland-body', 'margin: 0;' +
                    'font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;' +
                    'color: #666;');
            },
            cvv: function (hps) {
                hps.appendStyle('heartland-cvv', 'width: 110px;');
            },
            cvvContainer: function (hps) {
                hps.setStyle('heartland-cvv-container', 'width: 110px;' +
                    'display: inline-block;' +
                    'float: left;');
            },
            fieldset: function (hps) {
                hps.setStyle('heartland-expiration-date-container', 'border: 0;' +
                    'margin: 0 25px 0px 1px;' +
                    'padding: 0;' +
                    'width: 173px;' +
                    'display: inline-block;' +
                    'float:  left;');
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
                    hps.setStyle(ids[i], 'width: 309px;' +
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
                        'background-image: linear-gradient(to top, #F7F7F7 0%, #EFEFEF 100%);');
                }
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
                    hps.setStyle(ids[i], 'font-size: 13px;' +
                        'text-transform: uppercase;' +
                        'font-weight: bold;' +
                        'display: block;' +
                        'width: 100%;' +
                        'clear: both;');
                }
            },
            selectLabels: function (hps) {
                var ids = ['heartland-expiration-month-label', 'heartland-expiration-year-label'];
                var i = 0, length = ids.length;
                for (i; i < length; i++) {
                    hps.setStyle(ids[i], 'position:absolute;' +
                        'width:1px;' +
                        'height:1px;' +
                        'padding:0;' +
                        'margin:-1px;' +
                        'overflow:hidden;' +
                        'clip:rect(0,0,0,0);' +
                        'border:0;');
                }
            },
            selects: function (hps) {
                var ids = ['heartland-expiration-month', 'heartland-expiration-year'];
                var i = 0, length = ids.length;
                for (i; i < length; i++) {
                    hps.appendStyle(ids[i], 'border: 0;' +
                        'outline: 1px solid #ccc;' +
                        'height: 28px;' +
                        'width: 80px;' +
                        '-webkit-appearance: none;' +
                        '-moz-appearance: none;' +
                        '-webkit-border-radius: 0px;' +
                        /* tslint:disable:max-line-length */
                        'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzA5MTZFN0RFMDY2MTFFNEIyODZFMURFRTA3REUxMjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzA5MTZFN0VFMDY2MTFFNEIyODZFMURFRTA3REUxMjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMDkxNkU3QkUwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMDkxNkU3Q0UwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvMrdUAAAABiSURBVHjaYkxLS3vNwMAgwoAfvGUCEjkMhEE285kzZ65u2bLlJ5DjgkNRxUwgYPz//z+Yl56ePhNIpaEpAqnJADGYkASzgHgnEn8HyEoYB24i1FReILUPynUEmvYFJgcQYACYah+uDhpKGAAAAABJRU5ErkJggg==);' +
                        /* tslint:enable:max-line-length */
                        'background-position: 65px 12px;' +
                        'background-repeat: no-repeat;' +
                        'background-color:  #F7F7F7;' +
                        'float: left;' +
                        'margin-right: 6px');
                }
            }
        };
    })(Styles = Heartland.Styles || (Heartland.Styles = {}));
})(Heartland || (Heartland = {}));
/// <reference path="vars/fields.ts" />
/// <reference path="vars/urls.ts" />
/// <reference path="Events.ts" />
/// <reference path="HPS.ts" />
/// <reference path="Messages.ts" />
/// <reference path="Styles.ts" />
var Heartland;
(function (Heartland) {
    /**
     * @namespace Heartland.Frames
     */
    var Frames;
    (function (Frames) {
        /**
         * Heartland.Frames.configureIframe
         *
         * Prepares the pages iFrames for communication with the parent window.
         *
         * @param {Heartland.HPS} hps
         * @listens click
         * @listens message
         */
        function configureIframe(hps) {
            var frame;
            var options = hps.options;
            var target;
            var useDefaultStyles = true;
            hps.Messages = hps.Messages || new Heartland.Messages(hps);
            if (options.env === 'cert') {
                hps.iframe_url = Heartland.urls.iframeCERT;
            }
            else {
                hps.iframe_url = Heartland.urls.iframePROD;
            }
            if (options.fields !== Heartland.defaults.fields) {
                Heartland.Frames.makeFieldsAndLink(hps);
            }
            if (options.fields === Heartland.defaults.fields && options.iframeTarget) {
                target = document.getElementById(options.iframeTarget);
                if (options.targetType === 'myframe') {
                    frame = target;
                    hps.iframe_url = frame.src;
                }
                else {
                    frame = Heartland.DOM.makeFrame('heartland-frame-securesubmit');
                    target.appendChild(frame);
                }
                hps.iframe_url = hps.iframe_url + '#' + encodeURIComponent(document.location.href.split('#')[0]);
                frame.src = hps.iframe_url;
                hps.frames.child = {
                    frame: window.postMessage ? frame.contentWindow : frame,
                    name: 'child',
                    url: hps.iframe_url
                };
            }
            if (options.useDefaultStyles === false) {
                useDefaultStyles = false;
            }
            if (options.buttonTarget) {
                Heartland.Events.addHandler(options.buttonTarget, 'click', function (e) {
                    e.preventDefault();
                    hps.Messages.post({
                        accumulateData: !!hps.frames.cardNumber,
                        action: 'tokenize',
                        message: options.publicKey
                    }, hps.frames.cardNumber ? 'cardNumber' : 'child');
                    return false;
                });
            }
            hps.Messages.receive(function (m) {
                var data = JSON.parse(m.data);
                var fieldFrame;
                try {
                    fieldFrame = hps.frames[data.source.name === 'heartland-frame-securesubmit' ? 'parent' : data.source.name];
                }
                catch (e) {
                    return;
                }
                switch (data.action) {
                    case 'onTokenSuccess':
                        options.onTokenSuccess(data.response);
                        break;
                    case 'onTokenError':
                        options.onTokenError(data.response);
                        break;
                    case 'resize':
                        if (fieldFrame) {
                            hps.resizeIFrame(fieldFrame.frame, data.height);
                        }
                        else {
                            hps.resizeIFrame(frame, data.height);
                        }
                        break;
                    case 'receiveMessageHandlerAdded':
                        if (!options.fields && useDefaultStyles) {
                            Heartland.Styles.Defaults.body(hps);
                            Heartland.Styles.Defaults.labelsAndLegend(hps);
                            Heartland.Styles.Defaults.inputsAndSelects(hps);
                            Heartland.Styles.Defaults.fieldset(hps);
                            Heartland.Styles.Defaults.selects(hps);
                            Heartland.Styles.Defaults.selectLabels(hps);
                            Heartland.Styles.Defaults.cvvContainer(hps);
                            Heartland.Styles.Defaults.cvv(hps);
                        }
                        if (fieldFrame && fieldFrame.options.placeholder) {
                            hps.Messages.post({
                                action: 'setPlaceholder',
                                id: 'heartland-field',
                                text: fieldFrame.options.placeholder
                            }, fieldFrame.name);
                        }
                        if (options.style) {
                            var css = options.styleString
                                || (options.styleString = Heartland.DOM.json2css(options.style));
                            hps.Messages.post({
                                action: 'addStylesheet',
                                data: css
                            }, fieldFrame.name);
                        }
                        Heartland.Events.trigger('securesubmitIframeReady', document);
                        break;
                    case 'accumulateData':
                        var i;
                        var field;
                        for (i in hps.frames) {
                            if (i === 'cardNumber') {
                                continue;
                            }
                            field = hps.frames[i];
                            hps.Messages.post({
                                action: 'getFieldData',
                                id: 'heartland-field'
                            }, field.name);
                        }
                        break;
                    case 'passData':
                        var cardNumberFieldFrame = hps.frames.cardNumber;
                        if (!cardNumberFieldFrame) {
                            break;
                        }
                        hps.Messages.post({
                            action: 'setFieldData',
                            id: fieldFrame.name,
                            value: data.value
                        }, cardNumberFieldFrame.name);
                        break;
                }
            }, '*');
            // monitorFieldEvents(hps, )
        }
        Frames.configureIframe = configureIframe;
        /**
         * Heartland.Frames.makeFieldsAndLink
         *
         * Creates a set of single field iFrames and stores a reference to
         * them in the parent window's state.
         *
         * @param {Heartland.HPS} hps
         */
        function makeFieldsAndLink(hps) {
            var options = hps.options;
            var fieldsLength = Heartland.fields.length;
            var baseUrl = hps.iframe_url.replace('index.html', '') + 'field.html';
            for (var i = 0; i < fieldsLength; i++) {
                var field = Heartland.fields[i];
                var fieldOptions = options.fields[field];
                if (!fieldOptions) {
                    return;
                }
                var frame = Heartland.DOM.makeFrame(field);
                var url = baseUrl + '#' + field + ':' + encodeURIComponent(document.location.href.split('#')[0]);
                frame.src = url;
                document
                    .getElementById(fieldOptions.target)
                    .appendChild(frame);
                hps.frames[field] = {
                    frame: frame,
                    name: field,
                    options: fieldOptions,
                    target: fieldOptions.target,
                    targetNode: window.postMessage ? frame.contentWindow : frame,
                    url: url
                };
            }
        }
        Frames.makeFieldsAndLink = makeFieldsAndLink;
        /**
         * Heartland.Frames.monitorFieldEvents
         *
         * @param {Heartland.HPS} hps
         * @param {string | EventTarget} target
         */
        function monitorFieldEvents(hps, target) {
            var events = ['click', 'blur', 'focus', 'change', 'keypress', 'keydown', 'keyup'];
            var i = 0, length = events.length;
            var event;
            for (i; i < length; i++) {
                event = events[i];
                Heartland.Events.addHandler(target, event, function (e) {
                    hps.Messages.post({
                        action: 'fieldEvent',
                        event: event,
                        eventData: e
                    }, 'parent');
                });
            }
        }
        Frames.monitorFieldEvents = monitorFieldEvents;
    })(Frames = Heartland.Frames || (Heartland.Frames = {}));
})(Heartland || (Heartland = {}));
/// <reference path="vars/defaults.ts" />
/// <reference path="vendor/json2.ts" />
/// <reference path="Ajax.ts" />
/// <reference path="DOM.ts" />
/// <reference path="Events.ts" />
/// <reference path="Frames.ts" />
/// <reference path="Messages.ts" />
/// <reference path="Styles.ts" />
/// <reference path="Util.ts" />
var Heartland;
(function (Heartland) {
    /**
     * Heartland.HPS
     *
     * Initializes options and adds the default form handler if a `formId` is
     * passed as an option. This expects the default fields (see `getFields`) to
     * be present as children of `formId`.
     */
    var HPS = (function () {
        /**
         * Heartland.HPS (constructor)
         *
         * @constructor
         * @param {Heartland.Options} options [optional]
         * @returns {Heartland.HPS}
         */
        function HPS(options) {
            if (!options && window.parent) {
                return;
            }
            this.options = Heartland.Util.applyOptions(Heartland.defaults, options);
            this.options = Heartland.Util.getUrlByEnv(this.options);
            if (this.options.formId.length > 0) {
                Heartland.Util.addFormHandler(this.options);
            }
            this.frames = {};
            if (this.options.type === 'iframe') {
                this.iframe_url = '';
                this.Messages = new Heartland.Messages(this);
                this.mailbox = [];
                this.cacheBust = 1;
                Heartland.Frames.configureIframe(this);
            }
            return this;
        }
        /**
         * Heartland.HPS.tokenize
         *
         * Tokenizes card data. Used in manual integrations where the merchant's
         * credit card fields cannot/do not match the names expected in the default
         * form handler (see `getFields`).
         *
         * @param {Heartland.Options} options [optional]
         */
        HPS.prototype.tokenize = function (options) {
            options = options || {};
            if (options) {
                this.options = Heartland.Util.applyOptions(this.options, options);
                this.options = Heartland.Util.getUrlByEnv(this.options);
            }
            if (this.options.type === 'iframe') {
                this.Messages.post({
                    action: 'tokenize',
                    message: this.options.publicKey
                }, 'child');
                return;
            }
            Heartland.Ajax.call(this.options.type, this.options);
        };
        ;
        /**
         * Heartland.HPS.configureInternalIframe
         *
         * Sets up a child iframe window to prepare it for communication with the
         * parent and for tokenization.
         *
         * @param {Heartland.Options} options
         */
        HPS.prototype.configureInternalIframe = function (options) {
            this.Messages = new Heartland.Messages(this);
            this.parent = window.parent;
            this.frames = this.frames || {};
            this.frames.parent = {
                frame: window.parent,
                name: 'parent',
                url: decodeURIComponent(document.location.hash.replace(/^#/, ''))
            };
            Heartland.Events.addHandler(window, 'load', (function (hps) {
                return function () {
                    Heartland.DOM.resizeFrame(hps);
                };
            }(this)));
            Heartland.Events.addHandler(document, 'receiveMessageHandlerAdded', (function (hps) {
                return function () {
                    hps.Messages.post({ action: 'receiveMessageHandlerAdded' }, 'parent');
                };
            }(this)));
            this.Messages.receive(Heartland.Events.frameHandleWith(this), '*');
        };
        ;
        /**
         * Heartland.HPS.configureFieldIframe
         *
         * Sets up a child iframe window to prepare it for communication with the
         * parent and for tokenization.
         *
         * @param {Heartland.Options} options
         */
        HPS.prototype.configureFieldIframe = function (options) {
            var hash = document.location.hash.replace(/^#/, '');
            var split = hash.split(':');
            this.Messages = new Heartland.Messages(this);
            this.field = split.shift();
            this.parent = window.parent;
            this.frames = this.frames || {};
            this.frames.parent = {
                frame: window.parent,
                name: 'parent',
                url: decodeURIComponent(split.join(':').replace(/^:/, ''))
            };
            Heartland.Events.addHandler(window, 'load', (function (hps) {
                return function () {
                    Heartland.DOM.resizeFrame(hps);
                    Heartland.DOM.configureField(hps);
                    var method = 'attach' + window.name.replace('card', '') + 'Events';
                    Heartland.Card[method]('#heartland-field');
                };
            }(this)));
            Heartland.Events.addHandler(document, 'receiveMessageHandlerAdded', (function (hps) {
                return function () {
                    hps.Messages.post({ action: 'receiveMessageHandlerAdded' }, 'parent');
                };
            }(this)));
            this.Messages.receive(Heartland.Events.frameHandleWith(this), '*');
        };
        ;
        /**
         * Heartland.HPS.resizeIFrame
         *
         * Called automatically when the child iframe window alerts the parent to
         * resize.
         *
         * @param {HTMLIFrameElement} frame
         * @param {string} height
         */
        HPS.prototype.resizeIFrame = function (frame, height) {
            if (!frame) {
                return;
            }
            frame.style.height = (parseInt(height, 10)) + 'px';
        };
        ;
        /**
         * Heartland.HPS.setText
         *
         * Public API for setting an element's inner text.
         *
         * @param {string} elementid
         * @param {string} elementtext
         */
        HPS.prototype.setText = function (elementid, elementtext) {
            this.Messages.post({ action: 'setText', id: elementid, text: elementtext }, 'child');
        };
        ;
        /**
         * Heartland.HPS.setStyle
         *
         * Public API for setting an element's style.
         *
         * @param {string} elementid
         * @param {string} elementstyle
         */
        HPS.prototype.setStyle = function (elementid, elementstyle) {
            this.Messages.post({ action: 'setStyle', id: elementid, style: elementstyle }, 'child');
        };
        ;
        /**
         * Heartland.HPS.appendStyle
         *
         * Public API for appending to an element's style.
         *
         * @param {string} elementid
         * @param {string} elementstyle
         */
        HPS.prototype.appendStyle = function (elementid, elementstyle) {
            this.Messages.post({ action: 'appendStyle', id: elementid, style: elementstyle }, 'child');
        };
        ;
        /**
         * Heartland.HPS.setFocus
         *
         * Public API for appending to an element's style.
         *
         * @param {string} elementid
         */
        HPS.prototype.setFocus = function (elementid) {
            this.Messages.post({ action: 'setFocus' }, elementid);
        };
        ;
        return HPS;
    })();
    Heartland.HPS = HPS;
})(Heartland || (Heartland = {}));
/// <reference path="HPS.ts" />
var Heartland;
(function (Heartland) {
    window.HPS = Heartland.HPS;
})(Heartland || (Heartland = {}));
//# sourceMappingURL=securesubmit.js.map