# VuePressify ![license mit](https://img.shields.io/github/license/mikqi/vuepressify.svg?longCache=true&style=flat-square) [![Twitter](https://img.shields.io/twitter/url/https/github.com/mikqi/vuepressify.svg?style=flat-square)](https://twitter.com/intent/tweet?text=Add%20Vuepress%20to%20your%20existing%20project%20with%20Vuepressify%20🎉🎉%20:&url=https%3A%2F%2Fgithub.com%2Fmikqi%2Fvuepressify)


> Add Vuepress documentation to your existing project with one command

## Usage
First, you must install [NodeJS](https://nodejs.org) then you can add Vuepress to your existing project using this command:

```
$ npx vuepressify init
```
or you can install globally
```
$ npm i -g vuepressify
$ vuepressify init
```

and then it will ask you several question.

You can generate new docs with this commands too.

```
$ vuepressify --generate newDocs --loc myDocs
```
or you can simply like this
```
$ vuepressify -g newDocs --l myDocs
```
flag `generate` is required if you want to generate new docs and `loc` is `optional` by default it will set to `docs` folder

## How to run documentation

Add this script to your `package.json`. more detail read [this](https://vuepress.vuejs.org/guide/getting-started.html#inside-an-existing-project)

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

## Built with
* [meow]()
* [inquirer]()
* [chalk]() 
* [ejs]()
* [fs-extra]()

## License
MIT © [Mikqi](http://this.rivki.id)