# CSVAPI Front

CSVAPI Front is a UI for [csvapi](https://github.com/opendatateam/csvapi).

## Install

```shell
npm install --save csvapi-front
```

## Configuring

In order to work with [csvapi](https://github.com/opendatateam/csvapi), Data Explorer should know its URL.

You can either provide a default one at build time (see [Envrionment variables](#environment-variables)) or provide one at runtime.
To provide a runtime configuration, just define a `<meta name="csvapi-url" />` in your html with the `content` attribute containing the CSVAPI URL.

**ex:**
```html
<meta name="csvapi-url" content="https://link.to/my/csvapi" />
```

## Parameters

This UI expect a `url` query string to be able to load a tabular file.

## Development

### Getting started

This app has been tested under Node v10.

Install all dependencies and laucnh the development server

```shell
npm install
npm run serve
```

You can build a final version using:

```shell
npm run build
```

### Environment variables

You can provide some build time configuration using a `.env` file (see the `.env.sample`).

Knwon environment variables are:

- `VUE_APP_CSVAPI_URL`: CSVAPI instance URL
