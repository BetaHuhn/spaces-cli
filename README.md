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

To use the [spaces-cli](https://github.com/BetaHuhn/spaces-cli) you will need your access and secret key, generate them [here](https://cloud.digitalocean.com/account/api/tokens)

Then add the following environment variables:
```
REGION=DO server region
SPACE=Name of your space
ACCESS_KEY=Your access key
SECRET_KEY=Your secret key
DOMAIN=Your custom domain (optional)
```

## 📚 Usage

```shell
Usage: spaces-cli [options]

Options:
  -v, --version             output the version number
  -u, --upload <file>       uploads file to DO spaces
  -t, --to <path>           path to upload file to
  -d, --download <fileUrl>  download file from DO spaces
  -o, --output <path>       path/file name of downloaded file
  -a, --access <type>       permissions public/private
  -h, --help                display help for command
```

## 🛠️ Examples

### Upload a file

`spaces-cli -u file.txt`

With path:

`spaces-cli -u file.txt -t /folder/name/file.txt`

### Download a file

`spaces-cli -d http://space.fra1.digitaloceanspaces.com/folder/name/file.txt`

With path:

`spaces-cli -d http://space.fra1.digitaloceanspaces.com/folder/name/file.txt -o newFile.txt`

## 💻 Development

Issues and PRs are very welcome!

Run `yarn lint` or `npm run lint` to lint the project.

## ❔ About

This library was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

Or use my referral link https://m.do.co/c/779397b07aaa to get 100$ Credit on DigitalOcean (I get 25$)

## License

Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
