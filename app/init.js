#! /usr/bin/env node

'use strict'
const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const ejs = require('ejs')
const chalk = require('chalk')

const {log} = console

module.exports = class {
  constructor(input, flags) {
    this.paths = {
      current: path.resolve(),
      initial: path.resolve(__dirname, 'templates/initial'),
      templates: path.resolve(__dirname, 'templates')
    }
    this.pkg = JSON.parse(fs.readFileSync('package.json').toString()) || {}
    this.questions = this.listQuestions()
    this.input = input
    this.flags = flags

    this.run()
  }

  async run() {
    if (this.input && this.input.includes('init')) {
      this.init()
    }

    if (this.flags) {
      this.checkFlags()
    }
  }

  async init() {
    this.answers = await inquirer.prompt(this.questions)
    this.paths.docs = this.paths.current + '/' + this.answers.folder
    await fs.copy(this.paths.initial, this.paths.docs)
    await this.formatTemplate('/.vuepress/config.js')
    await this.installVuepress()
  }

  checkFlags() {
    const {generate} = this.flags
    if (typeof generate === 'boolean') {
      log(chalk.yellow('did you forget about page name?'))
      log(chalk.yellow('dont forget to add page name like this "vuepressify -g page_name"'))
      return 0
    }

    if (typeof generate === 'string') {
      return this.generateDocs()
    }
  }

  async generateDocs() {
    const {generate, loc} = this.flags
    this.paths.docs = this.paths.current + '/' + loc
    const directory = this.paths.docs + '/' + generate
    const isDocsExists = fs.pathExistsSync(this.paths.docs)
    const isDirectoryExists = fs.pathExistsSync(directory)

    this.answers = {
      pageName: generate
    }

    if (!isDocsExists) {
      log(chalk.yellow('Do you have folder documentation in your project?'))
      log(chalk.yellow('if not, please run "vuepressify init"'))
      return 0
    }

    if (isDirectoryExists) {
      log(chalk.green(`Ooops! this ${generate} page already exist`))
      log(chalk.green(`Try another name.`))
      return 0
    }

    fs.mkdirSync(directory)
    await fs.copyFileSync(this.paths.templates + '/README.md', directory + '/README.md')
    await this.formatTemplate(`/${generate}/README.md`)

    log(chalk.green(`Your new page is already`))
  }

  formatTemplate(file) {
    const configFile = this.paths.docs + file
    let content = fs.readFileSync(configFile, 'utf8')
    content = ejs.render(content, this.answers)
    fs.writeFileSync(configFile, content)
  }

  listQuestions() {
    return [
      {
        type: 'input',
        name: 'title',
        message: 'Your docs title?',
        default: this.pkg.name || ''
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your docs description?',
        default: this.pkg.description || ''
      },
      {
        type: 'input',
        name: 'folder',
        message: 'Your docs default folder?',
        default: 'docs'
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Choose your package manager:',
        choices: ['npm', 'pnpm', 'yarn']
      }
    ]
  }

  appendScripts() {
    const listOfLinePackage = fs
      .readFileSync('package.json')
      .toString()
      .split('\n')

    const includeScripts = val => val.includes('"scripts":')
    const includeDocsScripts = val => val.includes('docs:dev')

    if (listOfLinePackage.findIndex(includeDocsScripts) >= 0) {
      return
    }

    const scriptsLine = listOfLinePackage.findIndex(includeScripts)

    const insertScriptsLine = (packagesFile, lineNumber) => {
      const newPackages = [...packagesFile]
      newPackages.splice(lineNumber + 1, 0, '    "docs:dev": "vuepress dev docs",')
      newPackages.splice(lineNumber + 2, 0, '    "docs:build": "vuepress build docs",')
      return newPackages
    }

    const newPackageJson = insertScriptsLine(listOfLinePackage, scriptsLine).join('\n')

    fs.writeFileSync('package.json', newPackageJson)
  }

  getScripts() {
    switch (this.answers.packageManager) {
      case 'pnpm':
        return 'pnpm add vuepress'
      case 'yarn':
        return 'yarn add vuepress'
      default:
        return 'npm i -s vuepress'
    }
  }

  async installVuepress() {
    const {execSync} = require('child_process')
    this.appendScripts()
    const script = this.getScripts()
    if (process.env.NODE_ENV === 'test') {
      return
    }

    await execSync(script, {stdio: [0, 1, 2]})
    log(`now ${chalk.green('vuepress')} already added to your project`)
    log(
      `Read more about Vuepress config in this link ${chalk.green(
        'https://vuepress.vuejs.org/config/'
      )}`
    )
  }
}
