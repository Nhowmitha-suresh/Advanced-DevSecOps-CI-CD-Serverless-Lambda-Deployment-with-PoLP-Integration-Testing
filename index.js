// index.js
exports.handler = async (event) => {
    // This is the expected response format for a Lambda Function URL with the default payload format (2.0)
    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "API deployed successfully via the CI/CD pipeline!",
            version: process.env.VERSION || "staging"
        }),
    };
    return response;
};