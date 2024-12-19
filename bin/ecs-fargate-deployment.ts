#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcsFargateCdkStack } from '../lib/ecs-fargate-cdk-stack';

const app = new cdk.App();
new EcsFargateCdkStack(app, 'EcsFargateCdkStack');
