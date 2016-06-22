# dat-pipe

stream [hypercore](https://github.com/mafintosh/hypercore) feeds over stdin/stdout

```
npm install -g dat-pipe
```

## Usage

```
dat-pipe [<db-path>] <public-key>

  pipe feed <public-key> to stdout (and save feed to <db-path>) 

  --tail, -t            tail feed
  --exit                exit process after download finishes (default: true)

dat-pipe [<db-path>] [<private-key>]

  pipe stdin to feed <private-key> or to a new feed (and save feed to <db-path>) 

  --read, -r            pipe feed to stdout (with --tail set)
  --static, -s          create a static feed
  --no-log, -n          don't log public key (logs key to stdout by default)
  --log, -l             append public key to file log instead of stdout
  --secret              log private key as well
  --exit                exit process after download finishes

general options

  --help, -h            get usage information
  --version, -v         get installed dat version
```

## License

MIT