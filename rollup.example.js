import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'example/index.js',
  plugins: [
    babel(),
    nodeResolve(),
  ],
  format: 'iife',
  dest: 'example/bundle.js',
};
