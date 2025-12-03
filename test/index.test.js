const { handler } = require('../index');

test('handler returns 200 and expected message', async () => {
  const res = await handler({});
  expect(res.statusCode).toBe(200);
  const body = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
  expect(body.message).toBe('API deployed successfully via CI/CD!');
});
