#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { IntroToAwsCdkStack } from '../lib/intro-to-aws-cdk-stack';

const app = new cdk.App();
new IntroToAwsCdkStack(app, 'IntroToAwsCdkStack', {
    env: {
        account: 'your account id',
        region: 'the region'
    }
});
app.synth();
