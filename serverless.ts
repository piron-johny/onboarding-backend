/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import {
  hello,
  registration,
  login,
  uploadImage,
  authorizer,
} from './src/functions';
import { userTable, imageTable } from './src/tables';

const serverlessConfiguration: AWS = {
  service: 'serverless-typescript',
  frameworkVersion: '3.38.0',
  useDotenv: true,
  custom: {
    bucket: 'images-react-test',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'npm',
    },
    dynamodb: {
      start: {
        port: 5000,
        inMemory: true,
        migrate: true,
      },
      stages: 'dev',
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['codedeploy:*'],
        Resource: '*',
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      metrics: false, // activate to see CacheHits and Misses
    },
    logs: {
      // activate to see API Gateway logs
      restApi: {
        accessLogging: false,
        executionLogging: false,
        level: 'INFO',
        fullExecutionData: false,
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { hello, registration, login, uploadImage, authorizer },
  resources: {
    Resources: {
      UserTable: userTable,
      ImageTable: imageTable,
      ImageBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.bucket}',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
