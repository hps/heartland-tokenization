import config from "./rollup.browser.js";
import multiEntry from "rollup-plugin-multi-entry";

config.output.file = "./test/bundle.js";
config.input = [
  "test/util/helpers.ts",
  "test/**/*.test.ts"
];
config.external = [ "chai" ];
config.output.globals = { chai: "chai" };
config.plugins = config.plugins.concat([
  multiEntry({
    exports: false
  }),
]);

export default config;
