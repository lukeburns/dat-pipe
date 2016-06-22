#!/usr/bin/env node

var minimist = require('minimist')
var swarmStream = require('hypercore-swarm-stream')
var level = require('level-party')

var opts = require('minimist')(process.argv.splice(2), { alias: { 
  r: 'read',
  s: 'static', 
  t: 'tail', 
  e: 'exit', 
  l: 'log', 
  n: 'no-log',
  v: 'version', 
  h: 'help' 
}})
var len = opts._.length

process.title = 'dat-pipe'

if (opts.help) {
  console.log(require('./usage')('root.txt'))
  process.exit(0)
}

if (opts.version) {
  var pkg = require('./package.json')
  console.log(pkg.version)
  process.exit(0)
}

var path, key
if (len == 1) {
  if (opts._[0].length === 64 || opts._[0].length === 128) {
    key = opts._[0]
  } else {
    path = opts._[0]
  }
} else {
  path = opts._[0]
  key = opts._[1]
}

opts.db = (typeof path === 'string') ? level(path) : undefined

delete opts._

var stream = swarmStream(key, opts)

if (!!stream.write) {
  process.stdin.pipe(stream)
  opts.tail = true
}

if (!stream.secretKey || opts.read) {
  stream.pipe(process.stdout)
}

if (!opts['no-log']) {
  if (stream.live) {
    log(stream.key, stream.secretKey)
  } else {
    stream.on('finish', function () {
      log(stream.key, stream.secretKey)
    })
  }
}

function log (key, secretKey) {
  var key = key.toString('hex')
  var secret = (secretKey) ? secretKey.toString('hex') : undefined
  if (opts.log === undefined) {
    console.log('public key', key)
    if (opts.secret && secret) console.log('secret key', secret)
  } else if (opts.log !== false) {
    opts.log = (typeof opts.log === 'boolean') ? 'dat-pipe.log' : opts.log
    var file = require('fs').createWriteStream(opts.log, { flags: 'a' })
    file.write(key)
    if (opts.secret && secret) file.write(' '+secret)
    file.write('\n')
    file.end()
  }
}