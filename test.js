import path from 'path'
import test from 'ava'
import execa from 'execa'
import fs from 'fs-extra'
import run, {ENTER} from 'inquirer-test'

const stats = fs.statSync
const cliPath = path.resolve(__dirname, 'app/cli.js')

test('success add new docs', async t => {
  await execa('./app/cli.js', ['-g=newDocs'])
  t.true(stats('./docs/newDocs').isDirectory())
})

test('add vuepress', async t => {
  await run([cliPath, 'init'], ['docs test', ENTER, 'description test', ENTER, ENTER])
  t.true(stats('./docs').isDirectory())
})
