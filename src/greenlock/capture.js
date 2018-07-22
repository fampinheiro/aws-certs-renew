module.exports = (domain, listener) => {
  const writer = process.stdout.write;

  process.stdout.write = parser;
  const l = () => {
    if (process.stdout.write !== writer) {
      process.stdout.write = writer;
      process.stdin.emit('data', '\n');
    }
  };

  return l;

  async function parser(value) {
    if (value.indexOf(domain) === 0) {
      const [domain, secret] = value.split('\t');
      const options = {
        domain,
        secret
      };
      return listener(options).then(l);
    }
  }
};
