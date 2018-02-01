import { HPS } from "./HPS";
/**
 * @namespace Heartland.Styles
 */
export declare module Styles {
    /**
     * Heartland.Styles.Defaults
     *
     * Collection of helper functions for applying default styles to a child
     * window's fields. Serves as an example of these methods' use in merchant
     * modifications. Each function expects a `Heartland.HPS` object to be passed
     * as an argument.
     */
    const Defaults: {
        body: (hps: HPS) => void;
        cvv: (hps: HPS) => void;
        cvvContainer: (hps: HPS) => void;
        fieldset: (hps: HPS) => void;
        inputsAndSelects: (hps: HPS) => void;
        labelsAndLegend: (hps: HPS) => void;
        selectLabels: (hps: HPS) => void;
        selects: (hps: HPS) => void;
    };
}
