# dat-pipe

stream [hypercore](https://github.com/mafintosh/hypercore) feeds over stdin/stdout

```
npm install -g dat-pipe
```

## Usage

```
dat-pipe [<db-path>] [<private-key>]

  pipe stdin to feed <private-key> or to a new feed (and save feed to <db-path>) 

  --static, -s          create a static feed
  --read, -r            pipe feed to stdout
  --exit, -e            exit process when stdin ends

dat-pipe [<db-path>] <public-key>

  pipe feed <public-key> to stdout (and save feed to <db-path>) 

  --tail, -t            tail feed
  --exit, -e            exit process when download finishes

general options

  --format, -f          separate stdout into lines
  --log, -l             append public key to stdout or to a specified file
  --secret              include secret key in log if --log flag is set and secret key is available
  --help, -h            get this usage information
  --version, -v         get installed dat-pipe version
```

## Examples

**Write and replicate a static feed**
```bash
echo 'hello world' | dat-pipe --static --log
```

**Tail #dat over [hyperirc](https://mafintosh.github.io/hyperirc-www/#4e397d94d0f5df0e2268b2b7b23948b6dddfca66f91c2d452f404202e6d0f626) and save to disk**
```bash
dat-pipe irc.db 4e397d94d0f5df0e2268b2b7b23948b6dddfca66f91c2d452f404202e6d0f626 --start 6000 --format --tail
```

## License

MIT
