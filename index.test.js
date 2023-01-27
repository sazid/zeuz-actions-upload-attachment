const wait = require('./wait');
const process = require('process');
const cp = require('child_process');
const path = require('path');

test('throws invalid number', async () => {
  await expect(wait('foo')).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
  const start = new Date();
  await wait(500);
  const end = new Date();
  var delta = Math.abs(end - start);
  expect(delta).toBeGreaterThanOrEqual(500);
});

// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = 100;
//   const ip = path.join(__dirname, 'index.js');
//   const result = cp.execSync(`/Users/mohammedsazidalrashid/.nvm/versions/node/v16.19.0/bin/node ${ip}`, { env: process.env }).toString();
//   console.log(result);
// })

// test('test machine availability', () => {
//   process.env['INPUT_ZEUZ_SERVER_HOST'] = 'https://qa.zeuz.ai/';
//   process.env['INPUT_ZEUZ_API_KEY'] = '';
//   process.env['INPUT_ZEUZ_TEAM_ID'] = 2;
//   process.env['INPUT_ZEUZ_PROJECT_ID'] = 'PROJ-17';
//   process.env['INPUT_NODE_ID'] = 'sazid.*';
//   process.env['INPUT_RETRY_INTERVAL'] = 5;
//   process.env['INPUT_RETRY_TIMEOUT'] = 60;

//   const ip = path.join(__dirname, 'index.js');
//   console.log(ip)
//   const result = cp.execSync(`/Users/mohammedsazidalrashid/.nvm/versions/node/v16.19.0/bin/node ${ip}`, { env: process.env }).toString();
//   console.log(result);
// });
