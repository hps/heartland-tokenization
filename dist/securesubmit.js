var Heartland = (function () {
'use strict';

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
                let a;
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
                let d;
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
// create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
var JSON2 = {};
(function () {
    'use strict';
    function f(n) {
        // format integers to have at least two digits.
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
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, 
    // tslint:disable-next-line
    esc = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }, rep;
    function quote(string) {
        // if the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // otherwise we must also replace the offending characters with safe escape
        // sequences.
        esc.lastIndex = 0;
        return esc.test(string) ? '"' + string.replace(esc, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        // produce a string from holder[key].
        var i, // the loop counter.
        k = null, // the member key.
        v, // the member value.
        length, mind = gap, partial, value = holder[key];
        // if the value has a toJSON method, call it to obtain a replacement value.
        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        // if we were called with a replacer function, then call the replacer to
        // obtain a replacement value.
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        // what happens next depends on the value's type.
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                // json numbers must be finite. Encode non-finite numbers as null.
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                // if the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.
                return String(value);
            // if the type is 'object', we might be dealing with an object or an array or
            // null.
            case 'object':
                // due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.
                if (!value) {
                    return 'null';
                }
                // make an array to hold the partial: string[] results of stringifying this object value.
                gap += indent;
                partial = [];
                // is the value an array?
                if (Object.prototype.toString.apply(value, []) === '[object Array]') {
                    // the value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i.toString(), value) || 'null';
                    }
                    // join all of the elements together, separated with commas, and wrap them in
                    // brackets.
                    v = partial.length === 0
                        ? '[]'
                        : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                // if the replacer is an array, use it to select the members to be stringified.
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
                    // otherwise, iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                // join all of the member texts together, separated with commas,
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
    // if the JSON object does not yet have a stringify method, give it one.
    if (typeof JSON2.stringify !== 'function') {
        JSON2.stringify = function (value, replacer, space) {
            // the stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // a default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.
            var i;
            gap = '';
            indent = '';
            // if the space parameter is a number, make an indent string containing that
            // many spaces.
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            }
            else if (typeof space === 'string') {
                indent = space;
            }
            // if there is a replacer, it must be a function or an array.
            // otherwise, throw an error.
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            // make a fake root object containing our value under the key of ''.
            // return the result of stringifying the value.
            return str('', { '': value });
        };
    }
    // if the JSON object does not yet have a parse method, give it one.
    if (typeof JSON2.parse !== 'function') {
        JSON2.parse = function (text, reviver) {
            // the parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.
            var j;
            function walk(holder, key) {
                // the walk method is used to recursively walk the resulting structure so
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
            // parsing happens in four stages. In the first stage, we replace certain
            // unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            // in the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // but just to be safe, we want to reject all unexpected forms.
            // we split the second stage into 4 regexp operations in order to work around
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
                // in the third stage we use the eval function to compile the text into a
                // javascript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.
                j = (new Function('return (' + text + ')')());
                // in the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.
                return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
            }
            // if the text is not JSON parseable, then a SyntaxError is thrown.
            throw new SyntaxError('JSON.parse');
        };
    }
}());

var JsonpRequest = (function () {
    function JsonpRequest(url, payload) {
        if (url === void 0) { url = ""; }
        if (payload === void 0) { payload = ""; }
        this.url = url;
        this.payload = payload;
        this.type = "jsonp";
    }
    return JsonpRequest;
}());
var NullRequest = (function () {
    function NullRequest(payload) {
        if (payload === void 0) { payload = {}; }
        this.payload = payload;
        this.type = "null";
    }
    return NullRequest;
}());
/**
 * @namespace Heartland.Ajax
 */
var Ajax = (function () {
    function Ajax() {
    }
    /**
     * Heartland.Ajax.jsonp
     *
     * Creates a new DOM node containing a created JSONP callback handler for an
     * impending Ajax JSONP request. Removes need for `XMLHttpRequest`.
     *
     * @param {string} url
     * @param {function} callback
     */
    Ajax.jsonp = function (request, callback) {
        var script = document.createElement('script');
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function (data) {
            window[callbackName] = undefined;
            document.body.removeChild(script);
            callback(data);
        };
        script.src = request.url + (request.url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName
            + '&' + request.payload;
        document.body.appendChild(script);
    };
    /**
     * Heartland.Ajax.cors
     *
     * Creates a new `XMLHttpRequest` object for a POST request to the given `url`.
     *
     * @param {string} url
     * @param {function} callback
     */
    Ajax.cors = function (request, callback) {
        var xhr;
        var method = 'POST';
        var timeout;
        if ((new XMLHttpRequest()).withCredentials === undefined) {
            xhr = new window.XDomainRequest();
            method = 'GET';
            request.url = request.url.split('?')[0];
            request.url = request.url + '?' + request.payload;
            xhr.open(method, request.url);
        }
        else {
            xhr = new XMLHttpRequest();
            xhr.open(method, request.url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        var cb = function (e) {
            clearTimeout(timeout);
            if (e.type === 'error') {
                callback({ error: { message: 'communication error' } });
                return;
            }
            if (xhr.readyState === 4 || (xhr.readyState !== 4 && xhr.responseText !== '')) {
                var data = JSON2.parse(xhr.responseText);
                callback(data);
            }
            else {
                callback({ error: { message: 'no data' } });
            }
        };
        xhr.onload = cb;
        xhr.onerror = cb;
        xhr.send(request.payload);
        timeout = setTimeout(function () {
            xhr.abort();
            callback({ error: { message: 'timeout' } });
        }, 5000);
    };
    return Ajax;
}());

var cardTypes = [
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

var CardNumber = (function () {
    function CardNumber() {
    }
    CardNumber.prototype.format = function (number) {
        number = number.replace(/\D/g, '');
        var type = Card.typeByNumber(number);
        if (!type) {
            return number;
        }
        var matches = number.match(type.format);
        if (!matches) {
            return number;
        }
        if (!type.format.global) {
            matches.shift();
        }
        return matches.join(' ').replace(/^\s+|\s+$/gm, '');
    };
    return CardNumber;
}());

var Expiration = (function () {
    function Expiration() {
    }
    Expiration.prototype.format = function (exp, final) {
        if (final === void 0) { final = false; }
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
        if (final && year.length === 2) {
            year = (new Date).getFullYear().toString().slice(0, 2) + year;
        }
        return month + del + year;
    };
    return Expiration;
}());

var CardNumber$1 = (function () {
    function CardNumber() {
    }
    CardNumber.prototype.validate = function (number) {
        if (!number) {
            return false;
        }
        number = number.replace(/[-\s]/g, '');
        var type = Card.typeByNumber(number);
        if (!type) {
            return false;
        }
        return Card.luhnCheck(number)
            && number.length === type.length;
    };
    return CardNumber;
}());

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
}());

var Expiration$1 = (function () {
    function Expiration() {
    }
    Expiration.prototype.validate = function (exp) {
        var m, y;
        if (!exp) {
            return false;
        }
        var split = exp.split('/');
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
        if (y.length === 2) {
            y = (new Date).getFullYear().toString().slice(0, 2) + y;
        }
        var month = parseInt(m, 10);
        var year = parseInt(y, 10);
        if (!(1 <= month && month <= 12)) {
            return false;
        }
        // creates date as 1 day past end of
        // expiration month since JS months
        // are 0 indexed
        return (new Date(year, month, 1)) > (new Date);
    };
    return Expiration;
}());

/**
 * @namespace Heartland.DOM
 */
var DOM = (function () {
    function DOM() {
    }
    /**
     * Heartland.DOM.configureField
     *
     * Configures an input field in a single field iFrame.
     *
     * @param {Heartland.HPS} hps
     */
    DOM.configureField = function (hps) {
        document.getElementById('heartland-field').setAttribute('name', hps.field);
    };
    /**
     * Heartland.DOM.makeFrame
     *
     * Creates a single iFrame element with the appropriate defaults.
     *
     * @param {string} name
     * @returns {HTMLIframeElement}
     */
    DOM.makeFrame = function (name) {
        var frame = document.createElement('iframe');
        frame.id = 'heartland-frame-' + name;
        frame.name = name;
        frame.style.border = '0';
        frame.frameBorder = '0';
        frame.scrolling = 'no';
        frame.setAttribute('allowtransparency', 'true');
        return frame;
    };
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
    DOM.addField = function (formParent, fieldType, fieldName, fieldValue) {
        var input = document.createElement('input');
        input.setAttribute('type', fieldType);
        input.setAttribute('name', fieldName);
        input.setAttribute('value', fieldValue);
        document.getElementById(formParent).appendChild(input);
    };
    /**
     * Heartland.DOM.setStyle
     *
     * Sets an element's style attribute within a child iframe window.
     *
     * @param {string} elementid
     * @param {string} htmlstyle
     */
    DOM.setStyle = function (elementid, htmlstyle) {
        var el = document.getElementById(elementid);
        if (el) {
            el.setAttribute('style', DOM.encodeEntities(htmlstyle));
        }
    };
    /**
     * Heartland.DOM.appendStyle
     *
     * Appends an element's style attribute within a child iframe window.
     *
     * @param {string} elementid
     * @param {String} htmlstyle
     */
    DOM.appendStyle = function (elementid, htmlstyle) {
        var el = document.getElementById(elementid);
        if (el) {
            var currstyle = el.getAttribute('style');
            var newstyle = (currstyle ? currstyle : '') + htmlstyle;
            el.setAttribute('style', DOM.encodeEntities(newstyle));
        }
    };
    /**
     * Heartland.DOM.setText
     *
     * Sets an element's inner text within a child iframe window.
     *
     * @param {string} elementid
     * @param {string} text
     */
    DOM.setText = function (elementid, text) {
        var el = document.getElementById(elementid);
        if (el) {
            el.textContent = DOM.encodeEntities(text);
        }
    };
    /**
     * Heartland.DOM.setValue
     *
     * Sets an element's value within a child iframe window
     *
     * @param {string} elementid
     * @param {string} value
     */
    DOM.setValue = function (elementid, text) {
        var el = document.getElementById(elementid);
        if (el && typeof el.value !== "undefined") {
            el.value = DOM.encodeEntities(text);
        }
    };
    /**
     * Heartland.DOM.setPlaceholder
     *
     * Sets an element's placeholder attribute within a child iframe window.
     *
     * @param {string} elementid
     * @param {string} text
     */
    DOM.setPlaceholder = function (elementid, text) {
        var el = document.getElementById(elementid);
        if (el) {
            if (text === '•••• •••• •••• ••••' || text === '••••' || text === '•••'
                || text === '···· ···· ···· ····') {
                el.setAttribute('placeholder', text);
            }
            else {
                el.setAttribute('placeholder', DOM.encodeEntities(text));
            }
        }
    };
    /**
     * Heartland.DOM.resizeFrame
     *
     * Alerts a parent window to resize the iframe.
     *
     * @param {Heartland.HPS} hps
     */
    DOM.resizeFrame = function (hps) {
        var docHeight = document.body.offsetHeight + 1; // off by one error
        hps.Messages.post({ action: 'resize', height: docHeight }, 'parent');
    };
    /**
     * Heartland.DOM.setFieldData
     *
     * Receives a field value from another frame prior to the tokenization process.
     *
     * @param {string} elementid
     * @param {string} value
     */
    DOM.setFieldData = function (elementid, value) {
        var el = document.getElementById(elementid);
        if (!el && document.getElementById('heartland-field')) {
            el = document.createElement('input');
            el.setAttribute('id', DOM.encodeEntities(elementid));
            el.setAttribute('type', 'hidden');
            document.getElementById('heartland-field-wrapper').appendChild(el);
        }
        if (el) {
            el.setAttribute('value', DOM.encodeEntities(value));
        }
    };
    /**
     * Heartland.DOM.getFieldData
     *
     * Retrieves a field value for another frame prior to the tokenization process.
     *
     * @param {Heartland.HPS} hps
     * @param {string} elementid
     */
    DOM.getFieldData = function (hps, elementid) {
        var el = document.getElementById(elementid);
        if (el) {
            hps.Messages.post({ action: 'passData', value: el.value }, 'parent');
        }
    };
    /**
     * Heartland.DOM.addStylesheet
     *
     * Creates a `style` node in the DOM with the given `css`.
     *
     * @param {Heartland.HPS} hps
     * @param {string} elementid
     */
    DOM.addStylesheet = function (css) {
        var el = document.createElement('style');
        var elements = document.getElementsByTagName('head');
        el.type = 'text/css';
        el.appendChild(document.createTextNode(css));
        if (elements && elements[0]) {
            elements[0].appendChild(el);
        }
    };
    /**
     * Heartland.DOM.json2css
     *
     * Converts a JSON node to text representing CSS.
     *
     * @param {string} json
     * @returns {string}
     */
    DOM.json2css = function (json) {
        var css = '';
        var attributes;
        var children;
        var i, j;
        var key, value;
        if (attributes = DOM.jsonAttributes(json)) {
            var attributesLength = attributes.length;
            for (i = 0; i < attributesLength; i++) {
                key = attributes[i];
                value = json[key];
                if (DOM.isArray(value)) {
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
        if (children = DOM.jsonChildren(json)) {
            var childrenLength = children.length;
            for (i = 0; i < childrenLength; i++) {
                key = children[i];
                value = json[key];
                css += key + '{' + DOM.json2css(value) + '}';
            }
        }
        return css;
    };
    /**
     * Heartland.DOM.setFocus
     *
     * Sets the focus on an iframe's field.
     *
     * @param {Heartland.HPS} hps
     * @param {string} elementid
     */
    DOM.setFocus = function () {
        var el = document.getElementById('heartland-field');
        if (el) {
            el.focus();
        }
    };
    /**
     * Heartland.DOM.addCertAlert
     *
     * Adds an alert letting the developer know they're in sandbox mode
     *
     * @param {string} elementid
     *
     */
    DOM.addCertAlert = function (elementid) {
        var el = document.createElement('div');
        var text = document.createTextNode("This page is currently in test mode. Do not use real/active card numbers.");
        el.appendChild(text);
        el.style.display = "block";
        el.style.width = "100%";
        el.style.marginBottom = "5px";
        el.style.color = "#fff";
        el.style.backgroundColor = "#770000";
        el.style.padding = "8px 5px";
        el.style.fontFamily = "Verdana";
        el.style.fontWeight = "100";
        el.style.fontSize = "12px";
        el.style.textAlign = "center";
        el.style.boxSizing = "border-box";
        var container = document.getElementById(elementid);
        var frame = document.getElementById('heartland-frame-cardNumber');
        if (frame) {
            container.insertBefore(el, frame);
        }
        else {
            var frame2 = document.getElementById('heartland-frame-heartland-frame-securesubmit');
            container.insertBefore(el, frame2);
        }
    };
    /***********
     * Helpers *
     ***********/
    /**
     * Escapes all potentially dangerous characters, so that the
     * resulting string can be safely inserted into attribute or
     * element text.
     *
     * @param value
     * @returns {string} escaped text
     */
    DOM.encodeEntities = function (value) {
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
    };
    DOM.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    DOM.jsonAttributes = function (json) {
        var set = [];
        for (var i in json) {
            if (json.hasOwnProperty(i)
                && (typeof json[i] === 'string' || DOM.isArray(json[i]))) {
                set.push(i);
            }
        }
        return set;
    };
    DOM.jsonChildren = function (json) {
        var set = [];
        for (var i in json) {
            if (json.hasOwnProperty(i)
                && (Object.prototype.toString.call(json[i]) === '[object Object]')) {
                set.push(i);
            }
        }
        return set;
    };
    return DOM;
}());

var Expiration$2 = (function () {
    function Expiration() {
    }
    Expiration.prototype.format = function (exp, final) {
        if (final === void 0) { final = false; }
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
        if (final && year.length === 2) {
            year = (new Date).getFullYear().toString().slice(0, 2) + year;
        }
        return month + del + year;
    };
    return Expiration;
}());

var Ev = (function () {
    function Ev() {
    }
    Ev.listen = function (node, eventName, callback) {
        if (document.addEventListener) {
            node.addEventListener(eventName, callback, false);
        }
        else {
            if (node === document) {
                document.documentElement.attachEvent('onpropertychange', function (e) {
                    if (e.propertyName === eventName) {
                        callback(e);
                    }
                });
            }
            else {
                node.attachEvent('on' + eventName, callback);
            }
        }
    };
    Ev.trigger = function (node, eventName) {
        if (document.createEvent) {
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
            node.dispatchEvent(event);
        }
        else {
            document.documentElement[eventName]++;
        }
    };
    Ev.ignore = function (eventName, callback) {
        if (document.removeEventListener) {
            document.removeEventListener(eventName, callback, false);
        }
        else {
            document.documentElement.detachEvent('onpropertychange', function (e) {
                if (e.propertyName === eventName) {
                    callback(e);
                }
            });
        }
    };
    return Ev;
}());
/**
 * @namespace Heartland.Events
 */
var Events = (function () {
    function Events() {
    }
    /**
     * Heartland.Events.addHandler
     *
     * Adds an `event` handler for a given `target` element.
     *
     * @param {string | EventTarget} target
     * @param {string} event
     * @param {EventListener} callback
     */
    Events.addHandler = function (target, event, callback) {
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
            Ev.listen(node, event, callback);
        }
    };
    /**
     * Heartland.Events.removeHandler
     *
     * Removes an `event` handler for a given `target` element.
     *
     * @param {string | EventTarget} target
     * @param {string} event
     * @param {EventListener} callback
     */
    Events.removeHandler = function (target, event, callback) {
        var node;
        if (typeof target === 'string') {
            node = document.getElementById(target);
        }
        else {
            node = target;
        }
        if (document.removeEventListener) {
            node.removeEventListener(event, callback, false);
        }
        else {
            Ev.ignore(event, callback);
        }
    };
    /**
     * Heartland.Events.trigger
     *
     * Fires off an `event` for a given `target` element.
     *
     * @param {string} name
     * @param {any} target
     * @param {any} data [optional]
     */
    Events.trigger = function (name, target, data, bubble) {
        if (bubble === void 0) { bubble = false; }
        if (document.createEvent) {
            var event = document.createEvent('Event');
            event.initEvent(name, true, true);
            target.dispatchEvent(event);
        }
        else {
            Ev.trigger(target, name);
        }
    };
    /**
     * Heartland.Events.frameHandleWith
     *
     * Wraps `hps` state in a closure to provide a `Heartland.Messages.receive`
     * callback handler for iFrame children.
     *
     * @param {Heartland.HPS} hps
     */
    Events.frameHandleWith = function (hps) {
        return function (data) {
            switch (data.action) {
                case 'tokenize':
                    if (data.accumulateData) {
                        hps.Messages.post({
                            action: 'accumulateData'
                        }, 'parent');
                        var elOpts = document.getElementById('tokenizeOptions');
                        if (!elOpts) {
                            elOpts = document.createElement('input');
                            elOpts.id = 'tokenizeOptions';
                            elOpts.type = 'hidden';
                        }
                        var elPK = document.getElementById('publicKey');
                        if (!elPK) {
                            elPK = document.createElement('input');
                            elPK.id = 'publicKey';
                            elPK.type = 'hidden';
                        }
                        if (data.data) {
                            elOpts.value = JSON2.stringify(data.data);
                            elPK.value = data.data.publicKey;
                        }
                        else {
                            elOpts.value = JSON2.stringify({ publicKey: data.message });
                            elPK.value = data.message;
                        }
                        document
                            .getElementById('heartland-field-wrapper')
                            .appendChild(elOpts);
                        document
                            .getElementById('heartland-field-wrapper')
                            .appendChild(elPK);
                    }
                    else {
                        Events.tokenizeIframe(hps, data.data);
                    }
                    break;
                case 'setStyle':
                    DOM.setStyle(data.id, data.style);
                    DOM.resizeFrame(hps);
                    break;
                case 'appendStyle':
                    DOM.appendStyle(data.id, data.style);
                    DOM.resizeFrame(hps);
                    break;
                case 'setText':
                    DOM.setText(data.id, data.text);
                    DOM.resizeFrame(hps);
                    break;
                case 'setValue':
                    DOM.setValue(data.id, data.text);
                    break;
                case 'setPlaceholder':
                    DOM.setPlaceholder(data.id, data.text);
                    break;
                case 'setFieldData':
                    DOM.setFieldData(data.id, data.value);
                    if (document.getElementById('heartland-field') &&
                        document.getElementById('cardCvv') &&
                        document.getElementById('cardExpiration')) {
                        var opts = document.getElementById('tokenizeOptions');
                        var pk = document.getElementById('publicKey');
                        Events.tokenizeIframe(hps, (opts && opts.getAttribute('value') !== 'undefined'
                            ? JSON2.parse(opts.getAttribute('value'))
                            : { publicKey: pk.getAttribute('value') }));
                    }
                    break;
                case 'getFieldData':
                    DOM.getFieldData(hps, data.id);
                    break;
                case 'addStylesheet':
                    DOM.addStylesheet(data.data);
                    DOM.resizeFrame(hps);
                    break;
                case 'setFocus':
                    DOM.setFocus();
                    break;
            }
        };
    };
    /**
     * tokenizeIframe
     *
     * Tokenizes card data. Used in iframe integrations to tokenize on Heartland's
     * servers.
     *
     * @param {Heartland.HPS} hps
     * @param {string} publicKey
     */
    Events.tokenizeIframe = function (hps, data) {
        var card = {};
        var numberElement = (document.getElementById('heartland-field')
            || document.getElementById('heartland-card-number'));
        var cvvElement = (document.getElementById('cardCvv')
            || document.getElementById('heartland-cvv'));
        var expElement = document.getElementById('cardExpiration');
        var tokenResponse = function (action) {
            return function (response) {
                hps.Messages.post({ action: action, response: response }, 'parent');
                if (cvvElement) {
                    if (cvvElement.parentNode) {
                        cvvElement.parentNode.removeChild(cvvElement);
                    }
                    else {
                        cvvElement.remove();
                    }
                }
                if (expElement) {
                    if (expElement.parentNode) {
                        expElement.parentNode.removeChild(expElement);
                    }
                    else {
                        expElement.remove();
                    }
                }
            };
        };
        card.number = numberElement ? numberElement.value : '';
        card.cvv = cvvElement ? cvvElement.value : '';
        card.exp = expElement;
        if (card.exp) {
            var formatter = new Expiration$2();
            var cardExpSplit = formatter.format(card.exp.value, true).split('/');
            card.expMonth = cardExpSplit[0];
            card.expYear = cardExpSplit[1];
            card.exp = undefined;
        }
        else {
            card.expMonth = document.getElementById('heartland-expiration-month').value;
            card.expYear = document.getElementById('heartland-expiration-year').value;
        }
        hps.tokenize({
            cardCvv: card.cvv ? card.cvv : '',
            cardExpMonth: card.expMonth ? card.expMonth : '',
            cardExpYear: card.expYear ? card.expYear : '',
            cardNumber: card.number ? card.number : '',
            cca: data.cca,
            error: tokenResponse('onTokenError'),
            publicKey: data.publicKey ? data.publicKey : '',
            success: tokenResponse('onTokenSuccess'),
            type: 'pan'
        });
    };
    /**
     * addFieldFrameFocusEvent
     *
     * Ensures an iframe's document forwards its received focus
     * to the input field. Helps provide consistent behavior in
     * all browsers.
     *
     * @param {Heartland.HPS} hps
     */
    Events.addFieldFrameFocusEvent = function (hps) {
        var element = document.getElementById('heartland-field');
        var focusEventName = 'focus';
        if (document['on' + focusEventName + 'in']) {
            document.addEventListener(focusEventName + 'in', function (e) {
                if (event.fromElement === element) {
                    return;
                }
                if (event.relatedTarget) {
                    return;
                }
                element.focus();
            }, false);
        }
        else {
            document.addEventListener(focusEventName, function (e) {
                element.focus();
            }, false);
        }
    };
    return Events;
}());

/**
 * @namespace Heartland.Card
 */
var Card = (function () {
    function Card() {
    }
    /**
     * Heartland.Card.typeByNumber
     *
     * Helper function to grab the CardType for a given card number.
     *
     * @param {string} number - The card number
     * @returns {Heartland.CardType}
     */
    Card.typeByNumber = function (number) {
        var cardType;
        var i;
        if (!number) {
            return null;
        }
        if (number.replace(/^\s+|\s+$/gm, '').length < 4) {
            return null;
        }
        for (i in cardTypes) {
            cardType = cardTypes[i];
            if (cardType && cardType.regex && cardType.regex.test(number)) {
                break;
            }
        }
        return cardType;
    };
    /**
     * Heartland.Card.typeByTrack
     *
     * @param {string} data - track data
     * @param {boolean} isEncrypted - (default: false)
     * @param {string} trackNumber
     *
     * @returns CardType
     */
    Card.typeByTrack = function (data, isEncrypted, trackNumber) {
        if (isEncrypted === void 0) { isEncrypted = false; }
        var number;
        if (isEncrypted && trackNumber && trackNumber === '02') {
            number = data.split('=')[0];
        }
        else {
            var temp = data.split('%');
            if (temp[1]) {
                temp = temp[1].split('^');
                if (temp[0]) {
                    number = temp[0].toString().substr(1);
                }
            }
        }
        return Card.typeByNumber(number);
    };
    /**
     * Heartland.Card.luhnCheck
     *
     * Runs a mod 10 check on a given card number.
     *
     * @param {string} number - The card number
     * @returns {boolean}
     */
    Card.luhnCheck = function (number) {
        var odd = true;
        var i = 0;
        var sum = 0;
        var digit;
        if (!number) {
            return false;
        }
        var digits = number.split('').reverse();
        var length = digits.length;
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
    };
    /**
     * Heartland.Card.addType
     *
     * Adds a class to the target element with the card type
     * inferred from the target's current value.
     *
     * @param {Event} e
     */
    Card.addType = function (e) {
        var target = (e.currentTarget ? e.currentTarget : e.srcElement);
        var type = Card.typeByNumber(target.value);
        var classList = target.className.split(' ');
        var length = classList.length;
        var i = 0;
        var c = '';
        for (i; i < length; i++) {
            c = classList[i];
            if (c && c.indexOf('card-type-') !== -1) {
                delete classList[i];
            }
        }
        if (type) {
            classList.push('card-type-' + type.code);
        }
        target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
    };
    /**
     * Heartland.Card.formatNumber
     *
     * Formats a target element's value based on the
     * inferred card type's formatting regex.
     *
     * @param {Event} e
     */
    Card.formatNumber = function (e) {
        var target = (e.currentTarget ? e.currentTarget : e.srcElement);
        var value = target.value;
        if (value.length === 0) {
            return;
        }
        var formatted = (new CardNumber).format(value);
        target.value = formatted;
        if (!target.setSelectionRange) {
            return;
        }
        var cursor = target.selectionStart;
        // copy and paste, space inserted on formatter
        if (value.length < formatted.length) {
            cursor += formatted.length - value.length;
        }
        // check if before new inserted digit is a space
        if (value.charAt(cursor) === ' ' &&
            formatted.charAt(cursor - 1) === ' ') {
            cursor += 1;
        }
        target.setSelectionRange(cursor, cursor);
    };
    /**
     * Heartland.Card.formatExpiration
     *
     * Formats a target element's value.
     *
     * @param {KeyboardEvent} e
     */
    Card.formatExpiration = function (e) {
        var target = (e.currentTarget ? e.currentTarget : e.srcElement);
        var value = target.value;
        // allow: delete, backspace
        if ([46, 8].indexOf(e.keyCode) !== -1 ||
            // allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        target.value = (new Expiration)
            .format(value, e.type === 'blur');
    };
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
    Card.restrictLength = function (length) {
        return function (e) {
            var target = (e.currentTarget ? e.currentTarget : e.srcElement);
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
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            }
        };
    };
    /**
     * Heartland.Card.restrictNumeric
     *
     * Restricts input in a target element to only
     * numeric data.
     *
     * @param {KeyboardEvent} e
     */
    Card.restrictNumeric = function (e) {
        // allow: backspace, delete, tab, escape and enter
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39) ||
            // allow: weird Android/Chrome issue
            (e.keyCode === 229)) {
            // let it happen, don't do anything
            return;
        }
        // ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        }
    };
    /**
     * Heartland.Card.deleteProperly
     *
     * Places cursor on the correct position to
     * let the browser delete the digit instead
     * of the space.
     *
     * @param {KeyboardEvent} e
     */
    Card.deleteProperly = function (e) {
        var target = (e.currentTarget ? e.currentTarget : e.srcElement);
        var value = target.value;
        if (!target.setSelectionRange) {
            return;
        }
        var cursor = target.selectionStart;
        // allow: delete, backspace
        if ([46, 8].indexOf(e.keyCode) !== -1 &&
            // if space to be deleted
            (value.charAt(cursor - 1) === ' ')) {
            // placing cursor before space to delete digit instead
            target.setSelectionRange(cursor - 1, cursor - 1);
        }
    };
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
    Card.validateNumber = function (e) {
        var target = (e.currentTarget ? e.currentTarget : e.srcElement);
        var value = target.value;
        var classList = target.className.split(' ');
        var length = classList.length;
        var c = '';
        for (var i = 0; i < length; i++) {
            c = classList[i];
            if (c.indexOf('valid') !== -1) {
                delete classList[i];
            }
        }
        if ((new CardNumber$1).validate(value)) {
            classList.push('valid');
        }
        else {
            classList.push('invalid');
        }
        target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
    };
    /**
     * Heartland.Card.validateCvv
     *
     * Validates a target element's value based on the
     * possible CVV lengths. Adds a class to the target
     * element to note `valid` or `invalid`.
     *
     * @param {Event} e
     */
    Card.validateCvv = function (e) {
        var target = (e.currentTarget ? e.currentTarget : e.srcElement);
        var value = target.value;
        var classList = target.className.split(' ');
        var length = classList.length;
        var c = '';
        for (var i = 0; i < length; i++) {
            c = classList[i];
            if (c.indexOf('valid') !== -1) {
                delete classList[i];
            }
        }
        if ((new Cvv).validate(value)) {
            classList.push('valid');
        }
        else {
            classList.push('invalid');
        }
        target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
    };
    /**
     * Heartland.Card.validateExpiration
     *
     * Validates a target element's value based on the
     * current date. Adds a class to the target element
     * to note `valid` or `invalid`.
     *
     * @param {Event} e
     */
    Card.validateExpiration = function (e) {
        var target = (e.currentTarget ? e.currentTarget : e.srcElement);
        var value = target.value;
        var classList = target.className.split(' ');
        var length = classList.length;
        var c = '';
        for (var i = 0; i < length; i++) {
            c = classList[i];
            if (c.indexOf('valid') !== -1) {
                delete classList[i];
            }
        }
        if ((new Expiration$1).validate(value)) {
            classList.push('valid');
        }
        else {
            classList.push('invalid');
        }
        target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
    };
    /**
     * Heartland.Card.attachNumberEvents
     *
     * @param {string} selector
     */
    Card.attachNumberEvents = function (selector) {
        Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictNumeric);
        Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictLength(19));
        Events.addHandler(document.querySelector(selector), 'keydown', Card.deleteProperly);
        Events.addHandler(document.querySelector(selector), 'keyup', Card.formatNumber);
        Events.addHandler(document.querySelector(selector), 'input', Card.formatNumber);
        Events.addHandler(document.querySelector(selector), 'input', Card.validateNumber);
        Events.addHandler(document.querySelector(selector), 'input', Card.addType);
    };
    /**
     * Heartland.Card.attachExpirationEvents
     *
     * @param {string} selector
     */
    Card.attachExpirationEvents = function (selector) {
        Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictNumeric);
        Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictLength(9));
        Events.addHandler(document.querySelector(selector), 'keyup', Card.formatExpiration);
        Events.addHandler(document.querySelector(selector), 'blur', Card.formatExpiration);
        Events.addHandler(document.querySelector(selector), 'input', Card.validateExpiration);
        Events.addHandler(document.querySelector(selector), 'blur', Card.validateExpiration);
    };
    /**
     * Heartland.Card.attachCvvEvents
     *
     * @param {string} selector
     */
    Card.attachCvvEvents = function (selector) {
        Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictNumeric);
        Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictLength(4));
        Events.addHandler(document.querySelector(selector), 'input', Card.validateCvv);
    };
    return Card;
}());
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}

var Formatter = {
    CardNumber: CardNumber,
    Expiration: Expiration
};

var defaults = {
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
    onEvent: null,
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

var fields = [
    'cardNumber',
    'cardCvv',
    'cardExpiration',
    'submit'
];

var urls = {
    CERT: 'https://cert.api2.heartlandportico.com/Hps.Exchange.PosGateway.Hpf.v1/api/token',
    PROD: 'https://api.heartlandportico.com/SecureSubmit.v1/api/token',
    iframeCERT: 'https://hps.github.io/token/2.1/',
    iframePROD: 'https://api.heartlandportico.com/SecureSubmit.v1/token/2.1/'
};

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
            var i = 0;
            var targetUrl = '';
            var current;
            var targetNode;
            var re = /^#?\d+&/;
            var length = hps.mailbox.length;
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
                current = JSON2.parse(decodeURIComponent(window.location.hash.replace(re, '')));
                data.concat(current);
            }
            if (messageArr !== []) {
                hps.cacheBust = hps.cacheBust || 1;
                data.push({ data: messageArr, source: { name: hps.field || 'parent' } });
                var message = JSON2.stringify(data);
                var url = targetUrl.replace(/#.*$/, '') + '#' +
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
        var targetNode;
        message.source = message.source || {};
        message.source.name = window.name;
        if (!this.hps.frames) {
            return;
        }
        var frame = this.hps.frames[target] || this.hps[target];
        if (!frame) {
            return;
        }
        var targetUrl = this.hps.frames[target].url;
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
            targetNode.postMessage(JSON2.stringify(message), targetUrl);
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
                try {
                    callback(JSON2.parse(m.data));
                }
                catch (e) { }
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
                        var data = JSON2.parse(decodeURIComponent(hash.replace(re, '')));
                        this.lastHash = hash;
                        for (var i in data) {
                            var m = data[i];
                            if (Object.prototype.toString.call(m.data) !== '[object Array]') {
                                callback(m);
                                continue;
                            }
                            for (var j in m.data) {
                                callback({ data: m.data[j], source: m.source });
                            }
                        }
                    }
                }, 100);
            }
        }
        Events.trigger('receiveMessageHandlerAdded', document);
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
    /**
     * Heartland.Messages.dispose
     *
     * Removes active `message` event handler function and any
     * active intervals.
     */
    Messages.prototype.dispose = function () {
        this.removeReceiver();
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };
    return Messages;
}());

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
            var length = ids.length;
            var i = 0;
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
            var length = ids.length;
            var i = 0;
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
            var length = ids.length;
            var i = 0;
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
            var length = ids.length;
            var i = 0;
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
})(Styles || (Styles = {}));

/**
 * @namespace Heartland.Frames
 */
var Frames = (function () {
    function Frames() {
    }
    /**
     * Heartland.Frames.configureIframe
     *
     * Prepares the pages iFrames for communication with the parent window.
     *
     * @param {Heartland.HPS} hps
     * @listens click
     * @listens message
     */
    Frames.configureIframe = function (hps) {
        var frame;
        var options = hps.options;
        var target;
        var useDefaultStyles = true;
        hps.Messages = hps.Messages || new Messages(hps);
        if (options.env === 'cert') {
            hps.iframe_url = urls.iframeCERT;
        }
        else {
            hps.iframe_url = urls.iframePROD;
        }
        if (options.fields !== defaults.fields) {
            Frames.makeFieldsAndLink(hps);
        }
        if (options.fields === defaults.fields && options.iframeTarget) {
            target = document.getElementById(options.iframeTarget);
            if (options.targetType === 'myframe') {
                frame = target;
                hps.iframe_url = frame.src;
            }
            else {
                frame = DOM.makeFrame('heartland-frame-securesubmit');
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
            hps.clickHandler = function (e) {
                e.preventDefault();
                hps.Messages.post({
                    accumulateData: !!hps.frames.cardNumber,
                    action: 'tokenize',
                    data: { publicKey: options.publicKey }
                }, hps.frames.cardNumber ? 'cardNumber' : 'child');
                return false;
            };
            Events.addHandler(options.buttonTarget, 'click', hps.clickHandler);
        }
        hps.Messages.receive(function (data) {
            var fieldFrame;
            try {
                fieldFrame = hps.frames[data.source.name === 'heartland-frame-securesubmit' ? 'parent' : data.source.name];
            }
            catch (e) {
                return;
            }
            switch (data.action) {
                case 'requestTokenize':
                    hps.Messages.post({
                        accumulateData: !!hps.frames.cardNumber,
                        action: 'tokenize',
                        data: options
                    }, hps.frames.cardNumber ? 'cardNumber' : 'child');
                    break;
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
                        Styles.Defaults.body(hps);
                        Styles.Defaults.labelsAndLegend(hps);
                        Styles.Defaults.inputsAndSelects(hps);
                        Styles.Defaults.fieldset(hps);
                        Styles.Defaults.selects(hps);
                        Styles.Defaults.selectLabels(hps);
                        Styles.Defaults.cvvContainer(hps);
                        Styles.Defaults.cvv(hps);
                    }
                    if (fieldFrame && fieldFrame.options.placeholder) {
                        hps.Messages.post({
                            action: 'setPlaceholder',
                            id: 'heartland-field',
                            text: fieldFrame.options.placeholder
                        }, fieldFrame.name);
                    }
                    if (fieldFrame && fieldFrame.options.value) {
                        hps.Messages.post({
                            action: 'setValue',
                            id: 'heartland-field',
                            text: fieldFrame.options.value
                        }, fieldFrame.name);
                    }
                    if (options.style) {
                        var css = options.styleString
                            || (options.styleString = DOM.json2css(options.style));
                        hps.Messages.post({
                            action: 'addStylesheet',
                            data: css
                        }, fieldFrame.name);
                    }
                    Events.trigger('securesubmitIframeReady', document);
                    break;
                case 'accumulateData':
                    for (var i in hps.frames) {
                        if ('submit' === i || 'cardNumber' === i) {
                            continue;
                        }
                        var field = hps.frames[i];
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
                case 'fieldEvent':
                    if (!options.onEvent) {
                        break;
                    }
                    options.onEvent(data.event);
                    break;
                case 'error':
                    if (!options.onError) {
                        break;
                    }
                    options.onError(data);
                    break;
            }
        }, '*');
    };
    /**
     * Heartland.Frames.makeFieldsAndLink
     *
     * Creates a set of single field iFrames and stores a reference to
     * them in the parent window's state.
     *
     * @param {Heartland.HPS} hps
     */
    Frames.makeFieldsAndLink = function (hps) {
        var options = hps.options;
        var fieldsLength = fields.length;
        var baseUrl = hps.iframe_url.replace('index.html', '');
        for (var i = 0; i < fieldsLength; i++) {
            var field = fields[i];
            var fieldOptions = options.fields[field];
            if (!fieldOptions) {
                return;
            }
            var frame = DOM.makeFrame(field);
            var url = baseUrl;
            if (field === 'submit') {
                url = url + 'button.html';
            }
            else if (options.cca && options.env === 'cert') {
                url = url + 'fieldCca.cert.html';
            }
            else if (options.cca && options.env === 'prod') {
                url = url + 'fieldCca.prod.html';
            }
            else {
                url = url + 'field.html';
            }
            url = url + '#' + field + ':' + encodeURIComponent(document.location.href.split('#')[0]);
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
    };
    /**
     * Heartland.Frames.monitorFieldEvents
     *
     * @param {Heartland.HPS} hps
     * @param {string | EventTarget} target
     */
    Frames.monitorFieldEvents = function (hps, target) {
        var events = ['click', 'blur', 'focus', 'change', 'keypress', 'keydown', 'keyup'];
        var i = 0, length = events.length;
        for (i; i < length; i++) {
            var event = events[i];
            Events.addHandler(target, event, function (e) {
                var field = document.getElementById('heartland-field');
                var classes = [];
                var data = {};
                if (field.className !== '') {
                    classes = field.className.split(' ');
                }
                if (e.keyCode) {
                    data.keyCode = e.keyCode;
                }
                hps.Messages.post({
                    action: 'fieldEvent',
                    event: {
                        classes: classes,
                        data: data,
                        source: window.name,
                        type: e.type
                    }
                }, 'parent');
            });
        }
    };
    return Frames;
}());

/**
 * @namespace Heartland.Util
 */
var Util = (function () {
    function Util() {
    }
    /**
     * Heartland.Util.getCardType
     *
     * Parses a credit card number to obtain the card type/brand.
     *
     * @param {string} tokenizationType
     * @param {Heartland.Options} options
     */
    Util.getCardType = function (tokenizationType, options) {
        var cardType;
        var data = '';
        var type = 'unknown';
        switch (tokenizationType) {
            case 'swipe':
                data = options.track;
                cardType = Card.typeByTrack(data);
                break;
            case 'encrypted':
                data = options.track;
                cardType = Card.typeByTrack(data, true, options.trackNumber);
                break;
            default:
                data = options.cardNumber;
                cardType = Card.typeByNumber(data);
                break;
        }
        if (cardType) {
            type = cardType.code;
        }
        return type;
    };
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
    Util.applyOptions = function (source, properties) {
        var destination = {};
        if (!source) {
            source = {};
        }
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                destination[property] = properties[property];
            }
        }
        return destination;
    };
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
    Util.throwError = function (options, errorMessage) {
        if (typeof (options.error) === 'function') {
            options.error(errorMessage);
            return;
        }
        if (errorMessage.error) {
            throw new Error(errorMessage.error.message);
        }
        throw new Error(errorMessage);
    };
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
    Util.getItemByPropertyValue = function (collection, property, value) {
        var length = collection.length;
        var i = 0;
        for (i; i < length; i++) {
            if (collection[i][property] === value) {
                return collection[i];
            }
        }
    };
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
    Util.getParams = function (type, data) {
        var params = [];
        switch (type) {
            case 'iframe':
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
                Util.throwError(data, 'unknown params type');
                break;
        }
        return params.join('&');
    };
    /**
     * Heartland.Util.getUrlByEnv
     *
     * Selects the appropriate tokenization service URL for the
     * active `publicKey`.
     *
     * @param {Heartland.Options} options
     * @returns {string}
     */
    Util.getUrlByEnv = function (options) {
        options.env = options.publicKey.split('_')[1];
        if (options.env === 'cert') {
            options.gatewayUrl = urls.CERT;
        }
        else {
            options.gatewayUrl = urls.PROD;
        }
        return options;
    };
    /**
     * Heartland.Util.addFormHandler
     *
     * Creates and adds an event handler function for the submission for a given
     * form (`options.form_id`).
     *
     * @param {Heartland.Options} options
     * @listens submit
     */
    Util.addFormHandler = function (options) {
        var payment_form = document.getElementById(options.formId);
        var code = function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            else if (window.event) {
                window.event.returnValue = false;
            }
            var fields = Util.getFields(options.formId);
            var cardType = Util.getCardType(fields.number, 'pan');
            options.cardNumber = fields.number;
            options.cardExpMonth = fields.expMonth;
            options.cardExpYear = fields.expYear;
            options.cardCvv = fields.cvv;
            options.cardType = cardType;
            Ajax.call('pan', options);
        };
        Events.addHandler(payment_form, 'submit', code);
        DOM.addField(options.formId, 'hidden', 'publicKey', options.publicKey);
    };
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
    Util.getFields = function (formParent) {
        var form = document.getElementById(formParent);
        var fields = {};
        var i;
        var length = form.childElementCount;
        for (i = 0; i < length; i++) {
            var element = form.children[i];
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
    };
    return Util;
}());

var HeartlandTokenService = (function () {
    function HeartlandTokenService(url, type) {
        if (type === void 0) { type = "pan"; }
        this.url = url;
        this.type = type;
    }
    HeartlandTokenService.prototype.tokenize = function (data, callback) {
        var _this = this;
        this.requestData = data;
        Ajax.jsonp(this.buildRequest(data), function (response) {
            callback(_this.deserializeResponseData(response));
        });
    };
    HeartlandTokenService.prototype.buildRequest = function (data) {
        return new JsonpRequest(this.url, this.serializeRequestData(data));
    };
    HeartlandTokenService.prototype.serializeRequestData = function (data) {
        return Util.getParams(this.type, data);
    };
    HeartlandTokenService.prototype.deserializeResponseData = function (data) {
        if (data.error) {
            return data;
        }
        var cardType = Util.getCardType(this.type, this.requestData);
        var card = data.card || data.encryptedcard;
        var lastfour = card.number.slice(-4);
        data.last_four = lastfour;
        data.card_type = cardType;
        data.exp_month = this.requestData.cardExpMonth;
        data.exp_year = this.requestData.cardExpYear;
        return data;
    };
    return HeartlandTokenService;
}());

var CardinalTokenService = (function () {
    function CardinalTokenService(jwt) {
        this.jwt = jwt;
    }
    CardinalTokenService.prototype.tokenize = function (data, callback) {
        var _this = this;
        var request = this.buildRequest(data);
        var cardinal = window.Cardinal;
        var cb = function (responseData, jwt) {
            responseData.jwt = jwt;
            callback(_this.deserializeResponseData(responseData));
        };
        // init only once per frame
        if (!cardinal.__secureSubmitFrameInit) {
            cardinal.setup('init', { jwt: this.jwt });
            cardinal.on('payments.validated', cb);
            cardinal.__secureSubmitFrameInit = true;
        }
        cardinal.trigger('jwt.update', this.jwt);
        cardinal.start('cca', request.payload);
    };
    CardinalTokenService.prototype.buildRequest = function (data) {
        return new NullRequest({
            Consumer: {
                Account: {
                    AccountNumber: data.cardNumber.replace(/\D/g, ''),
                    CardCode: data.cardCvv.replace(/^\s+|\s+$/g, ''),
                    ExpirationMonth: data.cardExpMonth.replace(/^\s+|\s+$/g, ''),
                    ExpirationYear: data.cardExpYear.replace(/^\s+|\s+$/g, '')
                }
            },
            Options: {
                EnableCCA: false
            },
            OrderDetails: {
                OrderNumber: data.cca.orderNumber
            }
        });
    };
    CardinalTokenService.prototype.serializeRequestData = function (data) {
        return data;
    };
    CardinalTokenService.prototype.deserializeResponseData = function (data) {
        if (typeof data.Token !== "undefined" &&
            data.Token.Token !== "undefined" &&
            data.Token.ReasonCode === "0") {
            return this.deserializeSuccessResponse(data);
        }
        return this.deserializeFailureResponse(data);
    };
    CardinalTokenService.prototype.deserializeSuccessResponse = function (data) {
        return {
            jwt: data.jwt,
            token_value: data.Token.Token
        };
    };
    CardinalTokenService.prototype.deserializeFailureResponse = function (data) {
        var message = data.ErrorDescription;
        if (data.Token && data.Token.ReasonDescription !== "") {
            message = data.Token.ReasonDescription;
        }
        return {
            error: {
                message: message
            }
        };
    };
    return CardinalTokenService;
}());

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
        this.options = Util.applyOptions(defaults, options);
        this.options = Util.getUrlByEnv(this.options);
        if (this.options.formId.length > 0) {
            Util.addFormHandler(this.options);
        }
        this.frames = {};
        if (this.options.type === 'iframe') {
            this.iframe_url = '';
            this.Messages = new Messages(this);
            this.mailbox = [];
            this.cacheBust = 1;
            Frames.configureIframe(this);
            if (this.options.env === "cert") {
                if (this.options.iframeTarget !== "") {
                    DOM.addCertAlert(this.options.iframeTarget);
                }
                else {
                    DOM.addCertAlert(this.options.fields.cardNumber.target);
                }
            }
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
        var _this = this;
        options = options || {};
        if (options) {
            this.options = Util.applyOptions(this.options, options);
            this.options = Util.getUrlByEnv(this.options);
        }
        if (this.options.type === 'iframe' && !!this.frames.cardNumber) {
            this.Messages.post({
                accumulateData: !!this.frames.cardNumber,
                action: 'tokenize',
                data: { publicKey: this.options.publicKey }
            }, 'cardNumber');
            return;
        }
        else if (this.options.type === 'iframe') {
            this.Messages.post({
                action: 'tokenize',
                data: { publicKey: this.options.publicKey }
            }, 'child');
            return;
        }
        var tokens = {
            cardinal: null,
            heartland: null
        };
        var callback = function (response) {
            if (response.error) {
                Util.throwError(_this.options, response);
            }
            else {
                if (_this.options.formId && _this.options.formId.length > 0) {
                    var heartland = response.heartland || response;
                    DOM.addField(_this.options.formId, 'hidden', 'token_value', heartland.token_value);
                    DOM.addField(_this.options.formId, 'hidden', 'last_four', heartland.last_four);
                    DOM.addField(_this.options.formId, 'hidden', 'card_exp_year', heartland.exp_year);
                    DOM.addField(_this.options.formId, 'hidden', 'card_exp_month', heartland.exp_month);
                    DOM.addField(_this.options.formId, 'hidden', 'card_type', heartland.card_type);
                }
                _this.options.success(response);
            }
        };
        var callbackWrapper = function (type) {
            return function (response) {
                tokens[type] = response;
                if (_this.options.cca && tokens.cardinal && tokens.heartland) {
                    callback(tokens);
                }
                if (!_this.options.cca && tokens.heartland) {
                    callback(tokens.heartland);
                }
            };
        };
        (new HeartlandTokenService(this.options.gatewayUrl, this.options.type))
            .tokenize(this.options, callbackWrapper('heartland'));
        if (this.options.cca) {
            (new CardinalTokenService(this.options.cca.jwt))
                .tokenize(this.options, callbackWrapper('cardinal'));
        }
    };
    /**
     * Heartland.HPS.configureInternalIframe
     *
     * Sets up a child iframe window to prepare it for communication with the
     * parent and for tokenization.
     *
     * @param {Heartland.Options} options
     */
    HPS.prototype.configureInternalIframe = function (options) {
        this.Messages = new Messages(this);
        this.parent = window.parent;
        this.frames = this.frames || {};
        this.frames.parent = {
            frame: window.parent,
            name: 'parent',
            url: decodeURIComponent(document.location.hash.replace(/^#/, ''))
        };
        this.loadHandler = (function (hps) {
            return function () {
                DOM.resizeFrame(hps);
            };
        }(this));
        this.receiveMessageHandlerAddedHandler = (function (hps) {
            return function () {
                hps.Messages.post({ action: 'receiveMessageHandlerAdded' }, 'parent');
            };
        }(this));
        Events.addHandler(window, 'load', this.loadHandler);
        Events.addHandler(document, 'receiveMessageHandlerAdded', this.receiveMessageHandlerAddedHandler);
        this.Messages.receive(Events.frameHandleWith(this), '*');
    };
    ;
    /**
     * Heartland.HPS.configureButtonFieldIframe
     *
     * Same as `Heartland.HPS.configureFieldIframe` excet the added click event
     * handler for the button.
     *
     * @param {Heartland.Options} options
     */
    HPS.prototype.configureButtonFieldIframe = function (options) {
        this.configureFieldIframe(options);
        Events.addHandler('heartland-field', 'click', (function (hps) {
            return function (e) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                hps.Messages.post({ action: 'requestTokenize' }, 'parent');
            };
        }(this)));
    };
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
        this.Messages = new Messages(this);
        this.field = split.shift();
        this.parent = window.parent;
        this.frames = this.frames || {};
        this.frames.parent = {
            frame: window.parent,
            name: 'parent',
            url: decodeURIComponent(split.join(':').replace(/^:/, ''))
        };
        window.onerror = (function (hps) {
            return function (errorMsg, url, lineNumber, column, errorObj) {
                hps.Messages.post({
                    action: 'error',
                    data: {
                        column: column,
                        errorMsg: errorMsg,
                        lineNumber: lineNumber,
                        url: url
                    }
                }, 'parent');
                return true;
            };
        }(this));
        this.loadHandler = (function (hps) {
            return function () {
                DOM.resizeFrame(hps);
                DOM.configureField(hps);
                var method = 'attach' + window.name.replace('card', '') + 'Events';
                if (Card[method]) {
                    Card[method]('#heartland-field');
                }
                Events.addFieldFrameFocusEvent(hps);
            };
        }(this));
        this.receiveMessageHandlerAddedHandler = (function (hps) {
            return function () {
                hps.Messages.post({ action: 'receiveMessageHandlerAdded' }, 'parent');
            };
        }(this));
        Events.addHandler(window, 'load', this.loadHandler);
        Events.addHandler(document, 'receiveMessageHandlerAdded', this.receiveMessageHandlerAddedHandler);
        Frames.monitorFieldEvents(this, 'heartland-field');
        this.Messages.receive(Events.frameHandleWith(this), '*');
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
    /**
     * Heartland.HPS.dispose
     *
     * Removes all iframes and event listeners from the DOM.
     */
    HPS.prototype.dispose = function () {
        this.Messages.dispose();
        this.Messages = null;
        if (this.frames.cardNumber && this.frames.cardNumber.targetNode) {
            this.removeNode(this.frames.cardNumber.frame);
        }
        if (this.frames.cardExpiration && this.frames.cardExpiration.frame) {
            this.removeNode(this.frames.cardExpiration.frame);
        }
        if (this.frames.cardCvv && this.frames.cardCvv.frame) {
            this.removeNode(this.frames.cardCvv.frame);
        }
        if (this.frames.child && this.frames.child.frame) {
            this.removeNode(this.frames.child.frame);
        }
        if (this.clickHandler) {
            Events.removeHandler(this.options.buttonTarget, 'click', this.clickHandler);
        }
        if (this.loadHandler) {
            Events.removeHandler(window, 'load', this.loadHandler);
        }
        if (this.receiveMessageHandlerAddedHandler) {
            Events.removeHandler(document, 'receiveMessageHandlerAdded', this.receiveMessageHandlerAddedHandler);
        }
    };
    ;
    HPS.prototype.removeNode = function (node) {
        if (node.remove) {
            node.remove();
        }
        else if (node.parentNode && node.parentNode.removeChild) {
            node.parentNode.removeChild(node);
        }
    };
    return HPS;
}());

var Validator = {
    CardNumber: CardNumber$1,
    Cvv: Cvv,
    Expiration: Expiration$1
};

window.HPS = HPS;
var index = {
    Ajax: Ajax,
    Card: Card,
    DOM: DOM,
    Events: Events,
    Formatter: Formatter,
    Frames: Frames,
    HPS: HPS,
    JSON: JSON2,
    Messages: Messages,
    Styles: Styles,
    Util: Util,
    Validator: Validator
};

return index;

}());
//# sourceMappingURL=securesubmit.js.map
