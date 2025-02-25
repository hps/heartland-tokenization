# ** This repository is no longer maintained!! **
Our current JavaScript library can be found [here](https://github.com/globalpayments/globalpayments-js/tree/master/packages/globalpayments-js#global-payments-javascript-library)


# [SecureSubmit Tokenization Library](https://developer.heartlandpaymentsystems.com/SecureSubmit)

#### PCI Friendly Card Tokenization

This plugin allows you to use your SecureSubmit Public API Key to convert a credit card into a secure Token which can be charged in a PCI friendly way.

Refer to the [Heartland Payment Systems SecureSubmit website](https://developer.heartlandpaymentsystems.com/SecureSubmit/Documentation) for examples.

## Usage

```html
<script src='https://api2.heartlandportico.com/SecureSubmit.v1/token/2.4.1/securesubmit.js'></script>
```

## Building from source

```bash
$ npm install
$ npm run build
```

`npm run build` will perform the following tasks:

1. Clean the `./dist/` directory.
2. Builds the Typescript files into `./dist/securesubmit.js` using `tsconfig.json`.
3. Lints the Typescript files according to `tslint.json`.
4. Minifies `./dist/securesubmit.js` into `./dist/securesubmit.min.js`.
5. Copies the needed `field.html` and `index.html` files into `./dist/`.

## Development

The tokenization library is built in Typescript. The Typescript compiler is available as an add-on for Visual Studio, but it can also be installed independently. This library's `package.json` file also pulls down a copy of the Typescript compiler on `npm install`, which allows it to be used by calling `./node_modules/bin/tsc`.

### Watch files during development

This will compile changes to `./dist/securesubmit.js` but will not update the minified `./dist/securesubmit.min.js`.

```bash
$ npm run watch
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
