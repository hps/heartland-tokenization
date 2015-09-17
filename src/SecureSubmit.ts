/// <reference path="vars/defaults.ts" />
/// <reference path="vendor/json2.ts" />

/// <reference path="Ajax.ts" />
/// <reference path="DOM.ts" />
/// <reference path="Events.ts" />
/// <reference path="Frames.ts" />
/// <reference path="Messages.ts" />
/// <reference path="Styles.ts" />
/// <reference path="Util.ts" />

module Heartland {
  // Heartland.HPS (constructor)
  //
  // Initializes options and adds the default form handler if a `form_id` is
  // passed as an option. This expects the default fields (see `getFields`) to
  // be present as children of `form_id`.
  export class HPS {
    options: Options;
    frames: any;
    iframe_url: string;
    Messages: Messages;
    mailbox: any; // [];
    cacheBust: number;
    parent: Window;
    field: string;

    constructor(options?: Options) {
      if (!options && window.parent) {
        return;
      }

      this.options = Heartland.Util.applyOptions(defaults, options);
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

    // Heartland.HPS.tokenize
    //
    // Tokenizes card data. Used in manual integrations where the merchant's
    // credit card fields cannot/do not match the names expected in the default
    // form handler (see `getFields`).
    tokenize(options?: Options): void {
      options = options || {};
      if (options) {
        this.options = Heartland.Util.applyOptions(this.options, options);
        this.options = Heartland.Util.getUrlByEnv(this.options);
      }
      if (this.options.type === 'iframe') {
        this.Messages.post({action: 'tokenize', message: this.options.publicKey}, 'child');
        return;
      }
      Heartland.Ajax.call(this.options.type, this.options);
    };

    // Heartland.HPS.configureInternalIframe
    //
    // Sets up a child iframe window to prepare it for communication with the
    // parent and for tokenization.
    configureInternalIframe(options: Options): void {
      var win: any = window.parent;
      this.Messages = new Heartland.Messages(this);
      this.parent = window.postMessage ? win.parent.contentWindow : window.parent;
      this.frames = this.frames || {};
      this.frames.parent = {
        name: 'parent',
        frame: window.parent,
        url: decodeURIComponent(document.location.hash.replace(/^#/, ''))
      };

      Heartland.Events.addHandler(window, 'load', (function (hps: HPS) {
        return function () {
          Heartland.DOM.resizeFrame(hps);
        };
      }(this)));

      Heartland.Events.addHandler(document, 'receiveMessageHandlerAdded', (function (hps: HPS) {
        return function () {
          hps.Messages.post({action: 'receiveMessageHandlerAdded'}, 'parent');
        };
      }(this)));

      this.Messages.receive(Heartland.Events.frameHandleWith(this), '*');
    };

    // Heartland.HPS.configureFieldIframe
    //
    // Sets up a child iframe window to prepare it for communication with the
    // parent and for tokenization.
    configureFieldIframe(options: Options): void {
      var win: any = window;
      var hash = document.location.hash.replace(/^#/, '');
      var split = hash.split(':');
      this.Messages = new Heartland.Messages(this);
      this.field = split.shift();
      this.parent = window.postMessage ? win.parent.contentWindow : window.parent;
      this.frames = this.frames || {};
      this.frames.parent = {
        name: 'parent',
        frame: window.parent,
        url: decodeURIComponent(split.join(':').replace(/^:/, ''))
      };

      Heartland.Events.addHandler(window, 'load', (function (hps: HPS) {
        return function () {
          Heartland.DOM.resizeFrame(hps);
          Heartland.DOM.configureField(hps);
        };
      }(this)));

      Heartland.Events.addHandler(document, 'receiveMessageHandlerAdded', (function (hps: HPS) {
        return function () {
          hps.Messages.post({action: 'receiveMessageHandlerAdded'}, 'parent');
        };
      }(this)));

      this.Messages.receive(Heartland.Events.frameHandleWith(this), '*');
    };

    // Heartland.HPS.resizeIFrame
    //
    // Called automatically when the child iframe window alerts the parent to
    // resize.
    resizeIFrame(frame: HTMLIFrameElement, height: string): void {
      frame.style.height = (parseInt(height, 10)) + 'px';
    };

    // Heartland.HPS.setText
    //
    // Public API for setting an element's inner text.
    setText(elementid: string, elementtext: string): void {
      this.Messages.post({action: 'setText', id: elementid, text: elementtext}, 'child');
    };

    // Heartland.HPS.setStyle
    //
    // Public API for setting an element's style.
    setStyle(elementid: string, elementstyle: string): void {
      this.Messages.post({action: 'setStyle', id: elementid, style: elementstyle}, 'child');
    };

    // Heartland.HPS.appendStyle
    //
    // Public API for appending to an element's style.
    appendStyle(elementid: string, elementstyle: string): void {
      this.Messages.post({action: 'appendStyle', id: elementid, style: elementstyle}, 'child');
    };
  }
}
(<any>window).HPS = Heartland.HPS;
