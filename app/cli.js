#! /usr/bin/env node

'use strict'
const meow = require('meow')
const Vuepressify = require('./init')

const cli = meow(`
  Usage
    $ vuepressify init
    or
    $ vuperessify <options>

  Options
    --generate=value,   -g    generate new docs
    --loc=value,        -l    set location for generate new docs. default is *docs*
    --help                    show available commands
    --version                 show vuepressify version

  Examples
    $ vuepressify --generate=new_docs
    or
    $ vuepressify --generate=new_docs --loc=documentation
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

/* eslint no-new:0 */
new Vuepressify(cli.input[0], cli.flags)
