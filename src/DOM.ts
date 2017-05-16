import {HPS} from "./HPS";

/**
 * @namespace Heartland.DOM
 */
export class DOM {
  /**
   * Heartland.DOM.configureField
   *
   * Configures an input field in a single field iFrame.
   *
   * @param {Heartland.HPS} hps
   */
  public static configureField(hps: HPS) {
    document.getElementById('heartland-field').setAttribute('name', hps.field);
  }

  /**
   * Heartland.DOM.makeFrame
   *
   * Creates a single iFrame element with the appropriate defaults.
   *
   * @param {string} name
   * @returns {HTMLIframeElement}
   */
  public static makeFrame(name: string) {
    const frame = document.createElement('iframe');
    frame.id = 'heartland-frame-' + name;
    frame.name = name;
    frame.style.border = '0';
    frame.frameBorder = '0';
    frame.scrolling = 'no';
    return frame;
  }

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
  public static addField(formParent: string, fieldType: string, fieldName: string, fieldValue: string) {
    const input = document.createElement('input');

    input.setAttribute('type', fieldType);
    input.setAttribute('name', fieldName);
    input.setAttribute('value', fieldValue);

    document.getElementById(formParent).appendChild(input);
  }

  /**
   * Heartland.DOM.setStyle
   *
   * Sets an element's style attribute within a child iframe window.
   *
   * @param {string} elementid
   * @param {string} htmlstyle
   */
  public static setStyle(elementid: string, htmlstyle: string) {
    const el = document.getElementById(elementid);
    if (el) {
      el.setAttribute('style', DOM.encodeEntities(htmlstyle));
    }
  }

  /**
   * Heartland.DOM.appendStyle
   *
   * Appends an element's style attribute within a child iframe window.
   *
   * @param {string} elementid
   * @param {String} htmlstyle
   */
  public static appendStyle(elementid: string, htmlstyle: string) {
    const el = document.getElementById(elementid);
    if (el) {
      const currstyle = el.getAttribute('style');
      const newstyle = (currstyle ? currstyle : '') + htmlstyle;
      el.setAttribute('style', DOM.encodeEntities(newstyle));
    }
  }

  /**
   * Heartland.DOM.setText
   *
   * Sets an element's inner text within a child iframe window.
   *
   * @param {string} elementid
   * @param {string} text
   */
  public static setText(elementid: string, text: string) {
    const el = document.getElementById(elementid);
    if (el) {
      el.textContent = DOM.encodeEntities(text);
    }
  }

  /**
   * Heartland.DOM.setValue
   *
   * Sets an element's value within a child iframe window
   *
   * @param {string} elementid
   * @param {string} value
   */
  public static setValue(elementid: string, text: string) {
    const el = document.getElementById(elementid) as HTMLInputElement;
    if (el && typeof el.value !== "undefined") {
      el.value = DOM.encodeEntities(text);
    }
  }

  /**
   * Heartland.DOM.setPlaceholder
   *
   * Sets an element's placeholder attribute within a child iframe window.
   *
   * @param {string} elementid
   * @param {string} text
   */
  public static setPlaceholder(elementid: string, text: string) {
    const el = document.getElementById(elementid);
    if (el) {
      if (text === '•••• •••• •••• ••••' || text === '••••' || text === '•••'
        || text === '···· ···· ···· ····') {
        el.setAttribute('placeholder', text);
      } else {
        el.setAttribute('placeholder', DOM.encodeEntities(text));
      }
    }
  }

  /**
   * Heartland.DOM.resizeFrame
   *
   * Alerts a parent window to resize the iframe.
   *
   * @param {Heartland.HPS} hps
   */
  public static resizeFrame(hps: HPS) {
    const docHeight = document.body.offsetHeight + 1; // off by one error
    hps.Messages.post({ action: 'resize', height: docHeight }, 'parent');
  }

  /**
   * Heartland.DOM.setFieldData
   *
   * Receives a field value from another frame prior to the tokenization process.
   *
   * @param {string} elementid
   * @param {string} value
   */
  public static setFieldData(elementid: string, value: string) {
    let el = document.getElementById(elementid);
    if (!el && document.getElementById('heartland-field')) {
      el = document.createElement('input');
      el.setAttribute('id', DOM.encodeEntities(elementid));
      el.setAttribute('type', 'hidden');
      document.getElementById('heartland-field-wrapper').appendChild(el);
    }

    if (el) {
      el.setAttribute('value', DOM.encodeEntities(value));
    }
  }

  /**
   * Heartland.DOM.getFieldData
   *
   * Retrieves a field value for another frame prior to the tokenization process.
   *
   * @param {Heartland.HPS} hps
   * @param {string} elementid
   */
  public static getFieldData(hps: HPS, elementid: string) {
    const el: HTMLInputElement = <HTMLInputElement>document.getElementById(elementid);
    if (el) {
      hps.Messages.post({ action: 'passData', value: el.value }, 'parent');
    }
  }

  /**
   * Heartland.DOM.addStylesheet
   *
   * Creates a `style` node in the DOM with the given `css`.
   *
   * @param {Heartland.HPS} hps
   * @param {string} elementid
   */
  public static addStylesheet(css: string) {
    const el = document.createElement('style');
    const elements = document.getElementsByTagName('head');
    el.type = 'text/css';
    el.appendChild(document.createTextNode(css));
    if (elements && elements[0]) {
      elements[0].appendChild(el);
    }
  }

  /**
   * Heartland.DOM.json2css
   *
   * Converts a JSON node to text representing CSS.
   *
   * @param {string} json
   * @returns {string}
   */
  public static json2css(json: Object): string {
    let css = '';
    let attributes: string[];
    let children: Object[];
    let i: number, j: number;
    let key: any, value: any;

    if (attributes = DOM.jsonAttributes(json)) {
      const attributesLength = attributes.length;
      for (i = 0; i < attributesLength; i++) {
        key = attributes[i];
        value = (<any>json)[key];
        if (DOM.isArray(value)) {
          const arrLength = value.length;
          for (j = 0; j < arrLength; j++) {
            css += key + ':' + value[j] + ';';
          }
        } else {
          css += key + ':' + value + ';';
        }
      }
    }

    if (children = DOM.jsonChildren(json)) {
      const childrenLength = children.length;
      for (i = 0; i < childrenLength; i++) {
        key = children[i];
        value = (<any>json)[key];
        css += key + '{' + DOM.json2css(value) + '}';
      }
    }

    return css;
  }

  /**
   * Heartland.DOM.setFocus
   *
   * Sets the focus on an iframe's field.
   *
   * @param {Heartland.HPS} hps
   * @param {string} elementid
   */
  public static setFocus() {
    const el = document.getElementById('heartland-field');
    if (el) {
      el.focus();
    }
  }

  /**
   * Heartland.DOM.addCertAlert
   *
   * Adds an alert letting the developer know they're in sandbox mode
   * 
   * @param {string} elementid
   *
   */
  public static addCertAlert(elementid: string) {
    const el = document.createElement('div');
    const text = document.createTextNode("This page is currently in test mode. Do not use real/active card numbers.");
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
    const container = document.getElementById(elementid);
    const frame = document.getElementById('heartland-frame-cardNumber');
    if(frame){
      container.insertBefore(el, frame);
    }else{
      const frame2 = document.getElementById('heartland-frame-heartland-frame-securesubmit'); 
      container.insertBefore(el, frame2);
    }
  }

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
  private static encodeEntities(value: string) {
    return value.
      replace(/&/g, '&amp;').
      replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (v) {
        const hi = v.charCodeAt(0);
        const low = v.charCodeAt(1);
        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
      }).
      replace(/([^\#-~| |!])/g, function (v) {
        return '&#' + v.charCodeAt(0) + ';';
      }).
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;');
  }

  private static isArray(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  private static jsonAttributes(json: Object): string[] {
    const set: string[] = [];
    for (const i in json) {
      if (json.hasOwnProperty(i)
        && (typeof (<any>json)[i] === 'string' || DOM.isArray((<any>json)[i]))) {
        set.push(i);
      }
    }
    return set;
  }

  private static jsonChildren(json: Object): Object[] {
    const set: Object[] = [];
    for (const i in json) {
      if (json.hasOwnProperty(i)
        && (Object.prototype.toString.call((<any>json)[i]) === '[object Object]')) {
        set.push(i);
      }
    }
    return set;
  }

}