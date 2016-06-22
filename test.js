var tape = require('tape')
var spawn = require('child_process').spawn
var swarmStream = require('hypercore-swarm-stream')
var signatures = require('sodium-signatures')

var keys = signatures.keyPair()
var block0 = 'hello'

tape('dat-pipe writes stdin to feed', function (t) {
  t.plan(1)

  var pipe = spawn('dat-pipe', [keys.secretKey.toString('hex')])
  pipe.stdin.write(block0)

  var stream = swarmStream(keys.publicKey.toString('hex'), { exit: true })
  stream.on('data', function (block) {
    t.equal(block.toString(), block0, 'retrieved block from stdin')
    pipe.kill()
  })
})

tape('dat-pipe writes feed to stdout', function (t) {
  t.plan(1)

  var stream = swarmStream(keys.secretKey.toString('hex'), { exit: true })
  stream.write(block0)

  var pipe = spawn('dat-pipe', [keys.publicKey.toString('hex'), '--no-log'])
  pipe.stdout.on('data', function (block) {
    t.equal(block.toString(), block0, 'retrieved block from stdout')
    pipe.kill()
    stream.end()
  })
})