import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.es',
  plugins: [
    babel(),
  ],
  targets: [
    {
      format: 'iife',
      moduleName: 'deltaForce',
      dest: 'dist/delta-force.js'
    },
    {
      format: 'cjs',
      dest: 'index.js',
    }
  ]
};
