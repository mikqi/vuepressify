#! /usr/bin/env node

'use strict'
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs')
const chalk = require('chalk')
const log = console.log

module.exports = class {
  constructor (input, flags) {
    this.paths = {
      current: path.resolve(),
      initial: path.resolve(__dirname, 'templates/initial'),
      templates: path.resolve(__dirname, 'templates')
    }
    this.questions = this.listQuestions()
    this.input = input
    this.flags = flags

    this.run()
  }

  async run () {
    if (this.input && this.input.includes('init')) {
      this.init()
    }

    if (this.flags) {
      this.checkFlags()
    }
  }

  async init () {
    this.answers = await inquirer.prompt(this.questions)
    this.paths.docs = this.paths.current + '/' + this.answers.folder
    await fs.copy(this.paths.initial, this.paths.docs)
    await this.formatTemplate('/.vuepress/config.js')
    await this.installVuepress()
  }

  checkFlags () {
    const { generate } = this.flags
    if (typeof generate === 'boolean') {
      log(chalk.red('Generete need value doc name'))
      return false
    }

    if (typeof generate === 'string') {
      return this.generateDocs()
    }
  }

  async generateDocs () {
    const { generate, loc } = this.flags
    this.paths.docs = this.paths.current + '/' + loc
    const directory = this.paths.docs + '/' + generate

    this.answers = {
      pageName: generate
    }

    fs.mkdirSync(directory)
    await fs.copyFileSync(this.paths.templates + '/README.md', directory + '/README.md')
    await this.formatTemplate(`/${generate}/README.md`)
  }

  formatTemplate (file) {
    let configFile = this.paths.docs + file
    let content = fs.readFileSync(configFile, 'utf8')
    content = ejs.render(content, this.answers)
    fs.writeFileSync(configFile, content)
  }

  listQuestions () {
    return [{
      type: 'input',
      name: 'title',
      message: 'Your docs title?'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Your docs description?'
    },
    {
      type: 'input',
      name: 'folder',
      message: 'Your docs default folder?',
      default: 'docs'
    }]
  }

  installVuepress () {
    const { execSync } = require('child_process')
    execSync('pnpm add vuepress', {stdio: [0, 1, 2]})
  }
}
