# Serverless Boilerplate

## Description
This project is a simple serverless boilerplate that includes a frontend and backend. It is a great starting point for those seeking a trusted AWS foundation for applications.

Use this as a boilerplate project to create authentication services, business logic, async workers, all on AWS Lambda, API Gateway, and EventBridge and MongoDB.

This is a true serverless architecture, so you only pay for what you use, not for idle time. Some services, like DynamoDB, may have additional storage costs.

# Features

- **Full-Stack Application**
  - Backend: API (AWS API Gateway V2, AWS Lambda), Database (MongoDB Atlas)
  - Frontend: Vanilla React app.
- **Built-In Authentication**
  - API Gateway authorizer
  - Login & Registration API on Lambda with Express.js
  - MongoDB collection to store user information
  - Shared library to provide JWT token authentication
  - Frontend website that uses login & registration API
- **Multi-Environment**
  - Shared configuration for all services.
  - Separated configuration for different environments.
- **CI/CD with Github Action**
  - Github Actions to deploy the services to production.

# Getting Started

## 1. Install dependencies

**Install Serverless Framework**

```
npm i -g serverless
```

**Install NPM dependencies**

This project is structured as a monorepo with multiple services. Each service
has its own `package.json` file, so you must install the dependencies for each
service. Running `npm install` in the root directory will install the
dependencies for all services.

```
npm install
```

**Setup AWS Credentials**

If you haven't already, setup your AWS Credentials. You can follow the [AWS Credentials doc](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)
for step-by-step instructions.

## 2. Deploy & start developing

Now you are ready to deploy the services. This will deploy all the services
to your AWS account. You can deploy the services to the `default` stage, which
is the default stage for development.

**Deploy the services**

```
serverless deploy
```

At this point the service is live. When running the `serverless deploy` command,
you will see the output of the services that were deployed. One of those
services is the `web` service, which is the website service. To view the app,
go to the URL in the `endpoint: ANY - ` section for the `web` service.

```
Deploying "web" to stage "dev" (us-east-1)

endpoint: ANY - https://ps5s7dd634.execute-api.us-east-1.amazonaws.com
functions:
  app: web-dev-app (991 kB)

```

Once you start developing it is easier to run the service locally for faster
iteration. We recommend using [Serverless Dev Mode](https://www.serverless.com/framework/docs/providers/aws/cli-reference/dev).
You can run Dev Mode for individual services. This emulates Lambda locally and
proxies requests to the real service.

```
serverless user dev
```

Once done, you can redeploy individual services using the `serverless` command
with the service name.

```
serverless user deploy
```

The `website` service is a static website that is served from an AWS Lambda
function. As such, it can run locally without needing to use Dev Mode. However,
it has a dependency on the Auth service, so you must
configure environment variables locally.

```
# If you have the jq CLI command installed you can use that with the --json flag
# on serverless info to get the URLs from the deployed services. If you do not
# have jq installed, you can get the URLs by running "serverless auth info" and
# "serverless ai-chat info" and copying the URLs manually into the environment
# variables.
export VITE_AUTH_API_URL=$(serverless auth info --json | jq -r '.outputs[] | select(.OutputKey == "AuthApiUrl") | .OutputValue')

# now you can run the local development server
cd website/app
npm run dev
```

## 4. Prepare & release to prod

Now that the app is up and running in a development environment, let's get it
ready for production by setting up a custom domain name, and setting a new
shared secret for JWT token authentication.

### Setup Custom Domain Name (optional)

This project is configured to use custom domain names. For non `prod`
deployments this is disabled. Deployments to `prod` are designed to use a custom
domain name and require additional setup:

**Register the domain name & create a Route53 hosted zone**

If you haven't already, register a domain name, and create a Route53 hosted zone
for the domain name.

https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones?region=us-east-1#

**Create a Certificate in AWS Certificate Manager**

A Certificate is required in order to use SSL (`https`) with a custom domain
name. AWS Certificate Manager (ACM) provides free SSL certificates for use with
your custom domain name. A certificate must first be requested, which requires
verification, and may take a few minutes.

https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates/list

After you have created the certificate, you must validate the certificate by
following the instructions in the AWS Console. This may require adding a CNAME
record to your DNS provider.

This example uses a Certificate with the following full qualified domain names:

```

serverlessboilerplate.com
\*.serverlessboilerplate.com

```

The base domain name, `serverlessboilerplate.com` is used for the website service
to host the static website. The wildcard domain name,
`*.serverlessboilerplate.com` is used for the API services,
`api.serverlessboilerplate.com`.

**Update serverless-compose.yml**

- Update the `stages.prod.params.customDomainName` to your custom domain name.
- Update the `stages.prod.params.customDomainCertificateARN` to the ARN of the
  certificate you created in ACM.

### Create the secret for JWT token authentication

Authentication is implemented using JWT tokens. A shared secret is used to sign
the JWT tokens when a user logs in. The secret is also used to verify the JWT
tokens when a user makes a request to the API. It is important that this secret
is kept secure and not shared.

In the `serverless-compose.yml` file, you'll see that the `sharedTokenSecret` is
set to `"DEFAULT"` in the `stages.default.params` section. This is a placeholder
value that is used when the secret is not provided in non-prod environments.

The `prod` stage uses the `${ssm}` parameter to retrieve the secret from AWS
Systems Manager Parameter Store.

Generate a random secret and store it in the AWS Systems Manager Parameter Store
with a key like `/serverless-boilerplate/shared-token`, and set it in the
`stages.prod.params.sharedTokenSecret` parameter in the `serverless-compose.yml`
file:

```
sharedTokenSecret: ${ssm:/serverless-boilerplate/shared-token}
```

### Deploy to prod

Once you've setup the custom domain name (optional), and created the secret, you
are ready to deploy the service to prod.

```

serverless deploy --stage prod

```

Now you can use the service by visiting your domain name.

# API Usage

Below are a few simple API requests using the `curl` command.

## User Registration API

```
curl -X POST https://api.serverlessboilerplate.com/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email": "me@example.com", "password": "password"}'
```

## User Login API

```
curl -X POST https://api.serverlessboilerplate.com/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "me@example.com", "password": "password"}'
```

If you have `jq` installed, you can wrap the login request in a command to set
the token as an environment variable so you can use the token in subsequent
requests.

```
export SERVERLESS_EXAMPLE_TOKEN=$(curl -X POST https://api.serverlessboilerplate.com/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "me@example.com", "password": "password"}' \
| jq -r '.token')
```

## Deploying with CI/CD

Using Github Actions this example deploys all the services using Serverless
Compose. This ensures that any changes to the individual services or the
`serverless-compose.yml` will reevaluate the interdependent parameters. However,
all services are redeployed on any change in the repo, which may not be
necessary.

Consider using a more fine-grained approach to deploying services, such as
only deploying the services that have changed by using the `serverless <service>
deploy` command.
