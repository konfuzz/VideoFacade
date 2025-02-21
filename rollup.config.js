import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/script.js',
  output: {
    file: 'dist/video-facade.min.js',
    format: 'umd',
    name: 'Video Facade',
  },
  plugins: [resolve(), terser({
    mangle: {
      toplevel: true,
      properties: {
        regex: /^_/,
      },
    },
  })],
};
