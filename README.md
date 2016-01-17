# compiled
> Compiles the ES* bundle to your NodeJS version on install

[![NPM][compiled-icon] ][compiled-url]

[![Build status][compiled-ci-image] ][compiled-ci-url]
[![semantic-release][semantic-image] ][semantic-url]

Read [JavaScript needs the compile step (on install)](http://glebbahmutov.com/blog/javascript-needs-compile-step/) blog post.

## Install and use

    npm install -S compiled

Add the configuration to your project's `package.json` file 
(I am assuming the root source file is `src/main.js`)

```json
"config": {
  "compiled": {
    "dir": "dist",
    "files": ["src/main.js"]
  }
}
```

You can list multiple files in `files` list - each bundle will be processed separately.

Define the following scripts in the `package.json` 

```json
{
    "scripts": {
        "build": "build",
        "postinstall": "compile"
    },
    "main": "dist/main.compiled.js"
}
```

## Multiple bundles

Good example is the [left-behind](https://github.com/bahmutov/left-behind) repo.
It has the main code and a bin script. Each is compiled separately.

## Debug and development

If you run this code using `DEBUG=compiled` variable, it will print debug log messages.
For example

    $ DEBUG=compiled npm run build
    > compiled@0.0.0-semantic-release test-build /Users/kensho/git/compiled
    > node bin/build.js src/main.js
      compiled building from +0ms src/main.js
      compiled saved bundle +69ms dist/bundle.js
      compiled scanning for es features +39ms dist/bundle.js
      compiled used ES features +15ms [ 'arrow', 'letConst', 'templateString' ]
      compiled saved file with found es features +3ms dist/es6-features.json

### Small print

Author: Gleb Bahmutov &copy; 2016

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/compiled/issues) on Github

## MIT License

Copyright (c) 2016 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[compiled-icon]: https://nodei.co/npm/compiled.png?downloads=true
[compiled-url]: https://npmjs.org/package/compiled
[compiled-ci-image]: https://travis-ci.org/bahmutov/compiled.png?branch=master
[compiled-ci-url]: https://travis-ci.org/bahmutov/compiled
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

