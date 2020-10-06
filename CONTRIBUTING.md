# Contributing

Thanks for taking the time to contribute to this project!

## How to help?

There are multiple tasks you can do in order to help us, for example:
- fill an issue to report bugs or your specific needs
- contribute to existing issue
- write a PR to improve the project

## Repository structure

All the important files are in the src directory.

## Set up

```shell
$ git clone https://github.com/BetaHuhn/spaces-cli && cd spaces-cli
$ npm ci
```

## Commands
### Linting

[ESlint](https://eslint.org/) is used for linting. It's recommended to add the corresponding extension to your editor. It's also possible to run the `lint` task with the following command: 
```shell
$ npm run lint
```

### Local testing 
```shell
$ npm link
$ spaces-cli
```
