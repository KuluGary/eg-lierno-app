# Lierno app

<div align="center">
<h4>A web application that provides D&D 5e Character Sheet creation, campaign management and Discord bot integration.</h4>
</div>

![Vercel](https://vercelbadge.vercel.app/api/KuluGary/eg-lierno-app?style=flat-square)

## About
Lierno app is a web service that allows you to generate your own character sheets for D&D 5e and integrate with your campaign and Discord server.

## Getting started
This is an official pnpm starter turborepo.

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `client`: a [Next.js](https://nextjs.org) app
- `server`: a [NodeJS](https://nodejs.org/es/) web server
- `bot`: a [NodeJS](https://nodejs.org/es/) [Discord](https://discordbotlist.com/) bot integrated in `client` and `server`
- `dnd-helpers`: a series of utility functions in [TypeScript](https://www.typescriptlang.org/) shared by both `client`, `bot` and `server` applications
- `string-utils`: a series of utility functions in [TypeScript](https://www.typescriptlang.org/) shared by both `client`, `bot` and `server` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm run dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
pnpm dlx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
pnpm dlx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/core-concepts/pipelines)
- [Caching](https://turborepo.org/docs/core-concepts/caching)
- [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/core-concepts/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
