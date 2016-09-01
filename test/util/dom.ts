import * as jsdom from "jsdom";
import * as fs from "fs";

// setup the simplest document possible
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

// get the window object out of the document
var win = doc.defaultView;

// add securesubmit.js
var script = doc.createElement('script');
script.type = 'text/javascript';
var securesubmit = fs.readFileSync('./dist/securesubmit.js');
script.innerHTML = securesubmit.toString();
var head = win.document.getElementsByTagName('head')[0];
head.appendChild(script);
win = doc.defaultView;

// set globals for mocha that make access to document and window feel
// natural in the test environment
(<any>global).document = doc;
(<any>global).window = win;

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(win);

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window: Window) {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) {continue;}
    if (key in global) {continue;}

    (<any>global)[key] = window[key];
  }
}
