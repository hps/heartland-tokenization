import { defaults } from "./vars/defaults";

import { Card } from "./Card";
import { DOM } from "./DOM";
import { Events } from "./Events";
import { Frames } from "./Frames";
import { Messages } from "./Messages";
import { Util } from "./Util";

import { HeartlandTokenService } from "./TokenService/HeartlandTokenService";
import { CardinalTokenService } from "./TokenService/CardinalTokenService";

import { Options } from "./types/Options";
import { TokenizationResponse } from "./types/TokenizationResponse";

interface Frame {
  frame?: Window;
  name?: string;
  options?: any;
  target?: string;
  targetNode?: EventTarget;
  url?: string;
}

interface FrameCollection {
  cardNumber?: Frame;
  cardExpiration?: Frame;
  cardCvv?: Frame;
  submit?: Frame;
  child?: Frame;
  parent?: Frame;
}

/**
 * Heartland.HPS
 *
 * Initializes options and adds the default form handler if a `formId` is
 * passed as an option. This expects the default fields (see `getFields`) to
 * be present as children of `formId`.
 */
export class HPS {
  options: Options;
  frames: FrameCollection;
  iframe_url: string;
  Messages: Messages;
  mailbox: any; // [];
  cacheBust: number;
  parent: Window;
  field: string;
  clickHandler: (e: Event) => void;
  loadHandler: () => void;
  receiveMessageHandlerAddedHandler: () => void;

  /**
   * Heartland.HPS (constructor)
   *
   * @constructor
   * @param {Heartland.Options} options [optional]
   * @returns {Heartland.HPS}
   */
  constructor(options?: Options) {
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
      
      if(this.options.env === "cert"){
        if(this.options.iframeTarget !== "" ){
          DOM.addCertAlert(this.options.iframeTarget);
        }else{
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
  tokenize(options?: Options): void {
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
    } else if (this.options.type === 'iframe') {
      this.Messages.post({
        action: 'tokenize',
        data: { publicKey: this.options.publicKey }
      }, 'child');
      return;
    }

    let tokens: { cardinal: TokenizationResponse, heartland: TokenizationResponse } = {
      cardinal: null,
      heartland: null
    };

    const callback = (response: Object) => {
      if ((<any>response).error) {
        Util.throwError(this.options, response);
      } else {
        if (this.options.formId && this.options.formId.length > 0) {
          const heartland = (<any>response).heartland || response;
          DOM.addField(this.options.formId, 'hidden', 'token_value', heartland.token_value);
          DOM.addField(this.options.formId, 'hidden', 'last_four', heartland.last_four);
          DOM.addField(this.options.formId, 'hidden', 'card_exp_year', heartland.exp_year);
          DOM.addField(this.options.formId, 'hidden', 'card_exp_month', heartland.exp_month);
          DOM.addField(this.options.formId, 'hidden', 'card_type', heartland.card_type);
        }

        this.options.success(response);
      }
    };

    const callbackWrapper = (type: string) => {
      return (response: TokenizationResponse) => {
        (<any>tokens)[type] = response;
        if (this.options.cca && tokens.cardinal && tokens.heartland) {
          callback(tokens);
        }
        if (!this.options.cca && tokens.heartland) {
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
  }

  /**
   * Heartland.HPS.configureInternalIframe
   *
   * Sets up a child iframe window to prepare it for communication with the
   * parent and for tokenization.
   *
   * @param {Heartland.Options} options
   */
  configureInternalIframe(options: Options): void {
    this.Messages = new Messages(this);
    this.parent = window.parent;
    this.frames = this.frames || {};
    this.frames.parent = {
      frame: window.parent,
      name: 'parent',
      url: decodeURIComponent(document.location.hash.replace(/^#/, ''))
    };

    this.loadHandler = (function(hps: HPS) {
      return function() {
        DOM.resizeFrame(hps);
      };
    } (this));

    this.receiveMessageHandlerAddedHandler = (function(hps: HPS) {
      return function() {
        hps.Messages.post({ action: 'receiveMessageHandlerAdded' }, 'parent');
      };
    } (this));

    Events.addHandler(window, 'load', this.loadHandler);
    Events.addHandler(document, 'receiveMessageHandlerAdded', this.receiveMessageHandlerAddedHandler);

    this.Messages.receive(Events.frameHandleWith(this), '*');
  };

  /**
   * Heartland.HPS.configureButtonFieldIframe
   *
   * Same as `Heartland.HPS.configureFieldIframe` excet the added click event
   * handler for the button.
   *
   * @param {Heartland.Options} options
   */
  configureButtonFieldIframe(options: Options): void {
    this.configureFieldIframe(options);
    Events.addHandler('heartland-field', 'click', (function(hps: HPS) {
      return function(e: Event) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        hps.Messages.post({ action: 'requestTokenize' }, 'parent');
      };
    } (this)));
  }

  /**
   * Heartland.HPS.configureFieldIframe
   *
   * Sets up a child iframe window to prepare it for communication with the
   * parent and for tokenization.
   *
   * @param {Heartland.Options} options
   */
  configureFieldIframe(options: Options): void {
    const hash = document.location.hash.replace(/^#/, '');
    const split = hash.split(':');
    this.Messages = new Messages(this);
    this.field = split.shift();
    this.parent = window.parent;
    this.frames = this.frames || {};
    this.frames.parent = {
      frame: window.parent,
      name: 'parent',
      url: decodeURIComponent(split.join(':').replace(/^:/, ''))
    };

    window.onerror = (function(hps: HPS) {
      return function(errorMsg: string, url: string, lineNumber: number, column: number, errorObj: any) {
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
    } (this));

    this.loadHandler = (function(hps: HPS) {
      return function() {
        DOM.resizeFrame(hps);
        DOM.configureField(hps);
        const method = 'attach' + window.name.replace('card', '') + 'Events';
        if ((<any>Card)[method]) {
          (<any>Card)[method]('#heartland-field');
        }
      };
    } (this));

    this.receiveMessageHandlerAddedHandler = (function(hps: HPS) {
      return function() {
        hps.Messages.post({ action: 'receiveMessageHandlerAdded' }, 'parent');
      };
    } (this));

    Events.addHandler(window, 'load', this.loadHandler);
    Events.addHandler(document, 'receiveMessageHandlerAdded', this.receiveMessageHandlerAddedHandler);
    Frames.monitorFieldEvents(this, 'heartland-field');

    this.Messages.receive(Events.frameHandleWith(this), '*');
  };

  /**
   * Heartland.HPS.resizeIFrame
   *
   * Called automatically when the child iframe window alerts the parent to
   * resize.
   *
   * @param {HTMLIFrameElement} frame
   * @param {string} height
   */
  resizeIFrame(frame: HTMLIFrameElement, height: string): void {
    if (!frame) { return; }
    frame.style.height = (parseInt(height, 10)) + 'px';
  };

  /**
   * Heartland.HPS.setText
   *
   * Public API for setting an element's inner text.
   *
   * @param {string} elementid
   * @param {string} elementtext
   */
  setText(elementid: string, elementtext: string): void {
    this.Messages.post({ action: 'setText', id: elementid, text: elementtext }, 'child');
  };

  /**
   * Heartland.HPS.setStyle
   *
   * Public API for setting an element's style.
   *
   * @param {string} elementid
   * @param {string} elementstyle
   */
  setStyle(elementid: string, elementstyle: string): void {
    this.Messages.post({ action: 'setStyle', id: elementid, style: elementstyle }, 'child');
  };

  /**
   * Heartland.HPS.appendStyle
   *
   * Public API for appending to an element's style.
   *
   * @param {string} elementid
   * @param {string} elementstyle
   */
  appendStyle(elementid: string, elementstyle: string): void {
    this.Messages.post({ action: 'appendStyle', id: elementid, style: elementstyle }, 'child');
  };

  /**
   * Heartland.HPS.setFocus
   *
   * Public API for appending to an element's style.
   *
   * @param {string} elementid
   */
  setFocus(elementid: string): void {
    this.Messages.post({ action: 'setFocus' }, elementid);
  };

  /**
   * Heartland.HPS.dispose
   *
   * Removes all iframes and event listeners from the DOM.
   */
  dispose(): void {
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
      Events.removeHandler(
        this.options.buttonTarget,
        'click',
        this.clickHandler
      );
    }
    if (this.loadHandler) {
      Events.removeHandler(
        window,
        'load',
        this.loadHandler
      );
    }
    if (this.receiveMessageHandlerAddedHandler) {
      Events.removeHandler(
        document,
        'receiveMessageHandlerAdded',
        this.receiveMessageHandlerAddedHandler
      );
    }
  };

  removeNode(node: Window): void {
    if ((<any>node).remove) {
      (<any>node).remove();
    } else if ((<any>node).parentNode && (<any>node).parentNode.removeChild) {
      (<any>node).parentNode.removeChild(node);
    }
  }
}