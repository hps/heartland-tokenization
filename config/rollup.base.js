import typescript from 'rollup-plugin-typescript2';

const override = {compilerOptions: {declaration: true}};

export default {
  input: './src/index.ts',
  output: {
    name: 'Heartland',
    file: './dist/securesubmit.js',
    sourcemap: true,
    format: 'cjs',
  },

  plugins: [typescript({
    tsConfigOverride: override,
    typescript: require('typescript'),
    useTsconfigDeclarationDir: true,
  })],
};
