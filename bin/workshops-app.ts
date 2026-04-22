#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WorkshopsAppStack } from '../lib/workshops-app-stack';

const app = new cdk.App();

// Stack para DESARROLLO
new WorkshopsAppStack(app, 'WorkshopsAppStack-Dev', {
  env: { account: '311752057955', region: 'us-east-1' },
  description: 'Workshops API - Dev environment',
  tags: {
    Project: 'Workshops',
    Environment: 'dev',
    ManagedBy: 'CDK'
  }
});

// Stack para PRODUCCIÓN
new WorkshopsAppStack(app, 'WorkshopsAppStack-Prod', {
  env: { account: '311752057955', region: 'us-east-1' },
  description: 'Workshops API - Prod environment',
  tags: {
    Project: 'Workshops',
    Environment: 'prod',
    ManagedBy: 'CDK'
  }
});

app.synth();