module.exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: "Hello from Lambda handler!",
      method: event.httpMethod,
      path: event.path,
      query: event.queryStringParameters || {},
      receivedBody: event.body || null
    })
  };
};
