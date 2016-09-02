import typescript from "rollup-plugin-typescript";

export default {
  entry: "./src/index.ts",
  dest: "./dist/securesubmit.js",
  sourceMap: true,
  moduleName: "Heartland",
  format: "cjs",

  plugins: [
    typescript()
  ]
}
