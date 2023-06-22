const ping = require('./ping.js');

test('Expecting pong', () => {
    expect(ping()).toBe('pong');
});