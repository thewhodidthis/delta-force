import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.es',
  interop: false,
  plugins: [
    babel(),
    nodeResolve(),
  ],
  external: [
    'bipolar'
  ],
  globals: {
    'bipolar': 'bipolar'
  },
  targets: [
    {
      format: 'iife',
      sourceMap: true,
      moduleName: 'DeltaForce',
      dest: 'dist/delta-force.js'
    },
    {
      format: 'cjs',
      dest: 'index.js',
    }
  ]
};
