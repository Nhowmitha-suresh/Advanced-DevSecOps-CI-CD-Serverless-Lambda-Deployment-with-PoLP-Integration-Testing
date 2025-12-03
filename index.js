// index.js
module.exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "API deployed successfully",
      timestamp: new Date().toISOString()
    })
  };
};
