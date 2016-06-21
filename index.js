#!/usr/bin/env node

var fs = require('fs')
var minimist = require('minimist')
var memdb = require('memdb')
var level = require('level-party')
var encoding = require('dat-encoding')
var hypercore = require('hypercore')
var createSwarm = require('hyperdrive-archive-swarm')

var opts = require('minimist')(process.argv.splice(2), { alias: { s: 'static', t: 'tail', l: 'log', e: 'exit', v: 'version', h: 'help' }, boolean: ['static', 'tail', 'exit', 'secret'] })
var len = opts._.length

process.title = 'dat-pipe'

if (opts.version) {
  var pkg = require('./package.json')
  console.log(pkg.version)
  process.exit(0)
}

if (opts.help) {
  console.log(require('./usage')('root.txt'))
  process.exit(0)
}

if (len == 1) {
  try {
    var key = encoding.decode(opts._[0])
  } catch (e) {
    var path = opts._[0]
  }
} else {
  var path = opts._[0]
  var key = opts._[1]
}

delete opts._

var db = (path) ? level(path) : memdb()
var core = hypercore(db)
var feed = core.createFeed(key, { live: !opts.static })

var read = !!key
var write = !key
var swarm

if (read) {
  var rs = feed.createReadStream({ live: !!opts.tail })
  rs.pipe(process.stdout)

  swarm = createSwarm(feed)
  rs.on('end', function () {
    if (opts.exit === undefined || opts.exit) swarm.node.close()
  })
}

if (write) {
  var ws = feed.createWriteStream(opts)
  process.stdin.pipe(ws)

  if (opts.static) {
    ws.on('finish', function () {
      swarm = swarm || createSwarm(feed)
      if (opts.exit) swarm.node.close()
      log(feed)
    })
  } else {
    swarm = swarm || createSwarm(feed)
    log(feed)
    ws.on('finish', function () {
      if (opts.exit) swarm.node.close()
    })
  }
}

function log (feed) {
  var key = feed.key.toString('hex')
  var secret = feed.secretKey.toString('hex')
  if (opts.log === undefined) {
    console.log('public key', key)
    if (opts.secret && secret) console.log('secret key', secret)
  } else {
    opts.log = (typeof opts.log === 'boolean') ? 'dat-pipe.log' : opts.log
    var file = fs.createWriteStream(opts.log, { flags: 'a' })
    file.write(key)
    if (opts.secret && secret) file.write(' '+secret)
    file.end()
  }
}