# Automated Serverless API Deployment (CI/CD)

This repository provides a minimal example of a Node.js AWS Lambda function and a GitHub Actions pipeline that lints, tests, and deploys the function using the Serverless Framework.

Quick start

- Create a new repository and push these files to the `main` branch.
- In the repository Settings → Secrets, add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for an IAM user that can deploy Lambda (for example AWSLambdaFullAccess for simplicity).
- Commit to `main` — the workflow at `.github/workflows/main.yml` will run automatically.

Additional setup for the advanced secured CI/CD pipeline

- Create two GitHub Environments: `staging` and `production`.
	- In the repository, go to Settings → Environments → New environment.
	- For `production`, optionally require reviewers in the environment protection rules so deployments require manual approval.
- Add the following repository Secrets (Settings → Secrets → Actions):
	- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` — credentials for the GitHub Actions IAM user (see PoLP policy below).
	- `LAMBDA_STAGING_ROLE_ARN` — an IAM Role ARN to be used as the Lambda execution role when creating the Staging Lambda (only required if the pipeline must create the Lambda function automatically).
	- `LAMBDA_PRODUCTION_ROLE_ARN` — same for Production (required only if creating the production Lambda from the workflow).

IAM least-privilege policy

An example policy that limits the deploy user to only the actions necessary for this pipeline is provided at `iam/lambda-deploy-policy.json`. It covers:
- Lambda creation / update / function URL management
- `iam:PassRole` for a narrowly-named execution role
- CloudWatch Logs write permissions

Notes about deployment behavior

- The `main` workflow (runs on `push` to `main`) builds, lints, tests, packages a zip artifact, deploys to the `serverless-ci-cd-api-staging` Lambda (create or update), ensures a public Lambda Function URL exists, and then runs integration tests against that URL.

Serverless license configuration

- A placeholder `.serverlessrc` file is included at the repository root. It contains a placeholder license key.
- For CI/CD you should set the repository secret `SLS_LICENSE_KEY` to your real Serverless Framework license key. The workflows will write `~/.serverlessrc` automatically from that secret before running `serverless` commands.
- The `promote` workflow triggers on new semantic Git tags like `v1.2.3`. It runs the packaging steps again in the tag context and deploys to `serverless-ci-cd-api-prod` in the `production` environment (which can enforce manual approvals).
- For security, the workflows use `aws-actions/configure-aws-credentials@v2` and rely on the narrowed IAM policy for the deploy user. For first-time creation of a Lambda, you must provide a Lambda execution role ARN via the `LAMBDA_STAGING_ROLE_ARN` or `LAMBDA_PRODUCTION_ROLE_ARN` secrets.

Testing the pipeline locally

- To run the same packaging locally:
```powershell
cd 'c:\Users\Lenovo\Desktop\Automated Serverless API Deployment (CICD)'
npm ci
npm run lint
npm test
npm run package
```

After running `npm run package` you can inspect `function.zip` which is what the workflows use when deploying via the AWS CLI.


What the pipeline does

- `code_quality`: Runs `eslint` and fails on lint errors.
- `test`: Runs `jest` unit tests.
- `deploy_to_aws`: Uses GitHub Secrets to configure AWS credentials and runs `npx serverless deploy` to deploy the Lambda.

Invoke the function

After a successful deploy, Serverless Framework will print the HTTP endpoint (HTTP API). You can also view the created function in the AWS Console.

Notes

- For production use, narrow the IAM permissions to the minimal needed actions rather than `AWSLambdaFullAccess`.
- If you prefer native AWS CLI deployment, replace the Serverless steps in the workflow with packaging + `aws lambda` CLI commands.

Where to put your real Serverless license key

- Locally: replace the placeholder value inside `.serverlessrc` with your real key.
- In GitHub Actions: add the secret `SLS_LICENSE_KEY` (Settings → Secrets → Actions) — the workflows will write it to `$HOME/.serverlessrc` automatically.
