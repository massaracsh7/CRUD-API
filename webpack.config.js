import { resolve as _resolve } from 'path';
import { EnvironmentPlugin } from 'webpack';
import { config } from 'dotenv';
config();
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import ESLintPlugin from 'eslint-webpack-plugin';
import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';

let scriptExec;

if (process.argv[2] === '--mode=production') {
  scriptExec = 'node dist/server.js';
} else {
  scriptExec = 'nodemon dist/server.js --watch';
}


export const entry = './src/server.ts';
export const module = {
  rules: [{
    test: /\.ts?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },],
};
export const output = {
  filename: 'server.js',
  path: _resolve(__dirname, 'dist')
};
export const resolve = {
  extensions: ['.ts', '.js'],
  alias: {
    'http': require.resolve('http'),
  },
};
export const plugins = [
  new EnvironmentPlugin(['PORT']),
  new WebpackShellPluginNext({
    onBuildEnd: {
      scripts: [scriptExec],
      blocking: false,
      parallel: true
    }
  }),
  new ESLintPlugin({
    emitError: true,
    emitWarning: true,
    failOnError: true
  }),
  new NodeTargetPlugin()
];