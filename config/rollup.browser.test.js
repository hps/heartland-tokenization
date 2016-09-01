import config from "./rollup.browser.js";
import multiEntry from "rollup-plugin-multi-entry";

config.dest = "./test/bundle.js";
config.entry = [
  "test/util/helpers.ts",
  "test/**/*.test.ts"
];
config.external = [ "chai" ];
config.globals = { chai: "chai" };
config.plugins = config.plugins.concat([
  multiEntry({
    exports: false
  }),
]);

export default config;
