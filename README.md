# Explore.data.gouv.fr

Explore.data.gouv.fr is a UI for [csvapi](https://github.com/opendatateam/csvapi).

## Install

```shell
npm install --save @etalab/explore.data.gouv.fr
```

## Configuring

In order to work with [csvapi](https://github.com/opendatateam/csvapi), CSVAPI front should know its URL.

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

This app runs on Node 22 (see `.nvmrc`) with pnpm, whose version is pinned in `package.json` and installed by corepack.

Install all dependencies and launch the development server

```shell
corepack enable
pnpm install
pnpm run serve
```

You can build a final version using:

```shell
pnpm run build
```

### Environment variables

Build time configuration lives in `.env.production`, which `pnpm run build` loads by itself. Values that are not committed (`VUE_APP_MATOMO_SITE_ID`, `VUE_APP_INCLUSION_TOKEN`) are passed as environment variables, or as Docker build args (`docker build --build-arg VUE_APP_MATOMO_SITE_ID=…`). The dev server does not load `.env.production`: copy it to `.env.development.local` to run the app locally (unlike `.env.local`, it is not loaded by production builds).

Known environment variables are:

- `VUE_APP_DVF_API`, `VUE_APP_TABULAR_API`, `VUE_APP_DATAGOUV_URL`, `VUE_APP_UMAP_INSTANCE`: URLs of the APIs and services the apps use
- `VUE_APP_FILTERS_ENABLED`: boolean, enables or disables filter support
- `VUE_APP_I18N_LOCALE`, `VUE_APP_I18N_FALLBACK_LOCALE`: interface language
- `VUE_APP_MATOMO_SITE_ID`: Matomo site id, enables tracking
- `VUE_APP_INCLUSION_TOKEN`: token for the inclusion detail panel
