#! /usr/bin/env node

'use strict'
const Vuepressify = require('./init')
const meow = require('meow')

const cli = meow(`
  Integrate Vuepress to your existing project

  Usage
    $ vuepressify init
    or
    $ vuperessify <options>

  Options
    --generate=value,   -g    generate new docs
    --loc=value, -l     -l    set location for generate new docs. default is *docs*
    --help                    show available commands
    --version                 show vuepressify version

  Examples
    $ vuepressify --generate=Foo
    or
    $ vuepressify --generate=Foo --loc=documentation
`, {
  flags: {
    generate: {
      type: 'input',
      alias: 'g'
    },
    loc: {
      type: 'string',
      alias: 'l',
      default: 'docs'
    }
  }
})

new Vuepressify(cli.input[0], cli.flags)
