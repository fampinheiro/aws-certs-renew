const app = require('../src');

exports.handler = async (event, context) => {
  try {
    await app();
  } catch (e) {
    console.error(e);
  }
};
