'use strict';

require('shelljs/make');

const assert = require('assert');
const path = require('path');
const babel = require('babel-core');
const glob = require('glob');

const home = path.resolve(__dirname, '..');
const nbin = path.resolve(home, 'node_modules', '.bin');

const mocha = path.join(nbin, 'electron-mocha');
const lint = path.join(nbin, 'eslint');

process.env.ELECTRON_PATH = require('electron-prebuilt');


target.lint = () => {
  exec(`${lint} --color src test static scripts`);
};


target.test = () => {
  target['lint']();
  target['test-browser']();
  target['test-renderer']();
};

target['test-renderer'] = (pattern) => {
  pattern = pattern || 'test/**/*_test.js';
  let files = glob.sync(pattern, { ignore: 'test/browser/*' });

  exec(`${mocha} --renderer ${files.join(' ')}`, { silent: false });
};

target['test-browser'] = (pattern) => {
  pattern = pattern || 'test/browser/**/*_test.js';
  let files = glob.sync(pattern);

  exec(`${mocha} ${files.join(' ')}`, { silent: false });
};


target.compile = () => {
};

target['compile-js'] = (pattern) => {
  new glob
    .Glob(pattern || 'src/**/*.{js,jsx}')
    .on('error', (err) => fail('compile-js', err))

    .on('match', (file) => {
      let src = path.relative(home, file);
      let dst = src.replace('src', 'lib');

      assert(src.startsWith('src'));
      console.log('compiling %s to %s', src, dst);

      babel.transformFile(src, (err, result) => {
        if (err) return fail('compile-js', err);

        mkdir('-p', path.dirname(dst));
        result.code.to(dst);
      });
    });
};

target.clean = () => {
  rm('-rf', path.join(home, 'lib'));
  rm('-rf', path.join(home, 'dist'));
};


function fail(mod, reason) {
  console.error('[%s] %s', mod, reason);
}

// We need to make a copy when exposing targets to other scripts,
// because any method on target can be called just once per execution!
module.exports = Object.assign({}, target);
