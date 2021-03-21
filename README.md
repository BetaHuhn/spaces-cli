<div align="center">

# spaces-cli

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/spaces-cli/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/spaces-cli) [![npm](https://img.shields.io/npm/v/spaces-cli)](https://www.npmjs.com/package/spaces-cli)

Quickly upload and download files from DigitalOcean Spaces.

</div>

## 👋 Introduction

[spaces-cli](https://github.com/BetaHuhn/spaces-cli) lets you quickly upload and download files from DigitalOcean Spaces. You can upload individual files or entire directories to any of your spaces associated with your DigitalOcean account. Instantly get a link to your uploaded files, or download a file simply by providing its Spaces URL.

## 🚀 Get started

Install [spaces-cli](https://github.com/BetaHuhn/spaces-cli) globally via npm:

```shell
npm install -g spaces-cli
```

> Make sure you already have a DigitalOcean Space (of not, you can create one [here](https://m.do.co/c/779397b07aaa))

Then start the interactive setup with:

```shell
spaces-cli setup
```

Or specify all options via [command line arguments](#command-line-arguments) or [environment variables](#environment-variables) on each run.

Refer to the [setup-options](#interactive-setup-command) section for more details on all required and optional configuration options.

After that you are ready to upload/download your files! 🎉

## 📚 Usage

```shell
Usage: spaces-cli [command] [options]

Commands:
  upload|up [options] <files...>  Upload file/s or directories to DO spaces
  download|down [options] <file>  Download file from DO spaces
  config [options]                Output current config
  setup|start [options]           Start interactive setup
  help [command]                  display help for command

Options:
  -t, --upload-to <path>         path to upload file to
  -o, --output <path>            path/file name of downloaded file
  -s, --space <name>             specify the name of your DO space
  -r, --region <name>            specify the region of your space
  -a, --access <permission>      file permission public/private (default: private)
  -i, --access-key-id <key>      space access key id
  -k, --secret-access-key <key>  space secret key
  -c, --custom-domain <name>     specify custom CDN endpoint
  -d, --debug                    enable debug mode (default: false)
  -h, --help                     display help for command
```

Check out the examples [below](#%EF%B8%8F-examples) to help you get started.

## ⚙️ Setup Options

Here are all the options [spaces-cli](https://github.com/BetaHuhn/spaces-cli) takes:

| Name | Description | Env Variable | Command Line Arg | Required |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| *Access Key ID* | Needs to be generated on your DO account page ([here](https://cloud.digitalocean.com/account/api/tokens)) | `ACCESS_KEY_ID` | `--access-key-id` | **Yes** |
| *Secret Access Key* | Needs to be generated on your DO account page ([here](https://cloud.digitalocean.com/account/api/tokens)) | `SECRET_ACCESS_KEY` | `--secret-access-key` | **Yes** |
| *Space Name* | Name of your Space | `SPACE` | `--space` | **Yes** |
| *Space Region* | Region where your Space is located | `REGION` | `--region` | **Yes** |
| *Access* | File permission, either public/private (default: private) | `ACCESS` | `--access` | **No** |
| *Custom Domain* | Use a custom domain/CDN endpoint (only used for output) | `CUSTOM_DOMAIN` | `--custom-domain` | **No** |
| *Upload To* | Specify a upload directory to use | `UPLOAD_TO` | `--upload-to` | **No** |
| *Output* | Path/file name for downloaded file | N/A | `--output` | **Only for download** |
| *Debug* | Enable debug mode to get more output on what's happening | `DEBUG` | `--debug` | **No** |

> **Note:** for convenience, you can also specify the space name and region via one option like this: `--space name.region` or `SPACE=name.region`

There are multiple ways to specify these values. Each of them can either be specified via [command line arguments](#command-line-arguments) (e.g. `--access-key-id xxx`), set as an [environment variable](#environment-variables) (e.g. `ACCESS_KEY_ID=xxx`), or stored permanently in a configuraton file via the [setup command](#interactive-setup-command) (Note: Command line arguments will take precedence over environment variables and the stored configuration file).

The recommended way to use [spaces-cli](https://github.com/BetaHuhn/spaces-cli) is to save your `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY` via the [`setup`](#interactive-setup-command) command once and then specify all other options as command line arguments on each run.

### Command Line Arguments

You can specify each value individually as an command line argument when running any command. Run `spaces-cli help <command>` to see which options are available for each command.

### Interactive Setup Command

If you don't want to specify these values every time you run the command, you can store them permanently in a configuration file.

Start the interactive setup process with this command:

```shell
spaces-cli setup
```

The configuration will be stored in your home directory: `~/.config/configstore/spaces-cli.json` and can be returned at any point with the `config` command.

### Environment Variables

As mentioned above, you can also store the values as environment variables. They have to be uppercase and words need be seperated by underscores, e.g `ACCESS_KEY_ID`.

## 🛠️ Examples

All examples below assume that you have saved your `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY` either via the [`setup`](#interactive-setup-command) command or as [environment variables](#environment-variables). All other options will be specifed as [command line arguments](#command-line-arguments).

### Upload a file

Command:

```shell
$ spaces-cli up file.txt -s space-name -r region
```

Output:

```shell
✔  Uploaded to: http://space-name.region.digitaloceanspaces.com/file.txt
```

**Specify upload path:**

Command:

```shell
$ spaces-cli up file.txt -t /folder/name/file.txt -s space-name -r region
```

Output:

```shell
✔  Uploaded to: http://space-name.region.digitaloceanspaces.com/folder/name/file.txt
```

**Upload multiple files**

Command:

```shell
$ spaces-cli up file.txt file2.txt -t /folder/name/ -s space-name -r region
```

Output:

```shell
✔  Uploaded to: http://space-name.region.digitaloceanspaces.com/folder/name/file.txt
✔  Uploaded to: http://space-name.region.digitaloceanspaces.com/folder/name/file2.txt
```

**Upload directories**

Command:

```shell
$ spaces-cli up /from/folder -t /to/folder -s space-name -r region
```

Output:

```shell
✔  All files uploaded to:  https:/space-name.region.digitaloceanspaces.com/to/folder/
```

### Download a file

Command:

```shell
$ spaces-cli down http://space-name.region.digitaloceanspaces.com/folder/name/file.txt
```

or 

```shell
$ spaces-cli down /folder/name/file.txt -s space-name -r region
```

Output:

```shell
✔  Downloaded to: file.txt
```

**Specify output file:**

Command:

```shell
$ spaces-cli down http://space-name.region.digitaloceanspaces.com/folder/name/file.txt -o newFile.txt
```

Output:

```shell
✔  Downloaded to: newFile.txt
```

## 💻 Development

Issues and PRs are very welcome!

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn build` or `npm run build` to build a single file in the `dist` folder.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). To see differences with previous versions refer to the [CHANGELOG](./CHANGELOG.md).

## ❔ About

This project was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F81S2RK)

Or use my referral link https://m.do.co/c/779397b07aaa to get 100$ Credit on DigitalOcean (I get 25$)

**[spaces-cli](https://github.com/BetaHuhn/spaces-cli) is in no way affiliated with DigitalOcean.**

## 📄 License

Copyright 2021 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.