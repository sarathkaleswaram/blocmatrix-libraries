# blocmatrix-lib (BlocmatrixAPI)

A JavaScript/TypeScript API for interacting with the BMC Ledger

This is the recommended library for integrating a JavaScript/TypeScript app with the BMC Ledger, especially if you intend to use advanced functionality such as IOUs, payment paths, the decentralized exchange, account settings, payment channels, escrows, multi-signing, and more.

**What is blocmatrix-lib used for?** Here's a [list of applications](APPLICATIONS.md) that use `blocmatrix-lib`. Open a PR to add your app or project to the list!

### Features

+ Connect to a `blocmatrixd` server from Node.js or a web browser
+ Helpers for creating requests and parsing responses for the blocmatrixd API
+ Listen to events on the BMC Ledger (transactions, ledger, validations, etc.)
+ Sign and submit transactions to the BMC Ledger
+ Type definitions for TypeScript

### Requirements

+ **[Node v10](https://nodejs.org/)** is recommended. Other versions may work but are not frequently tested.
+ **[Yarn](https://yarnpkg.com/)** is recommended. `npm` may work but we use `yarn.lock`.

### Install

In an existing project (with `package.json`), install `blocmatrix-lib`:
```
$ yarn add blocmatrix-lib
```

### Mailing Lists

We have a low-traffic mailing list for announcements of new blocmatrix-lib releases. (About 1 email per week)

If you're using the BMC Ledger in production, you should run a blocmatrixd server and subscribe to the blocmatrix-server mailing list as well.


## Development

To build the library for Node.js and the browser:
```
$ yarn build
```

The TypeScript compiler will [output](./tsconfig.json#L7) the resulting JS files in `./dist/npm/`.

webpack will output the resulting JS files in `./build/`.

For details, see the `scripts` in `package.json`.

## Running Tests

### Unit Tests

1. Clone the repository
2. `cd` into the repository and install dependencies with `yarn install`
3. `yarn test`

### Linting

Run `yarn lint` to lint the code with `tslint`.

## Generating Documentation

Do not edit `./docs/index.md` directly because it is a generated file.

Instead, edit the appropriate `.md.ejs` files in `./docs/src/`.

If you make changes to the JSON schemas, fixtures, or documentation sources, update the documentation by running `yarn run docgen`.