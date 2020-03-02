# node-bitly - Unofficial Bitly API for nodejs

[![CircleCI](https://circleci.com/gh/tanepiper/node-bitly.svg?style=svg)](https://circleci.com/gh/tanepiper/node-bitly) [![NPM version](https://badge.fury.io/js/bitly.png)](http://badge.fury.io/js/bitly) [![Dependencies](https://david-dm.org/tanepiper/node-bitly.svg)](https://david-dm.org/tanepiper/node-bitly)

## Current Versions
* [v7.x.x](https://github.com/tanepiper/node-bitly) - Support for Node >=6. Available on npm as `npm install bitly@latest`. Uses V4 of the Bitly API.
* [v6.x.x](https://github.com/tanepiper/node-bitly/tree/v6.x.x) - Support for Node >=6. EOL on 3/1/2020, when Bitly deprecates V3 support.
* [v5.1.x](https://github.com/tanepiper/node-bitly/tree/v5.x.x) - Support for Node >=4. Available on npm as `npm install bitly@stable`

Version 5 is end-of-life and will only recieve minor updates in the future and is considered stable.  This will only ever support the **Bitly v3** API

Version 6 was re-written in Typescript. This version only supports the **Bitly v3** API, which means it reaches EOL when Bitly deprecates V3 on March 1st, 2020.

Version 7 is another rewrite, to support the transition to the V4 of the Bitly API.

### V6.x.x to V7.x.x transition - aka V3 of Bitly API to V4 - Breaking Changes
In March 2020, Bitly deprecated the v3 of their API, and switched to v4. Unfortunately, even with the changes to this package to make it compatible, there are several unavoidable breaking changes. These are summarized below:
 - Endpoints no longer support bulk options (multiple hashes or URLs in a single request)
   - Most importantly, this affects `expand()` and `shorten()`
   - As a general rule of thumb, *none* of the v4 endpoints take bulk inputs
 - Return types have changed, for multiple endpoints
 - DEPRECATED: The `lookup` method and corresponding endpoint have been deprecated

Here is a simple example of how you might have to update your use of node-bitly to account for the change:
```js
// Both versions
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('<accessToken>');

// v6.1.0
async function example(url) {
  const response = await bitly.shorten(url);
  console.log(`Your shortened bitlink is ${response.url}`);
}
// v7.x.x
async function example(url) {
  const response = await bitly.shorten(url);
  console.log(`Your shortened bitlink is ${response.link}`);
}
```

## Module Features

This module provides calls to the [Bitly](http://bitly.com) API for [Nodejs](http://nodejs.org).

For more information on the API request and responses visit the [Bitly API docs](https://dev.bitly.com/v4_documentation.html)

`node-bitly` is programmed with `TypeScript` but is compiled to JavaScript and supports `node 6, 8, 10`.  When you import the client you get full type information.  There maybe be some gaps in the information but this will be filled in, in future releases.

## Installation

To install via NPM type the following: `npm install bitly`

You can also install via git by cloning: `git clone https://github.com/tanepiper/node-bitly.git /path/to/bitly`

## Usage

This library uses the API provided by bitly and requires an OAuth token to use.
To get your access token, visit [OAuth Apps](https://bitly.com/a/oauth_apps) (under Generic Access Token)

See [http://dev.bitly.com](http://dev.bitly.com/) for format of returned objects from the API

To see the available libary APIs, you can view the [API Documentation](http://tanepiper.github.io/node-bitly/index.html) offline, or you can view the index here (the generated documentation does not work on Github).

### Code

#### TypeScript / ES6 Imports

```ts
import { BitlyClient } from 'bitly';
const bitly = new BitlyClient('<accessToken>', {});

async function init() {
  let result;
  try {
    result = await bitly.shorten('https://github.com/tanepiper/node-bitly');
  } catch (e) {
    throw e;
  }
  return result;
}

init();
```

When the library throws an error, it should be the error object response from Bitly, but if something has gone wrong with your internet or intermediate requests, it is possible that a generic AxiosError might get returned. You can use an exported Type Guard to narrow the type:
```ts
import {BitlyClient, isBitlyErrResponse} from 'bitly';
const bitly = new BitlyClient(process.env.BITLY_API_KEY);
let data: BitlyLink;

try {
  data = await bitly.shorten('http://bit.ly/38XaXKy');
} catch (error) {
  if (isBitlyErrResponse(error)) {
    // Inferred type by TS is `BitlyErrorResponse`
    console.log(`Bitly error: ${error.description}`);
  } else if (error.isAxiosError) {
    // Infererred type is `any`, but you can cast to AxiosError safely
    const axiosError = error as unknown as AxiosError;
    console.log(`AxiosError:`, axiosError.toJSON());
  }
}
```

#### JavaScript

```js
const { BitlyClient } = require('bitly');
const bitly = new BitlyClient('<accessToken>', {});

let result;
try {
  result = await bitly.shorten(uri);
} catch(e) {
  throw e;
}
return result;
```

If you are not using `node 8` then you can still use the library with `Promise` values:

```js
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('<accessToken>');

bitly
  .shorten('https://github.com/tanepiper/node-bitly')
  .then(function(result) {
    console.log(result);
  })
  .catch(function(error) {
    console.error(error);
  });
```

You can also do raw requests to any Bitly endpoint. With this you need to pass the access
token to the method

```js
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('<accessToken>');

try {
  return await bitly.bitlyRequest('link/referrers_by_domain', {
    link: 'https://github.com/tanepiper/node-bitly',
    unit: 'hour',
    timezone: 'Europe/Amsterdam'
  });
} catch(e) {
  throw e;
}
```

### Tests

To run tests type `npm test`.

The tests use [`replay`](https://www.npmjs.com/package/replay), which caches the responses from Bitly under the `/fixtures` directory, until you edit a test's requests payload. This means you can run the test suite without having a Bitly API key, until you need to edit or add a new test.

Once you need to run tests that can't use a cached response and actually hit Bitly's API, you will need to pass your API key to the tests by having an environment variable `BITLY_API_KEY` set to the value of your key.

## Support This Project
This module is a side project of mine and I don't actively use the module except to completely over-engineer the CI pipeline and re-write it in Typescript all in the name of learning.  But adding new features has taken a lot of work, so if you use this library a lot please consider donating using the links below. Or if you learned something useful from one of my blog posts talking about the changes I've done with this module please consider leaving a tip.

[![Beerpay](https://beerpay.io/tanepiper/node-bitly/badge.svg?style=beer-square)](https://beerpay.io/tanepiper/node-bitly)  [![Beerpay](https://beerpay.io/tanepiper/node-bitly/make-wish.svg?style=flat-square)](https://beerpay.io/tanepiper/node-bitly?focus=wish)

You can also [PayPal Me](https://paypal.me/tanepiper).
