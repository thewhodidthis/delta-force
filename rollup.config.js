import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.es',
  plugins: [
    babel(),
    nodeResolve(),
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
