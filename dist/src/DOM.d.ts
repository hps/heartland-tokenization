import { HPS } from "./HPS";
/**
 * @namespace Heartland.DOM
 */
export declare class DOM {
    /**
     * Heartland.DOM.configureField
     *
     * Configures an input field in a single field iFrame.
     *
     * @param {Heartland.HPS} hps
     */
    static configureField(hps: HPS): void;
    /**
     * Heartland.DOM.makeFrame
     *
     * Creates a single iFrame element with the appropriate defaults.
     *
     * @param {string} name
     * @returns {HTMLIframeElement}
     */
    static makeFrame(name: string): HTMLIFrameElement;
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
    static addField(formParent: string, fieldType: string, fieldName: string, fieldValue: string): void;
    /**
     * Heartland.DOM.setStyle
     *
     * Sets an element's style attribute within a child iframe window.
     *
     * @param {string} elementid
     * @param {string} htmlstyle
     */
    static setStyle(elementid: string, htmlstyle: string): void;
    /**
     * Heartland.DOM.appendStyle
     *
     * Appends an element's style attribute within a child iframe window.
     *
     * @param {string} elementid
     * @param {String} htmlstyle
     */
    static appendStyle(elementid: string, htmlstyle: string): void;
    /**
     * Heartland.DOM.setText
     *
     * Sets an element's inner text within a child iframe window.
     *
     * @param {string} elementid
     * @param {string} text
     */
    static setText(elementid: string, text: string): void;
    /**
     * Heartland.DOM.setValue
     *
     * Sets an element's value within a child iframe window
     *
     * @param {string} elementid
     * @param {string} value
     */
    static setValue(elementid: string, text: string): void;
    /**
     * Heartland.DOM.setPlaceholder
     *
     * Sets an element's placeholder attribute within a child iframe window.
     *
     * @param {string} elementid
     * @param {string} text
     */
    static setPlaceholder(elementid: string, text: string): void;
    /**
     * Heartland.DOM.resizeFrame
     *
     * Alerts a parent window to resize the iframe.
     *
     * @param {Heartland.HPS} hps
     */
    static resizeFrame(hps: HPS): void;
    /**
     * Heartland.DOM.setFieldData
     *
     * Receives a field value from another frame prior to the tokenization process.
     *
     * @param {string} elementid
     * @param {string} value
     */
    static setFieldData(elementid: string, value: string): void;
    /**
     * Heartland.DOM.getFieldData
     *
     * Retrieves a field value for another frame prior to the tokenization process.
     *
     * @param {Heartland.HPS} hps
     * @param {string} elementid
     */
    static getFieldData(hps: HPS, elementid: string): void;
    /**
     * Heartland.DOM.addStylesheet
     *
     * Creates a `style` node in the DOM with the given `css`.
     *
     * @param {Heartland.HPS} hps
     * @param {string} elementid
     */
    static addStylesheet(css: string): void;
    /**
     * Heartland.DOM.json2css
     *
     * Converts a JSON node to text representing CSS.
     *
     * @param {string} json
     * @returns {string}
     */
    static json2css(json: Object): string;
    /**
     * Heartland.DOM.setFocus
     *
     * Sets the focus on an iframe's field.
     *
     * @param {Heartland.HPS} hps
     * @param {string} elementid
     */
    static setFocus(): void;
    /**
     * Heartland.DOM.addCertAlert
     *
     * Adds an alert letting the developer know they're in sandbox mode
     *
     * @param {string} elementid
     *
     */
    static addCertAlert(elementid: string): void;
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
    private static encodeEntities(value);
    private static isArray(obj);
    private static jsonAttributes(json);
    private static jsonChildren(json);
}
