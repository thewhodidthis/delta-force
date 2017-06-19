import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'example/index.js',
  dest: 'example/bundle.js',
  format: 'iife',
  plugins: [
    babel(),
    nodeResolve(),
  ],
};
