#!/usr/bin/env node

var createStream = require('hypercore-stream-swarm')
var level = require('level-party')
var through = require('through2')

var opts = require('minimist')(process.argv.splice(2), { alias: {
  r: 'read',
  t: 'tail',
  e: 'exit',
  f: 'format',
  s: 'static',
  l: 'log',
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
if (len === 1) {
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

var stream = createStream(key, opts)

if (stream.write) {
  process.stdin.pipe(stream)
  opts.tail = true
}

if ((stream.live && !stream.secretKey) || opts.read) {
  stream.pipe(through(function (chunk, enc, cb) {
    if (opts.format) chunk += '\r\n'
    this.push(chunk)
    cb()
  })).pipe(process.stdout)
}

if (opts.log) {
  if (stream.live) {
    log(stream.key, stream.secretKey)
  } else {
    stream.feed.on('close', function () {
      log(stream.key, stream.secretKey)
    })
  }
}

function log (key, secretKey) {
  key = (key) ? key.toString('hex') : undefined
  secretKey = (secretKey) ? secretKey.toString('hex') : undefined
  if (opts.log === true) {
    console.log('public key', key)
    if (opts.secret && secretKey) console.log('secret key', secretKey)
  } else {
    var file = require('fs').createWriteStream(opts.log, { flags: 'a' })
    file.write(key)
    if (opts.secret && secretKey) file.write(' ' + secretKey)
    file.write('\n')
    file.end()
  }
}
