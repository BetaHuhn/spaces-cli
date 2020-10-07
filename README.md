<div align="center">

# spaces-cli

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/spaces-cli/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/spaces-cli) [![npm](https://img.shields.io/npm/v/spaces-cli)](https://www.npmjs.com/package/spaces-cli)

Quickly upload and download files from DigitalOcean Spaces.

</div>

## 👋 Introduction

[spaces-cli](https://github.com/BetaHuhn/spaces-cli) lets you quickly upload and download files from DigitalOcean Spaces. You can specify where to upload your files and instantly get a link back.

## 🚀 Get started

Install [spaces-cli](https://github.com/BetaHuhn/spaces-cli) via npm:
```shell
npm install spaces-cli
```

> Create your own DigitalOcean Space [here](https://m.do.co/c/779397b07aaa)

On the first run [spaces-cli](https://github.com/BetaHuhn/spaces-cli) will ask you to input a few values:

- *Access Key* - Needs to be generated on your account page ([here](https://cloud.digitalocean.com/account/api/tokens))
- *Secret Key* - Needs to be generated on your account page ([here](https://cloud.digitalocean.com/account/api/tokens))
- *Space Region* - Region where your Space is located
- *Space Name* - Name of your Space
- *Custom Domain* - Your custom domain to access your space (optional)
- *Default file permission* - private (default) / public, can be specified on each run with -a option (optional)

The configuration will be stored in your home directory: `~/.config/configstore/spaces-cli.json`

## 📚 Usage

```shell
Usage: spaces-cli [options] [command]

Commands:
  upload|up [options] <files...>  upload file/s or directories to DO spaces
  download|down [options] <file>  download file from DO spaces
  config                          output current config
  help [command]                  display help for command

Options:
  -t, --to <path>                 path to upload file to
  -o, --output <path>             path/file name of downloaded file
  -a, --access <type>             set file permissions to public/private
  -v, --version                   output the version number
  -h, --help                      display help for command
```

## 🛠️ Examples

### Upload a file

Command:

```shell
$ spaces-cli up file.txt
```

Output:

```shell
✔  Uploaded to: http://space.fra1.digitaloceanspaces.com/file.txt
```

**Specify upload path:**

Command:

```shell
$ spaces-cli up file.txt -t /folder/name/file.txt
```

Output:

```shell
✔  Uploaded to: http://space.fra1.digitaloceanspaces.com/folder/name/file.txt
```

**Upload multiple files**

Command:

```shell
$ spaces-cli up file.txt file2.txt -t /folder/name/
```

Output:

```shell
✔  Uploaded to: http://space.fra1.digitaloceanspaces.com/folder/name/file.txt
✔  Uploaded to: http://space.fra1.digitaloceanspaces.com/folder/name/file2.txt
```

**Upload directories**

Command:

```shell
$ spaces-cli up /from/folder -t /to/folder -r
```

> Note: -r enables recursive upload, so all subfolders and files are uploaded too

Output:

```shell
✔  All files uploaded to:  https:/space.fra1.digitaloceanspaces.com/to/folder/
```

### Download a file

Command:

```shell
$ spaces-cli down http://space.fra1.digitaloceanspaces.com/folder/name/file.txt
```

or 

```shell
$ spaces-cli down /folder/name/file.txt
```

Output:

```shell
✔  Downloaded to: file.txt
```

**Specify output file:**

Command:

```shell
$ spaces-cli down http://space.fra1.digitaloceanspaces.com/folder/name/file.txt -o newFile.txt
```

Output:

```shell
✔  Downloaded to: newFile.txt
```

## 💻 Development

Issues and PRs are very welcome!

Run `yarn lint` or `npm run lint` to lint the project.

Please check out the [contributing guide](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## ❔ About

This library was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

Or use my referral link https://m.do.co/c/779397b07aaa to get 100$ Credit on DigitalOcean (I get 25$)

**[spaces-cli](https://github.com/BetaHuhn/spaces-cli) is in no way affiliated with DigitalOcean.**

## License

Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
